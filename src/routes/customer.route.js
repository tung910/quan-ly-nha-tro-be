const express = require('express');
const router = express.Router();

const customerController = require('~/controllers/customer.controller');
const {
    check,
    getUserById,
    isAuth,
    isAdmin,
} = require('~/middleware/checkauth');

router.get(
    '/list',
    check,
    getUserById,
    isAuth,
    isAdmin,
    customerController.getAllCustomer
);
router.post(
    '/create',
    check,
    getUserById,
    isAuth,
    isAdmin,
    customerController.addCustomer
);
router.put(
    '/edit/:id',
    check,
    getUserById,
    isAuth,
    isAdmin,
    customerController.editCustomer
);
router.delete(
    '/:id',
    check,
    getUserById,
    isAuth,
    isAdmin,
    customerController.deleteCustomer
);
router.get('/:id', customerController.detailCustomer);

module.exports = router;
