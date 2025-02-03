const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      require: true,
    },
    chauffeur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      // require: true,
    },
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'transaction',
      require: true,
    },
    tarification: {
      type: Number,
      require: true,
    },
    adresseDepart: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'quartier',
      require: true,
    },
    adresseArrivee: {
      type: mongoose.Schema.Types.ObjectId, ref: 'quartier',
      require: true,
    },
  
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("course", CourseSchema);
