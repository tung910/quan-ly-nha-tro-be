const express = require('express');
const router = express.Router();
const serviceController = require('~/controllers/service.controller');

router.get('/list', serviceController.getAllService);
router.post('/create', serviceController.createService);
router.put('/edit/:id', serviceController.updateService);
router.delete('/delete', serviceController.removeService);

module.exports = router;
