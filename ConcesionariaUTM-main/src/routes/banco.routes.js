const express = require('express');
const router = express.Router();
const bancoController = require('../controllers/banco.controller');

// Obtener todos los bancos
router.get('/', bancoController.getAll);

// Confirmar compra (usando query params)
router.get('/confirmar-compra', bancoController.confirmarCompra);

module.exports = router;
