const TransactionModel = require("../models/transaction.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.readTransaction = async (req, res) => {
  try {
    let options = {}

    const resources = await TransactionModel.find(options)
      .populate('wallet')
      // .skip(page * perPage)
      // .limit(perPage)
      // .sort(sort)
      .sort({"createdAt": -1})
      .lean();
    
    res.json({
      status: 200,
      total: resources.length,
      ressources: resources,
      // count: countDatabase
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

module.exports.readTransactionByWallet = async (req, res) => {
  try {
    let options = {}

    const resources = await TransactionModel.find({wallet: req.params.id})
      // .populate('clienId')
      // .skip(page * perPage)
      // .limit(perPage)
      // .sort(sort)
      .sort({"createdAt": -1})
      .lean();
    
    res.json({
      status: 200,
      total: resources.length,
      ressources: resources,
      // count: countDatabase
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

module.exports.createTransaction = async (req, res) => {
  const newTransaction = new TransactionModel({
    montant: req.body.montant,
    course: req.body.course,
    wallet: req.body.wallet,
  });
  
  try {
    const transaction = await newTransaction.save();
    return res.status(201).json(transaction);
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.updateTransaction = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  const updateRecord = {
    montant: req.body.montant,
    course: req.body.course,
    wallet: req.body.wallet,
  };

  TransactionModel.findByIdAndUpdate(
    req.params.id,
    { $set: updateRecord },
    { new: true },
    (err, docs) => {
      if (!err) res.send({ 
        status: 201,
        message: "Sucessfuly updated.",
        ressource: docs
      });
      else console.log("Update error: " + err);
    }
  );
};

module.exports.deleteTransaction = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

    TransactionModel.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) res.send({ 
      status: 200,
      message: "Sucessfuly deleted."
    });
    else console.log("Delete error: " + err);
  });
};
