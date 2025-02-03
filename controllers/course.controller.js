const CourseModel = require("../models/course.model");
const TransacModel = require("../models/transaction.model");
const WalletModel = require("../models/wallet.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.readCourse = async (req, res) => {

  try {
    let options = {}

    const resources = await CourseModel.find(options)
      .populate(['client','transaction','adresseDepart','adresseArrivee'])
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

module.exports.readByClientCourse = async (req, res) => {

  try {
    let options = {}
    console.log("Id", req.params.id);
    const resources = await CourseModel.find({client: req.params.id})
      .populate(['client','transaction','adresseDepart','adresseArrivee'])
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

module.exports.createCourse = async (req, res) => {
  try {

    if(req.body.client && req.body.client.length > 20){
      // Nous allons débiter le compte
      console.log("Client id", req.body.client)
      const wallet = await WalletModel.find({user: req.body.client});
      console.log("My wallet :", wallet);
      
      if(wallet.length == 0){
        return res.json({
          status: 409,
          message: "Wallet non trouvé"
        });
      }

      let myWallet = wallet[0];

      if(myWallet.solde < req.body.tarification){
        return res.json({
          status: 404,
          message: "Solde insuffisant"
        });
      }

      // console.log("==> ", myWallet.solde, " - ", req.body.tarification);
      myWallet.solde = myWallet.solde - req.body.tarification;
      // console.log("Soustraction res :",  myWallet.solde);

      const respWallet = await myWallet.save();
      // console.log("Callback debit wallet :", respWallet);

      // Nous allons enrégistrer la transaction
      const myTransaction = new TransacModel({
        type: "débit",
        wallet: respWallet._id,
        montant: req.body.tarification
      });
      // console.log("Go to save transaction ", myTransaction);
      const respTransaction = await myTransaction.save();
      // console.log("Callback transcation save :", respTransaction);

      // Nous allons créer une course
      const newCourse = new CourseModel({
        client: req.body.client,
        // chauffeur: req.body.chauffeur,
        tarification: req.body.tarification,
        transaction: respTransaction._id,
        adresseDepart: req.body.adresseDepart,
        adresseArrivee: req.body.adresseArrivee,
      });
  
      const course = await newCourse.save();
      return res.json({
        status: 201,
        message: "Course enrégistrée",
        ressource: course
      });

    } else {
      // Si l'id du client est invalid
      return res.json({
        status: 409,
        message: "Utilisateur non trouvé"
      });
    }

  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.updateCourse = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  const updateRecord = {
    client: req.body.client,
    chauffeur: req.body.chauffeur,
    tarification: req.body.tarification,
    adresseDepart: req.body.tarification,
    adresseArrivee: req.body.tarification,
  };

  CourseModel.findByIdAndUpdate(
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

module.exports.deleteCourse = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  CourseModel.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) res.send({ 
      status: 200,
      message: "Sucessfuly deleted."
    });
    else console.log("Delete error: " + err);
  });
};
