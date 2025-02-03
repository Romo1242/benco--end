const mongoose = require("mongoose");

const ZoneSchema = new mongoose.Schema(
  {
    nomZone: {
      type: String,
      require: true,
    },
    tarif: {
      type: Number,
      require: true
    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("zone", ZoneSchema);
