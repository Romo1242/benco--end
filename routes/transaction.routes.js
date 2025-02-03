const router = require('express').Router();
const transactionController = require('../controllers/transaction.controller');

router.get('/', transactionController.readTransaction);
router.get('/:id', transactionController.readTransactionByWallet);
router.post('/', transactionController.createTransaction);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;