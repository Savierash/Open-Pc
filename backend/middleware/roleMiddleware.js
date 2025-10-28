// roleMiddleware.js
// Simple role-based access control using the `role` field present on JWT payload.
// The AuthController signs tokens with `role` set to the role key (string) when available.

const requireRole = (...allowed) => (req, res, next) => {
  const userRole = req.user && req.user.role;
  if (!userRole) return res.status(403).json({ message: 'Role required' });

  if (allowed.includes(userRole)) return next();

  return res.status(403).json({ message: 'Forbidden: insufficient role' });
};

module.exports = { requireRole };
