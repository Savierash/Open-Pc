// backend/scripts/seedDB.js
require('dotenv').config();
const mongoose = require('mongoose');
const Lab = require('../models/lab');
const Unit = require('../models/unit');
const Report = require('../models/report');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/openpc';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to mongo');

  // clear (be careful in prod)
  await Report.deleteMany({});
  await Unit.deleteMany({});
  await Lab.deleteMany({});

  const labsData = ['ITS 300', 'PTC 201', 'MCLAB'];
  const labs = [];
  for (const name of labsData) {
    const l = await Lab.create({ name });
    labs.push(l);
  }

  // create units for ITS 300 (10 PCs)
  const itsLab = labs.find(l => l.name === 'ITS 300');
  const units = [];
  for (let i = 1; i <= 10; i++) {
    const id = `ITS300-PC-${String(i).padStart(3, '0')}`;
    const status = (i === 2 || i === 10) ? 'Out Of Order' : (i === 3 || i === 8 || i === 9) ? 'Maintenance' : 'Functional';
    const unit = await Unit.create({
      name: id,
      lab: itsLab._id,
      status,
      os: 'Windows 10',
      ram: '8GB',
      storage: '256GB',
      cpu: 'i5',
      lastIssued: '',
      technicianId: ''
    });
    units.push(unit);
  }

  // create a couple sample reports matching your UI examples
  await Report.create({
    unit: units[1]._id,
    lab: itsLab._id,
    technicianId: '01593',
    dateIssued: 'October 22, 2025',
    lastIssued: 'September 1, 2025',
    status: 'Out Of Order',
    issues: { ramIssue: true, osIssue: true, cpuIssue: false, noInternet: true, storageIssue: false, virus: false },
    otherIssues: 'No Signal on the monitor'
  });

  await Report.create({
    unit: units[9]._id,
    lab: itsLab._id,
    technicianId: '01594',
    dateIssued: 'October 20, 2025',
    lastIssued: 'August 28, 2025',
    status: 'Out Of Order',
    issues: { ramIssue: false, osIssue: false, cpuIssue: true, noInternet: false, storageIssue: true, virus: false },
    otherIssues: 'Hard drive failure'
  });

  console.log('Seed complete');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
