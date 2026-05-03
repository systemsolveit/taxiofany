const { Schema, model } = require('mongoose');

const bootstrapMarkerSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    value: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('BootstrapMarker', bootstrapMarkerSchema);
