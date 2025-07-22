const express = require('express');
const router = express.Router();
const userController = require('../controllers/usuario.controller');
//onst authenticateToken = require('../middleware/auth');
//const auth = require('../middleware/auth');
const { authMiddleware } = require('../middleware/auth');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/perfil', userController.obtenerPerfil);


module.exports = router;
