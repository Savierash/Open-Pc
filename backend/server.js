// backend/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const seedRoles = require('./seedRoles');

// ✅ Middlewares
const { protect } = require('./middleware/authMiddleware');
const { requireRole } = require('./middleware/roleMiddleware');

// ✅ Routers
const technicianRouter = require('./routes/technician');
const labsRouter = require('./routes/labs');
const unitsRouter = require('./routes/units');
const dashboardRouter = require('./routes/dashboard');
const authRouter = require('./routes/auth');
const forgetPasswordRouter = require('./routes/forgetPassword');
const reportRouter = require('./routes/reports');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const auditorRouter = require('./routes/auditor');

// ✅ Safety logs
process.on('uncaughtException', (err) => {
  console.error('\n UNCAUGHT EXCEPTION\n', err.stack);
});
process.on('unhandledRejection', (reason) => {
  console.error('\n UNHANDLED REJECTION\n', reason);
});

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/openpc';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// ✅ Static folder for uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Middleware
app.use(express.json());

// ✅ CORS setup
app.use(cors({
  origin: [CLIENT_ORIGIN, 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// ✅ Root Route
app.get('/', (req, res) => res.send('API up ✔'));

// ✅ API Routes
app.use('/api/auth', authRouter);
app.use('/api/forgot-password', forgetPasswordRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/technician', technicianRouter);
app.use('/api/reports', reportRouter);
app.use('/api/units', unitsRouter);
app.use('/api/labs', labsRouter);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auditor', auditorRouter);

// ✅ Nested Lab --> Units Route
app.get('/api/labs/:labId/units', (req, res, next) => {
  req.query.labId = req.params.labId;
  return unitsRouter(req, res, next);
});

// ✅ 404 Handler
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API route not found', path: req.originalUrl });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack || err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

// ✅ MongoDB Connect + Seed Roles
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    await seedRoles();
    startServer();
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.stack || err);
    startServer();
  });

function startServer() {
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
  });
}
