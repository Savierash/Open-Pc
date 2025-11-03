// backend/server.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const seedRoles = require("./seedRoles");

// ✅ Middlewares
const { protect } = require("./middleware/authMiddleware");
const { requireRole } = require("./middleware/roleMiddleware");

// ✅ Routers
const technicianRouter = require("./routes/technician");
const labsRouter = require("./routes/labs");
const unitsRouter = require("./routes/units");
const dashboardRouter = require("./routes/dashboard");
const authRouter = require("./routes/auth");
const forgetPasswordRouter = require("./routes/forgetPassword");
const reportRouter = require("./routes/reports");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const auditorRouter = require("./routes/auditor");
const techRequestRoutes = require("./routes/techRequestRoutes");
const documentRoutes = require("./routes/documentRoutes");

// ✅ Safety logs for debugging
process.on("uncaughtException", (err) => {
  console.error("\n❌ UNCAUGHT EXCEPTION\n", err.stack);
});
process.on("unhandledRejection", (reason) => {
  console.error("\n⚠️ UNHANDLED PROMISE REJECTION\n", reason);
});

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/openpc";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

// ✅ Serve uploaded files (important for document uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Middleware
app.use(express.json());
app.use(
  cors({
    origin: [CLIENT_ORIGIN, "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH",],
  })
);

// ✅ Root Route
app.get("/", (req, res) => res.send("✅ Open-PC API is running"));

// ✅ API Routes
app.use("/api/auth", authRouter);
app.use("/api/forgot-password", forgetPasswordRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/technician", technicianRouter);
app.use("/api/reports", reportRouter);
app.use("/api/units", unitsRouter);
app.use("/api/labs", labsRouter);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auditor", auditorRouter);
app.use("/api/documents", documentRoutes);
app.use("/api/tech-requests", techRequestRoutes);

// ✅ Nested Lab → Units Route
app.get("/api/labs/:labId/units", (req, res, next) => {
  req.query.labId = req.params.labId;
  return unitsRouter(req, res, next);
});

// ✅ 404 Handler (Catch all unmatched API routes)
app.use("/api", (req, res) => {
  console.warn(`⚠️ 404 - No API route found for ${req.originalUrl}`);
  res
    .status(404)
    .json({ message: "API route not found", path: req.originalUrl });
});

// ✅ Global Error Handler (Prevents crashing on runtime errors)
app.use((err, req, res, next) => {
  console.error("🔥 Unhandled server error:", err.stack || err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal server error" });
});

// ✅ MongoDB Connect + Seed Default Roles
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected successfully");
    await seedRoles(); // ensure roles like admin, technician, auditor exist
    startServer();
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.stack || err);
    startServer(); // still start Express to show errors gracefully
  });

function startServer() {
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  });
}
