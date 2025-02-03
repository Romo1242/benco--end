const router = require('express').Router();
const quartierController = require('../controllers/quartier.controller');

router.get('/', quartierController.readQuartier);
router.post('/', quartierController.createQuartier);
router.put('/:id', quartierController.updateQuartier);
router.delete('/:id', quartierController.deleteQuartier);

module.exports = router;