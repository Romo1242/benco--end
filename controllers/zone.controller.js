const ZoneModel = require("../models/zone.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.readZone = async (req, res) => {

  try {
    let options = {}

    const resources = await ZoneModel.find(options)
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

module.exports.createZone = async (req, res) => {
  
  try {

    const newZone = new ZoneModel({
      nomZone: req.body.nomZone,
      tarif: req.body.tarif,
    });

    const zone = await newZone.save();
    return res.status(201).json({
      status: 201,
      message: "Ressource créée avec succès",
      ressource: zone
    });
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.updateZone = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  const updateRecord = {
    nomZone: req.body.nomZone,
    tarif: req.body.tarif,
  };

  ZoneModel.findByIdAndUpdate(
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

module.exports.deleteZone = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

    ZoneModel.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) res.send({ 
      status: 200,
      message: "Sucessfuly deleted."
    });
    else console.log("Delete error: " + err);
  });
};
