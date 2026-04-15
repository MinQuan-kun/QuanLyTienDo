const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: '',
    },
    targetValue: {
      type: Number,
      required: true,
      default: 0,
    },
    unit: {
      type: String,
      default: '%',
    },
    fileUrl: {
      type: String,
      default: '',
    },
    driveFileId: {
      type: String,
      default: '',
    },
    driveFileName: {
      type: String,
      default: '',
    },
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
    },
    yearlyData: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'YearlyProgress',
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Section', sectionSchema);