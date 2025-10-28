const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
    status: { type: String, enum: ['open', 'in_progress', 'closed'], default: 'open' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('report', reportSchema);
const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
  status: { type: String, enum: ['open','in-progress','resolved','closed'], default: 'open' },
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);
