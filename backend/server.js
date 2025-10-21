// backend/server.js
require('dotenv').config();

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION', err && err.stack ? err.stack : err);
});

process.on('unhandledRejection', (reason, p) => {
  console.error('UNHANDLED REJECTION', reason && reason.stack ? reason.stack : reason);
});

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/openpc';

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send('API up'));

// wrap requires so missing-module errors are obvious
try {
  app.use('/api/auth', require('./routes/auth'));
} catch (err) {
  console.error('Failed to mount routes/auth:', err && err.stack ? err.stack : err);
}

// Try to connect to Mongo, but do not crash the app silently
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Mongo connected');
    startServer();
  })
  .catch((err) => {
    console.error('Mongo connection error (will still try to start server):', err && err.stack ? err.stack : err);
    // If you prefer to stop when DB unavailable, uncomment:
    // process.exit(1);
    startServer();
  });

function startServer() {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}
