const express = require('express');
const router = express.Router();
const waterController = require('~/controllers/water.controller');

router.post('/create', waterController.createWater);
router.get('/list', waterController.listWater);
router.put('/edit/:id', waterController.updateWater);

module.exports = router;