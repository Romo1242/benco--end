const QuartierModel = require("../models/quartier.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.readQuartier = async (req, res) => {
  try {
    let options = {}

    const resources = await QuartierModel.find(options)
      .populate('zone')
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

module.exports.createQuartier = async (req, res) => {
  
  try {

    const newQuartier = new QuartierModel({
      nomquartier: req.body.nomquartier,
      tarif: req.body.tarif || 1000,
      nomZone: req.body.nomZone,
      zone: req.body.zone,
    });

    const quartier = await newQuartier.save();
    return res.status(201).json({
      status: 201,
      message: "Ressource créée avec succès",
      ressource: quartier
    });
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.updateQuartier = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  const updateRecord = {
    nomquartier: req.body.nomquartier,
    tarif: req.body.tarif,
    nomZone: req.body.nomZone,
    zone: req.body.zone,
  };

  QuartierModel.findByIdAndUpdate(
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

module.exports.deleteQuartier = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

    QuartierModel.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) res.send({ 
      status: 200,
      message: "Sucessfuly deleted."
    });
    else console.log("Delete error: " + err);
  });
};
