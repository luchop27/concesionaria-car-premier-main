const express = require('express');
const router = express.Router();
const controller = require('../controllers/auto.controller');

// READ (Todos los vehículos)
router.get('/', controller.getAllAutos);

// READ (Un vehículo por ID)
// Se pone antes de /:modelo para evitar conflictos
router.get('/id/:id', controller.getAutoById);

// READ (Un vehículo por Modelo)
router.get('/:modelo', controller.getAutoByModelo);

// CREATE (Crear un nuevo vehículo)
router.post('/', controller.createAuto);

// UPDATE (Actualizar un vehículo por ID)
router.put('/:id', controller.updateAuto);

// DELETE (Eliminar un vehículo por ID)
router.delete('/:id', controller.deleteAuto);


module.exports = router;
