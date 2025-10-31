// backend/seedAllRoles.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/Users');
const Role = require('./models/role');
const Lab = require('./models/lab');
const Unit = require('./models/unit');

(async () => {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);

    // 🧩 STEP 1: Ensure roles exist
    const roles = ['Admin', 'Technician', 'Auditor'];
    for (const roleName of roles) {
      const existing = await Role.findOne({ name: roleName });
      if (!existing) {
        await Role.create({ name: roleName });
        console.log(`✅ Created role: ${roleName}`);
      } else {
        console.log(`ℹ️ Role already exists: ${roleName}`);
      }
    }

    // 🧩 STEP 2: Create sample users
    const usersData = [
      { username: 'adminUser', email: 'admin@example.com', password: 'admin123', firstName: 'Admin', lastName: 'User', role: 'Admin' },
      { username: 'techUser', email: 'tech@example.com', password: 'tech123', firstName: 'Tech', lastName: 'User', role: 'Technician' },
      { username: 'auditUser', email: 'audit@example.com', password: 'audit123', firstName: 'Audit', lastName: 'User', role: 'Auditor' },
    ];

    for (const u of usersData) {
      const role = await Role.findOne({ name: u.role });
      const existingUser = await User.findOne({ email: u.email });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        const newUser = await User.create({
          email: u.email,
          username: u.username,
          firstName: u.firstName,
          lastName: u.lastName,
          password: hashedPassword,
          role: role._id,
          isVerified: true,
        });
        console.log(`✅ Created ${u.role}: ${newUser.username} (${u.email})`);
      } else {
        console.log(`ℹ️ ${u.role} already exists: ${u.email}`);
      }
    }

    // 🧩 STEP 3: Create labs
    let labs = await Lab.find();
    if (labs.length === 0) {
      labs = await Lab.insertMany([
        { name: 'Physics Lab' },
        { name: 'Chemistry Lab' },
        { name: 'Computer Lab' },
      ]);
      console.log('✅ Created 3 labs');
    } else {
      console.log('ℹ️ Labs already exist');
    }

    // 🧩 STEP 4: Assign sample units to technician
    const technician = await User.findOne({ email: 'tech@example.com' });
    const existingUnits = await Unit.find({ assignedTo: technician._id });

    if (existingUnits.length === 0) {
      const units = [
        { name: 'Microscope', lab: labs[0]._id, status: 'functional' },
        { name: 'Centrifuge', lab: labs[1]._id, status: 'maintenance' },
        { name: 'Computer #1', lab: labs[2]._id, status: 'out-of-order' }, // ✅ fixed spelling
        { name: 'Computer #2', lab: labs[2]._id, status: 'functional' },
        { name: 'Spectrometer', lab: labs[1]._id, status: 'functional' },
        { name: 'Laser Device', lab: labs[0]._id, status: 'maintenance' },
      ];

      const assignedUnits = units.map(u => ({ ...u, assignedTo: technician._id }));
      await Unit.insertMany(assignedUnits);
      console.log(`✅ Created ${assignedUnits.length} units assigned to ${technician.username}`);
    } else {
      console.log('ℹ️ Technician units already exist');
    }

    console.log('\n🌿 Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
})();
