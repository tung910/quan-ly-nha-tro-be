const express = require('express');
const router = express.Router();
const calculatorMoneyController = require('~/controllers/calculator-money.controller');

router.get('/list', calculatorMoneyController.listCalculatorMoney);
router.get('/detail/:id', calculatorMoneyController.detailCalculator);
router.post('/calculator', calculatorMoneyController.calculatorAllMoney);
router.post('/create', calculatorMoneyController.calculatorMoney);
router.delete('/delete/:id', calculatorMoneyController.deleteCalculator);
router.put('/payment/:id', calculatorMoneyController.paymentMoney);

module.exports = router;
