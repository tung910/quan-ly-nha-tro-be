

const express = require('express');
const router = express.Router();

const motelController = require('~/controllers/motel.controller');

router.get('/list', motelController.getAllMotel);
router.post('/create', motelController.createMotel);
router.put('/edit/:id', motelController.editMotel);
router.delete('delete/:id', motelController.deleteMotel);
router.get('/:id', motelController.detailMotel);

module.exports = router;
