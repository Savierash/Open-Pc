// backend/server.js
require('dotenv').config();
const labsRouter = require('./routes/labs');
const unitsRouter = require('./routes/units'); 
const dashboardRouter = require('./routes/dashboard');

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION', err && err.stack ? err.stack : err);
});

process.on('unhandledRejection', (reason, p) => {
  console.error('UNHANDLED REJECTION', reason && reason.stack ? reason.stack : reason);
});

const express = require('express');
const cors = require('cors'); 
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/openpc';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

//for lab and units routes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});


// === Middleware ===
app.use(express.json());

// Configure CORS properly BEFORE routes
app.use(cors({
  origin: CLIENT_ORIGIN,   // must be an explicit origin when using credentials
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Optional test route
app.get('/', (req, res) => res.send('API up'));

// === Routes (mount after middleware) ===
try {
  app.use('/api/auth', require('./routes/auth'));
} catch (err) {
  console.error('Failed to mount routes/auth:', err && err.stack ? err.stack : err);
}

//for dashboard route
app.use('/api/dashboard', dashboardRouter);
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});


// api routes for labs and units
app.use('/api/lab', labsRouter);
app.use('/api/units', unitsRouter);

app.get('/api/lab/:labId/units', async (req, res, next) => {
  // simple internal forward: redirect to /api/units?labId=...
  req.url = `/api/units?labId=${req.params.labId}`;
  return unitsRouter.handle(req, res, next);
});


// === Connect to MongoDB and start server ===
// Note: modern mongoose driver doesn't need useNewUrlParser/useUnifiedTopology options
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Mongo connected');
    startServer();
  })
  .catch((err) => {
    console.error('Mongo connection error (will still try to start server):', err && err.stack ? err.stack : err);
    // If you'd rather stop the process on DB failure, uncomment:
    // process.exit(1);
    startServer();
  });

function startServer() {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}


