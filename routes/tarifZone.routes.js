const router = require('express').Router();
const tarifZoneController = require('../controllers/tarifZone.controller');

router.get('/', tarifZoneController.readTarifZone);
router.post('/', tarifZoneController.createTarifZone);
router.put('/:id', tarifZoneController.updateTarifZone);
router.delete('/:id', tarifZoneController.deleteTarifZone);

module.exports = router;