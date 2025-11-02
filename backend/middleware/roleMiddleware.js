// backend/middleware/roleMiddleware.js

exports.requireRole = (requiredRole) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(403).json({ message: 'Access denied. No role assigned.' });
      }

      // ✅ Match role by name (string)
      if (req.user.role.name && req.user.role.name.toLowerCase() === requiredRole.toLowerCase()) {
        return next();
      }

      // ✅ OR match directly if stored as string (e.g., "technician")
      if (typeof req.user.role === 'string' && req.user.role.toLowerCase() === requiredRole.toLowerCase()) {
        return next();
      }

      return res.status(403).json({ message: `Access denied. ${requiredRole} role required.` });
    } catch (err) {
      console.error('Role middleware error:', err);
      res.status(500).json({ message: 'Role check failed', error: err.message });
    }
  };
};
