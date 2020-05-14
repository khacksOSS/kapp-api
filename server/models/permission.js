const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  feature: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  permissions: {
    create: {
        type: Boolean,
        default: false
    },
    read: {
        type: Boolean,
        default: false
    },
    write: {
        type: Boolean,
        default: false
    },
    delete: {
        type: Boolean,
        default: false
    },
  }
});

module.exports = mongoose.model('Permission', permissionSchema);