const express = require('express');
const router = express.Router();

const customerController = require('~/controllers/customer.controller');

router.get('/list', customerController.getAllCustomer);
router.post('/create', customerController.addCustomer);
router.put('/edit/:id', customerController.editCustomer);
router.delete('/:id', customerController.deleteCustomer);
router.get('/:id', customerController.detailCustomer);

module.exports = router;
