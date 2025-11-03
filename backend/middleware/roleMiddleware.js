// backend/middleware/roleMiddleware.js

exports.requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(403).json({ message: 'Access denied. No role assigned.' });
      }

      // Determine user role (nested object or string)
      const userRole =
        req.user.role.name || // If using Role model (Mongoose)
        req.user.role ||       // If role is plain string
        null;

      if (!userRole) {
        return res.status(403).json({ message: 'Access denied. Role not found.' });
      }

      // Check if user's role matches one of the allowed roles
      if (allowedRoles.map(r => r.toLowerCase()).includes(userRole.toLowerCase())) {
        return next();
      }

      return res.status(403).json({
        message: `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}`,
      });
    } catch (err) {
      console.error('Role middleware error:', err);
      res.status(500).json({ message: 'Role check failed', error: err.message });
    }
  };
};
