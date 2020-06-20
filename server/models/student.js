const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  regId: {
    type: String,
    unique: true,
    required: true,
  },
  macAddress: {
    type: String,
    unique: true,
    required: true,
  },
  programme: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  dept: {
    type: String,
    required: true,
  },
  groups: {
    type: [String],
  },
  role: {
    type: String,
    default: 'student',
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Student', studentSchema);
