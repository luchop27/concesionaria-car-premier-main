const express = require('express');
const router = express.Router();
const controller = require('../controllers/persona.controller');

router.get('/search/:name', controller.search);
router.get('/', controller.getAll);        // Obtener todas las personas
router.get('/:id', controller.getById);    // Obtener persona por ID
router.post('/', controller.create);       // Crear una nueva persona
router.put('/:id', controller.update);     // Actualizar persona por ID
router.delete('/:id', controller.remove);  // Eliminar persona por ID


module.exports = router;
