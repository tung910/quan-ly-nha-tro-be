const express = require('express');
const router = express.Router();
const revenueStatisticsController = require('~/controllers/revenue-statistics.controller');
const { check, getUserById, checkAuth, isAdmin } = require('~/middleware/checkauth');

router.get('/list',check,getUserById,checkAuth,isAdmin, revenueStatisticsController.listRevenueStatistics);
router.post('/payment-tracking',check,getUserById,checkAuth,isAdmin, revenueStatisticsController.getTotalPayment);
router.post('/add-or-update',check,getUserById,checkAuth,isAdmin, revenueStatisticsController.addOrUpdate);

module.exports = router;
