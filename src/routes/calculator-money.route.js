const express = require('express');
const router = express.Router();
const calculatorMoneyController = require('~/controllers/calculator-money.controller');
const { getUserById } = require('~/controllers/user.controller');
const { requireSignin, isAuth, isAdmin } = require('~/middleware/checkauth');

router.post(
    '/list/:userId',
    requireSignin,
    isAuth,
    calculatorMoneyController.listCalculatorMoney
);
router.get(
    '/detail/:id/:userId',
    requireSignin,
    isAuth,
    calculatorMoneyController.detailCalculator
);
router.get(
    '/sendMailBill/:id/:userId',
    requireSignin,
    isAuth,
    calculatorMoneyController.sendMailBill
);
router.post(
    '/calculator/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    calculatorMoneyController.calculatorAllMoney
);
router.post(
    '/create/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    calculatorMoneyController.calculatorMoney
);
router.delete(
    '/delete/:id/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    calculatorMoneyController.deleteCalculator
);
router.put(
    '/payment/:id/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    calculatorMoneyController.paymentMoney
);

router.param('userId', getUserById);
module.exports = router;
