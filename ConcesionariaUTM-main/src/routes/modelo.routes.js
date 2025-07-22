const express = require('express');
const router = express.Router();
const modeloCtrl = require('../controllers/modelo.controller');

router.get('/', modeloCtrl.getAll);
router.post('/', modeloCtrl.create);
router.put('/:id', modeloCtrl.update);
router.delete('/:id', modeloCtrl.remove);

module.exports = router;
