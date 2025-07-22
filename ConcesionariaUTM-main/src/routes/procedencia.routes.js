const express = require('express');
const router = express.Router();
const procedenciaCtrl = require('../controllers/procedencia.controller');

router.get('/', procedenciaCtrl.getAll);
router.post('/', procedenciaCtrl.create);
router.put('/:id', procedenciaCtrl.update);
router.delete('/:id', procedenciaCtrl.remove);

module.exports = router;
