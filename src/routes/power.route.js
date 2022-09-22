const express = require('express');
const router = express.Router();
const powerCOntroller = require('~/controllers/power.controller');

router.post('/create', powerCOntroller.createPower);

module.exports = router;
