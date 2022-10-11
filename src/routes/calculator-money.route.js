const express = require('express');
const router = express.Router();
const calculatorMoneyController = require('~/controllers/calculator-money.controller');

router.get('/list', calculatorMoneyController.listCalculatorMoney);
router.get('/detail/:id', calculatorMoneyController.detailCalculator);
router.put('/calculator', calculatorMoneyController.calculatorAllMoney);
router.post('/create', calculatorMoneyController.calculatorMoney);

module.exports = router;
