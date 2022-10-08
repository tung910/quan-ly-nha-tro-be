const express = require('express');
const router = express.Router();
const revenueStatisticsController = require('~/controllers/revenue-statistics.controller');

router.get('/list', revenueStatisticsController.listRevenueStatistics);

module.exports = router;
