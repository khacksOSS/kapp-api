const mongoose = require('mongoose');

/**
 * @swagger
 *  components:
 *    schemas:
 *      Permission:
 *        type: object
 *        required:
 *          - feature
 *          - role
 *        optional:
 *          -permissions
 *        properties:
 *          feature:
 *            type: string
 *            description: Title of the feature
 *          role:
 *            type: string
 *            description: Wheather its student, teacher, admin
 *          permissions:
 *            type: Object
 *            description: Permissions for read write update delete access
 *        example:
 *           feature: 'article'
 *           role: 'admin'
 *           permissions: { create: true, read: true, write: true, delete: true }
 *    securitySchemes:
 *      bearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 *      featureAccess:
 *        type: apiKey
 *        in: header
 *        name: feature
 */

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
      default: false,
    },
    read: {
      type: Boolean,
      default: false,
    },
    write: {
      type: Boolean,
      default: false,
    },
    delete: {
      type: Boolean,
      default: false,
    },
  },
});

module.exports = mongoose.model('Permission', permissionSchema);
