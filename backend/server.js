// backend/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const labsRouter = require('./routes/labs');
const unitsRouter = require('./routes/units');
const dashboardRouter = require('./routes/dashboard');
const authRouter = require('./routes/auth');
const forgetPasswordRouter = require('./routes/forgetPassword');

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
// For development use a specific origin (CLIENT_ORIGIN). For quick debugging you can set origin: true.
// Make sure CLIENT_ORIGIN matches your frontend (eg http://localhost:3000 or http://localhost:5173)
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

// Mount units and labs — use plural to match frontend expectations
app.use('/api/units', unitsRouter);
app.use('/api/labs', labsRouter);

// Optional alias: accept singular '/api/lab' too (helps old clients/devs)
app.use('/api/lab', labsRouter);

// Ensure nested lab units path works: internal forward to unitsRouter
// This sets req.query.labId and calls the unitsRouter middleware directly (no external redirect)
app.get('/api/labs/:labId/units', (req, res, next) => {
  req.query.labId = req.params.labId;
  return unitsRouter(req, res, next);
});

// JSON 404 for unmatched API routes (prevents default HTML 404)
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API route not found', path: req.originalUrl });
});

// Global error handler - returns JSON for errors
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

// Connect to Mongo and start server
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Mongo connected');
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
