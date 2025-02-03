const mongoose = require("mongoose");

const QuatierSchema = new mongoose.Schema(
  {
    nomquartier: {
      type: String,
      require: true,
    },
    tarif: {
      type: Number,
      require: true
    },
    nomZone: {
      type: String
    },
    zone: {type: mongoose.Schema.Types.ObjectId, ref: 'zone'}
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("quartier", QuatierSchema);