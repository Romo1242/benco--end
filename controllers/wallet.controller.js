const WalletModel = require("../models/wallet.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.readWallet = async (req, res) => {

  try {
    let options = {}

    const resources = await WalletModel.find(options)
      .populate('user')
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

module.exports.readByUserWallet = async (req, res) => {
  
  try {
    let options = {}

    const resources = await WalletModel.find({user: req.params.id})
      // .populate('clienId')
      // .skip(page * perPage)
      // .limit(perPage)
      // .sort(sort)
      .sort({"createdAt": -1})
      .lean();
    
    res.json({
      status: 200,
      ressources: resources,
      total: resources.length,
      // count: countDatabase
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

module.exports.createWallet = async (req, res) => {
  const newWallet = new WalletModel({
    solde: req.body.solde,
    user: req.body.user,
  });
  
  try {
    const wallet = await newWallet.save();
    return res.status(201).json(
      { 
        status: 201,
        message: "Sucessfuly updated.",
        ressource: docs
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.updateWallet = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  const updateRecord = {
    solde: req.body.solde,
    user: req.body.user,
  };

  WalletModel.findByIdAndUpdate(
    req.params.id,
    { $set: updateRecord },
    { new: true },
    (err, docs) => {
      if (!err) res.send(docs);
      else console.log("Update error: " + err);
    }
  );
};

module.exports.deleteWallet = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

    WalletModel.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) res.send({ 
      status: 200,
      message: "Sucessfuly deleted."
    });
    else console.log("Delete error: " + err);
  });
};
