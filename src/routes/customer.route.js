const express = require('express');
const router = express.Router();

const customerController = require('~/controllers/customer.controller');
const { getUserById } = require('~/controllers/user.controller');
const { requireSignin, isAuth, isAdmin } = require('~/middleware/checkauth');

router.get(
    '/list/:userId',
    requireSignin,
    isAuth,
    customerController.getAllCustomer
);
router.post(
    '/create/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    customerController.addCustomer
);
router.put(
    '/edit/:id/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    customerController.editCustomer
);
router.delete(
    '/:id/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    customerController.deleteCustomer
);
router.get('/:id', customerController.detailCustomer);

router.param('userId', getUserById);
module.exports = router;
