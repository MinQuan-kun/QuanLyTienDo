const mongoose = require('mongoose');

const yearlyProgressSchema = new mongoose.Schema(
  {
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    actualValue: {
      type: Number,
      required: true,
      default: 0,
    },
    targetValue: {
      type: Number,
      default: 0,
    },
    note: {
      type: String,
      default: '',
    },
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

// Index to ensure unique year per section
yearlyProgressSchema.index({ section: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('YearlyProgress', yearlyProgressSchema);
