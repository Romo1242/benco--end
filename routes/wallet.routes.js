const router = require('express').Router();
const walletController = require('../controllers/wallet.controller');

router.get('/', walletController.readWallet);
router.get('/:id', walletController.readByUserWallet);
router.post('/', walletController.createWallet);
router.put('/:id', walletController.updateWallet);
router.delete('/:id', walletController.deleteWallet);

module.exports = router;