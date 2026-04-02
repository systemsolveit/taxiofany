const { Schema, model } = require('mongoose');

const translationSchema = new Schema(
  {
    locale: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    key: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    value: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

translationSchema.index({ locale: 1, key: 1 }, { unique: true });

module.exports = model('Translation', translationSchema);
