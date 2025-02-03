const router = require('express').Router();
const zoneController = require('../controllers/zone.controller');

router.get('/', zoneController.readZone);
router.post('/', zoneController.createZone);
router.put('/:id', zoneController.updateZone);
router.delete('/:id', zoneController.deleteZone);

module.exports = router;