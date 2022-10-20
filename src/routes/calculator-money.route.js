const express = require('express');
const router = express.Router();
const calculatorMoneyController = require('~/controllers/calculator-money.controller');

const {
    check,
    isAuth,
    isAdmin,
    getUserById,
} = require('~/middleware/checkauth');

router.post(
    '/list',
    check,
    getUserById,
    isAuth,
    calculatorMoneyController.listCalculatorMoney
);
router.get(
    '/detail/:id',
    check,
    getUserById,
    isAuth,
    calculatorMoneyController.detailCalculator
);
router.post(
    '/calculator',
    check,
    getUserById,
    isAuth,
    isAdmin,
    calculatorMoneyController.calculatorAllMoney
);
router.post(
    '/create',
    check,
    getUserById,
    isAuth,
    isAdmin,
    calculatorMoneyController.calculatorMoney
);
router.delete(
    '/delete/:id',
    check,
    getUserById,
    isAuth,
    isAdmin,
    calculatorMoneyController.deleteCalculator
);
router.put(
    '/payment/:id',
    check,
    getUserById,
    isAuth,
    isAdmin,
    calculatorMoneyController.paymentMoney
);

module.exports = router;
