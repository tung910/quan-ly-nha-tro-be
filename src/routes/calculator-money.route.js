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
    isAdmin,
    calculatorMoneyController.detailCalculator
);

router.get(
    '/sendMailBill/:id',
    check,
    getUserById,
    isAuth,
    calculatorMoneyController.sendMailBill
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
    '/calculator-all',
    check,
    getUserById,
    isAuth,
    isAdmin,
    calculatorMoneyController.calculatorAll
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
    // isAdmin,
    calculatorMoneyController.paymentMoney
);
router.post(
    '/create_payment_url',
    check,
    getUserById,
    isAuth,
    calculatorMoneyController.paymentVNPay
);
router.get(
    '/vnpay_return',
    check,
    getUserById,
    isAuth,
    calculatorMoneyController.VNPayReturn
);
router.get(
    '/vnpay_ipn',
    check,
    getUserById,
    isAuth,
    calculatorMoneyController.VNPayIPN
);

module.exports = router;
