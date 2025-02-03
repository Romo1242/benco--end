const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    montant: {type: Number},
    // course: {type: mongoose.Schema.Types.ObjectId, ref: 'course'},
    type: {
      type: String,
      enum: ['crédit','débit'],
    },
    wallet: {type: mongoose.Schema.Types.ObjectId, ref: 'wallet'}
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("transaction", TransactionSchema);
