const mongoose = require("mongoose");

const TarifZoneSchema = new mongoose.Schema(
  {
    montant: {
      type: Number,
      require: true,
      default : 0
    },
    zoneA: {type: mongoose.Schema.Types.ObjectId, ref: 'zone'},
    zoneB: {type: mongoose.Schema.Types.ObjectId, ref: 'zone'},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("tarifZone", TarifZoneSchema);
