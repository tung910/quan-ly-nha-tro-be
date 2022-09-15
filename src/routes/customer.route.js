const express = require('express');
const router = express.Router();

const customerController = require('~/controllers/customer.controller');

router.get('/list', customerController.getAllCustomer);
router.post('/add', customerController.addCustomer);
router.put('/edit/:id', customerController.editCustomer);

module.exports = router;
