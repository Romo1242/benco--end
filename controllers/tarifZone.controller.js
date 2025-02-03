const TarifZoneModel = require("../models/tarifZone.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.readTarifZone = async (req, res) => {
  try {
    let options = {}

    const resources = await TarifZoneModel.find(options)
      .populate('zoneA','zoneB')
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

module.exports.createTarifZone = async (req, res) => {
  const newTarifZone = new TarifZoneModel({
    montant: req.body.montant,
    zoneA: req.body.zoneA,
    zoneB: req.body.zoneB,
  });
  
  try {
    const tarifZone = await newTarifZone.save();
    return res.status(201).json(tarifZone);
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.updateTarifZone = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  const updateRecord = {
    montant: req.body.montant,
    zoneA: req.body.zoneA,
    zoneB: req.body.zoneB,
  };

  TarifZoneModel.findByIdAndUpdate(
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

module.exports.deleteTarifZone = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

    TarifZoneModel.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) res.send({ 
      status: 200,
      message: "Sucessfuly deleted."
    });
    else console.log("Delete error: " + err);
  });
};
