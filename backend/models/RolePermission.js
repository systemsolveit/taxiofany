const { Schema, model } = require('mongoose');

const ROLE_ENUM = ['super_admin', 'admin', 'dispatcher', 'driver', 'customer'];

const rolePermissionSchema = new Schema(
  {
    role: {
      type: String,
      required: true,
      unique: true,
      enum: ROLE_ENUM,
      trim: true,
      lowercase: true,
      index: true,
    },
    permissions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  RolePermission: model('RolePermission', rolePermissionSchema),
  ROLE_ENUM,
};
