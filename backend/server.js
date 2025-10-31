// backend/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const seedRoles = require('./seedRoles');

const technicianRouter = require('./routes/technician');
const labsRouter = require('./routes/labs');
const unitsRouter = require('./routes/units');
const dashboardRouter = require('./routes/dashboard');
const authRouter = require('./routes/auth');
const forgetPasswordRouter = require('./routes/forgetPassword');
const reportRouter = require('./routes/reports');

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION', err && err.stack ? err.stack : err);
});
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION', reason && reason.stack ? reason.stack : reason);
});

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/openpc';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Middleware
app.use(express.json());

// -- CORS --
app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With']
}));

// Simple test route
app.get('/', (req, res) => res.send('API up'));

// Mount auth, forgot-password, dashboard
app.use('/api/auth', authRouter);
app.use('/api/forgot-password', forgetPasswordRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/technician', technicianRouter);
app.use('/api/reports', reportRouter);
app.use('/api/units', unitsRouter);
app.use('/api/labs', labsRouter);
app.use('/api/lab', labsRouter);


app.get('/api/labs/:labId/units', (req, res, next) => {
  req.query.labId = req.params.labId;
  return unitsRouter(req, res, next);
});

app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API route not found', path: req.originalUrl });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

// Connect to Mongo and start server
mongoose.connect(MONGO_URI)
  .then(async() => {
    console.log('Mongo connected');
    await seedRoles();
    startServer();
  })
  .catch((err) => {
    console.error('Mongo connection error (starting server anyway):', err && err.stack ? err.stack : err);
    startServer();
  });

function startServer() {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}
