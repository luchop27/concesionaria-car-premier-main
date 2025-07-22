const express = require('express');
const router = express.Router();
const marcaCtrl = require('../controllers/marca.controller');

router.get('/', marcaCtrl.getAll);
router.post('/', marcaCtrl.create);
router.put('/:id', marcaCtrl.update);
router.delete('/:id', marcaCtrl.remove);

module.exports = router;
