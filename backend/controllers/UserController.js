const User = require('../models/Users');
const Role = require('../models/role');

// GET /api/users?role=technician&q=search
exports.list = async (req, res) => {
  try {
    const { role: roleKey, q } = req.query;
    let filter = {};
    if (roleKey) {
      // find role id for key
      const role = await Role.findOne({ key: roleKey });
      if (role) filter.role = role._id;
      else return res.json([]);
    }
    if (q) {
      const re = new RegExp(q, 'i');
      filter.$or = [{ username: re }, { email: re }, { phoneNumber: re }];
    }

    const users = await User.find(filter).select('-password -otp -otpExpires').lean();
    res.json(users);
  } catch (err) {
    console.error('List users error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/users/:id
exports.get = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -otp -otpExpires').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Get user error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
