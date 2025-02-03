const mongoose = require("mongoose");

const WalletSchema = new mongoose.Schema(
  {
    solde: {
      type: Number,
      require: true,
      default: 0
    },
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'}
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("wallet", WalletSchema);
