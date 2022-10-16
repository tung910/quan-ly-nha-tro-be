const express = require('express');
const router = express.Router();
const powerController = require('~/controllers/data-power.controller');

router.post('/create', powerController.createPower);
router.get('/list', powerController.getListPower);
router.get('/detail/:motelRoomId', powerController.getDataPowerByMotelRoom);
router.put('/edit/:id', powerController.updatePower);

module.exports = router;
