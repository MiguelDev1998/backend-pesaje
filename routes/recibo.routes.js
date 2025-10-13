const express = require('express');
const router = express.Router();
const reciboController = require('../controllers/recibo.controller');

router.get('/', reciboController.listar);

module.exports = router;
