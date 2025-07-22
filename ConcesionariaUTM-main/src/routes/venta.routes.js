const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/venta.controller');
const authMiddleware = require('../middleware/auth');
const db = require('../config/db'); // o donde esté tu conexión

// Crear venta protegida con token
router.post('/crear', authMiddleware, ventaController.crearVenta);

router.post('/confirmar-compra', ventaController.confirmarCompra);

// Historial de compras del usuario autenticado
router.get('/historial', authMiddleware, ventaController.obtenerHistorial);

// Detalle de una venta por su ID
router.get('/:id/detalle', authMiddleware, ventaController.detalleVenta);

router.get('/facturas', authMiddleware, ventaController.getFacturasPorPersona);

// Historial por ID de usuario (admin u otros)
// Ruta: GET /api/usuario/:id_usuario/historial
router.get('/usuario/:id_usuario/historial', async (req, res) => {
    const { id_usuario } = req.params;

    try {
        // Consulta que une ventas con facturas (ajusta nombres y campos a tu BD)
        const sql = `
      SELECT v.id_venta, v.fecha_venta, v.marca, v.modelo, v.numero_bastidor, v.precio_total, v.forma_pago,
             f.archivo_url, f.fecha_entrega, f.total AS total_factura, f.nombre_automovil
      FROM ventas v
      LEFT JOIN facturas f ON f.id_venta = v.id_venta
      WHERE v.id_usuario = ?
      ORDER BY v.fecha_venta DESC
    `;

        const [rows] = await db.execute(sql, [id_usuario]);

        res.json(rows); // Devuelve el arreglo de ventas + factura si existe
    } catch (error) {
        console.error('Error al obtener historial:', error);
        res.status(500).json({ error: 'Error al obtener historial de ventas' });
    }
});

// Generar y descargar factura en PDF
router.get('/descargar-factura/:id', ventaController.generarYDescargarFactura);

router.get('/factura-mock/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const venta = ventasDB.find(v => v.id_venta === id);

    if (!venta) {
        return res.status(404).json({ message: 'Venta no encontrada' });
    }

    try {
        const filePath = await generarFacturaPDF(venta);
        res.download(filePath);
    } catch (error) {
        console.error('Error al generar la factura:', error);
        res.status(500).json({ message: 'Error al generar factura' });
    }
});

router.get('/historial/:id_persona', async (req, res) => {
    const { id_persona } = req.params;
    try {
        const sql = `
      SELECT 
  v.id_venta,
  v.fecha_entrega,
  v.total,
  fp.descripcion AS forma_pago,
  f.fecha_emision,
  f.archivo_url,
  a.numero_bastidor,
  m.nombre AS marca,
  mo.nombre AS modelo
FROM venta v
LEFT JOIN forma_pago fp ON v.id_forma_pago = fp.id_forma_pago
LEFT JOIN factura f ON f.id_venta = v.id_venta
LEFT JOIN detalle_venta dv ON dv.id_venta = v.id_venta
LEFT JOIN automovil a ON dv.id_automovil = a.id_automovil
LEFT JOIN marca m ON a.id_marca = m.id_marca
LEFT JOIN modelo mo ON a.id_modelo = mo.id_modelo
WHERE v.id_persona = $1
ORDER BY v.fecha_entrega DESC;
    `;

        // Para pg, params van como array y $1, $2, etc en query
        const result = await db.query(sql, [id_persona]);

        res.json(result.rows); // Los datos están en result.rows
    } catch (error) {
        console.error('Error al obtener historial por persona:', error);
        res.status(500).json({ error: 'Error al obtener historial de compras por persona', details: error.message });
    }
});



module.exports = router;
