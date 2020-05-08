const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  regId: {
    type: String,
    required: true,
  },
  macAddress: {
    type: String,
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
    type: [String]
  }
});

module.exports = mongoose.model('Student', studentSchema);