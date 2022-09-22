const express = require('express');
const router = express.Router();
const powerController = require('~/controllers/power.controller');

router.post('/create', powerController.createPower);
router.get('/list', powerController.getListPower);

module.exports = router;
