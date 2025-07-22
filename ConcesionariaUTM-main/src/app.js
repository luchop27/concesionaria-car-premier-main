const express = require('express');
const cors = require('cors');
const path = require('path');

// Importar rutas (verifica que todas existan)
const personaRouter = require('./routes/persona.routes');
const userRoutes = require('./routes/usuario.routes');
const autoRoutes = require('./routes/auto.routes');
const ventaRoutes = require('./routes/venta.routes');
const bancoRoutes = require('./routes/banco.routes');
const cuentaRoutes = require('./routes/cuenta.routes');
// Evita duplicar ventaRoutes como historialVentasRoutes
const marcaRoutes = require('./routes/marca.routes');
const modeloRoutes = require('./routes/modelo.routes');
const procedenciaRoutes = require('./routes/procedencia.routes');

const app = express();

// Configurar CORS para producción o desarrollo
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    credentials: true
}));

// Middleware para parsear JSON
app.use(express.json());

// Rutas principales
app.use('/api/persona', personaRouter);
app.use('/api/users', userRoutes);
app.use('/api/autos', autoRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/bancos', bancoRoutes);
app.use('/api/cuentas', cuentaRoutes);
app.use('/api/marcas', marcaRoutes);
app.use('/api/modelos', modeloRoutes);
app.use('/api/procedencias', procedenciaRoutes);

// Ruta de prueba (mock) para verificar conexión
app.get('/api/test', (req, res) => {
    res.json({ mensaje: 'Backend funcionando correctamente 🎉' });
});

// Servir archivos estáticos (si usas uploads o Angular build)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/facturas', express.static(path.join(__dirname, 'facturas')));

// Puerto dinámico para Railway / localhost
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});

module.exports = app;
