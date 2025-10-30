// backend/seedRoles.js
const Role = require('./models/role');

module.exports = async function seedRoles() {
  const roles = [
    { key: 'admin', name: 'Admin', description: 'System administrator with full access' },
    { key: 'auditor', name: 'Auditor', description: 'Can audit and review reports' },
    { key: 'technician', name: 'Technician', description: 'Handles maintenance and logs reports' },
  ];

  for (const role of roles) {
    const exists = await Role.findOne({ key: role.key });
    if (!exists) {
      await Role.create(role);
      console.log(`✅ Seeded role: ${role.key}`);
    }
  }
};
