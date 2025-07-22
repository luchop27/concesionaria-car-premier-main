const express = require('express');
const router = express.Router();
const cuentaController = require('../controllers/cuenta.controller');

// Definición de la ruta para validar la cuenta bancaria
// Corresponde a la petición: GET /api/cuentas/validar?idPersona=...&idBanco=...&numeroCuenta=...
router.get('/validar', cuentaController.validarCuenta);

module.exports = router;