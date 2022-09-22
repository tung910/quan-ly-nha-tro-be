const express = require('express');
const router = express.Router();
const powerController = require('~/controllers/power.controller');

router.post('/create', powerController.createPower);
router.get('/list', powerController.getListPower);
router.put('/edit/:id', powerController.updatePower);

module.exports = router;
