// backend/services/UnitService.js
const Unit = require('../models/unit');
const Lab = require('../models/lab');

exports.getUnitCounts = async (filter = {}) => {
  return {
    totalUnits: await Unit.countDocuments(filter),
    functional: await Unit.countDocuments({ ...filter, status: { $regex: /^functional$/i } }),
    maintenance: await Unit.countDocuments({ ...filter, status: { $regex: /^maintenance$/i } }),
    outOfOrder: await Unit.countDocuments({ ...filter, status: { $regex: /^out of order$/i } }),
  };
};

exports.getUnitsByFilter = async (filter = {}) => {
  return await Unit.find(filter).populate('lab', 'name').sort({ name: 1 });
};

exports.getPerLabSummary = async () => {
  return await Lab.aggregate([
    {
      $lookup: {
        from: 'units',
        localField: '_id',
        foreignField: 'lab',
        as: 'units',
      },
    },
    {
      $project: {
        name: 1,
        totalUnits: { $size: '$units' },
        functional: {
          $size: {
            $filter: {
              input: '$units',
              as: 'u',
              cond: { $regexMatch: { input: '$$u.status', regex: /^functional$/i } },
            },
          },
        },
        maintenance: {
          $size: {
            $filter: {
              input: '$units',
              as: 'u',
              cond: { $regexMatch: { input: '$$u.status', regex: /^maintenance$/i } },
            },
          },
        },
        outOfOrder: {
          $size: {
            $filter: {
              input: '$units',
              as: 'u',
              cond: { $regexMatch: { input: '$$u.status', regex: /^out of order$/i } },
            },
          },
        },
      },
    },
  ]);
};
