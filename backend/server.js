// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // ensure this file exists
const authRoutes = require('./routes/auth'); // ensure this file exists
const labsRoutes = require('./routes/labs'); // ensure this file exists
const app = express();

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Simple health check route (helpful while debugging)
app.get('/health', (req, res) => res.json({ ok: true, time: Date.now() }));

// Routes (register after middlewares)
app.use('/api/auth', authRoutes);
app.use('/api/labs', labsRoutes);

// test route
app.get('/', (req, res) => res.send('API is running'));

// Global error handler (should catch async errors forwarded by next(err))
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Server error' });
});

// Connect DB then start server
const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1); // ensures nodemon shows the crash
  }
};

start();
