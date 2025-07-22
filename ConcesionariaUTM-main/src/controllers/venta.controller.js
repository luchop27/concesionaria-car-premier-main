const { ventaService } = require('../services/venta.service');
const { generarFacturaPDF } = require('../utils/reportePDF');
const pool = require('../config/db');
const { obtenerCuentaBancariaPorUsuario } = require('../services/cuentaBancaria.service');
const { obtenerPersonaPorUsuario } = require('../services/persona.service');

// ✅ CREAR VENTA con servicio
const crearVenta = async (req, res) => {
    try {
        const id_persona = req.user.id_persona;
        const data = await ventaService.procesarVenta(req.body, id_persona);
        res.status(201).json({ mensaje: 'Venta realizada exitosamente.', ...data });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// ✅ HISTORIAL
const obtenerHistorial = async (req, res) => {
    try {
        const id_persona = req.user.id_persona;
        const historial = await ventaService.obtenerHistorial(id_persona);
        res.status(200).json(historial);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// ✅ DETALLE
const detalleVenta = async (req, res) => {
    try {
        const { id } = req.params;
        const detalle = await ventaService.obtenerDetalle(id);
        if (!detalle) {
            return res.status(404).json({ mensaje: 'Venta no encontrada.' });
        }
        res.status(200).json(detalle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// ✅ HISTORIAL POR USUARIO (si lo usas)
const obtenerHistorialVentasUsuario = async (req, res) => {
    const { id_usuario } = req.params;

    try {
        const [rows] = await pool.query(`
            SELECT v.id_venta, v.fecha_entrega, v.total,
                   a.numero_bastidor, m.nombre AS marca, mo.nombre AS modelo
            FROM venta v
            JOIN detalle_venta dv ON v.id_venta = dv.id_venta
            JOIN automovil a ON dv.id_automovil = a.id_automovil
            JOIN marca m ON a.id_marca = m.id_marca
            JOIN modelo mo ON a.id_modelo = mo.id_modelo
            WHERE v.id_persona = (
              SELECT id_persona FROM usuario WHERE id_usuario = ?
            )
            ORDER BY v.fecha_entrega DESC
        `, [id_usuario]);

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener el historial de ventas:', error);
        res.status(500).json({ mensaje: 'Error al obtener el historial de ventas.' });
    }
};

// ✅ GENERAR FACTURA
const generarYDescargarFactura = async (req, res) => {
    const id_venta = req.params.id;

    try {
        console.log('Obteniendo factura para ID:', id_venta);
        const bufferPDF = await generarFacturaPDF(id_venta);
        console.log('Factura generada correctamente');

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=factura_${id_venta}.pdf`);
        res.send(bufferPDF);
    } catch (error) {
        console.error('Error generando factura:', error);
        res.status(500).json({ message: 'Error al generar factura' });
    }
};

// ✅ FUNCIONALIDAD PRINCIPAL: REALIZAR VENTA
const realizarVenta = async (req, res) => {
    const { id_automovil, cuenta_bancaria, id_usuario } = req.body;

    try {
        // Validar auto
        const [autoRows] = await pool.query('SELECT * FROM automovil WHERE id_automovil = ?', [id_automovil]);
        if (autoRows.length === 0) {
            return res.status(404).json({ message: 'Automóvil no encontrado' });
        }

        // Validar cuenta bancaria
        const [cuentaRows] = await pool.query('SELECT saldo FROM cuenta_bancaria WHERE numero_cuenta = ?', [cuenta_bancaria]);
        if (cuentaRows.length === 0) {
            return res.status(404).json({ message: 'Cuenta bancaria no encontrada' });
        }

        const saldo = cuentaRows[0].saldo;
        const precio = autoRows[0].precio;

        if (saldo < precio) {
            return res.status(400).json({ message: 'Fondos insuficientes' });
        }

        // Obtener persona desde usuario
        const [personaRows] = await pool.query('SELECT id_persona FROM usuario WHERE id_usuario = ?', [id_usuario]);
        if (personaRows.length === 0) {
            return res.status(404).json({ message: 'Usuario no válido' });
        }
        const id_persona = personaRows[0].id_persona;

        // Registrar venta
        const [ventaResult] = await pool.query(
            'INSERT INTO venta (id_persona, total, fecha_entrega) VALUES (?, ?, NOW())',
            [id_persona, precio]
        );

        const id_venta = ventaResult.insertId;

        // Detalle de venta
        await pool.query('INSERT INTO detalle_venta (id_venta, id_automovil) VALUES (?, ?)', [id_venta, id_automovil]);

        // Actualizar saldo
        await pool.query('UPDATE cuenta_bancaria SET saldo = saldo - ? WHERE numero_cuenta = ?', [precio, cuenta_bancaria]);

        // Actualizar stock
        await pool.query('UPDATE automovil SET stock = stock - 1 WHERE id_automovil = ?', [id_automovil]);

        res.status(201).json({
            message: 'Venta realizada con éxito',
            id_venta
        });

    } catch (error) {
        console.error('Error en realizarVenta:', error);
        res.status(500).json({ message: 'Error al procesar la venta' });
    }
};

const confirmarCompra = async (req, res) => {
    try {
        console.log('🟢 Entró a confirmarCompra');
        console.log('🧾 Body recibido:', req.body);

        // Destructure only the necessary fields, excluding forma_pago if not needed
        const { id_persona, id_automovil, numero_cuenta, fecha_entrega, matricula, encargado_fabrica, total } = req.body;

        // Adjusted validation: removed forma_pago
        if (!id_persona || !id_automovil || !numero_cuenta || !fecha_entrega || !matricula || !encargado_fabrica || !total) {
            return res.status(400).json({ mensaje: 'Faltan datos requeridos para la compra.' });
        }

        console.log('ID persona recibido:', id_persona);
        console.log('Datos recibidos para compra:', { id_automovil, numero_cuenta });

        // Validar existencia de persona
        const personaResult = await pool.query('SELECT * FROM persona WHERE id_persona = $1', [id_persona]);
        const personaRows = personaResult.rows;
        if (personaRows.length === 0) {
            return res.status(404).json({ mensaje: 'Persona no encontrada.' });
        }
        const persona = personaRows[0];
        console.log('Persona encontrada:', persona);

        // Validar cuenta bancaria
        const cuentaResult = await pool.query(
            'SELECT * FROM cuenta_bancaria WHERE numero_cuenta = $1 AND id_persona = $2',
            [numero_cuenta, id_persona]
        );
        const cuentaRows = cuentaResult.rows;
        if (cuentaRows.length === 0) {
            return res.status(404).json({ mensaje: 'Cuenta bancaria no encontrada o no pertenece a la persona.' });
        }
        const cuenta = cuentaRows[0];
        console.log('Cuenta bancaria válida:', cuenta);

        // Validar auto y obtener precio
        const autoResult = await pool.query('SELECT precio, stock FROM automovil WHERE id_automovil = $1', [id_automovil]);
        const autoRows = autoResult.rows;
        if (autoRows.length === 0) {
            return res.status(404).json({ mensaje: 'Automóvil no encontrado.' });
        }
        const auto = autoRows[0];
        if (auto.stock <= 0) {
            return res.status(400).json({ mensaje: 'No hay stock disponible para este automóvil.' });
        }
        console.log('Auto y precio:', auto);

        // Verificar saldo suficiente
        if (cuenta.saldo < auto.precio) {
            return res.status(400).json({ mensaje: 'Fondos insuficientes en la cuenta bancaria.' });
        }

        // --- MODIFICACIÓN CLAVE AQUÍ ---
        // Eliminamos id_forma_pago de la lista de columnas y de los valores
        const ventaResult = await pool.query(
            'INSERT INTO venta (id_persona, total, fecha_entrega) VALUES ($1, $2, $3) RETURNING id_venta',
            [id_persona, auto.precio, fecha_entrega]
        );
        const id_venta = ventaResult.rows[0].id_venta;
        console.log('Venta registrada con ID:', id_venta);

        // Registrar detalle venta
        await pool.query(
            'INSERT INTO detalle_venta (id_venta, id_automovil, matricula, encargado_fabrica) VALUES ($1, $2, $3, $4)',
            [id_venta, id_automovil, matricula, encargado_fabrica]
        );
        console.log('Detalle de venta registrado');

        // Actualizar saldo cuenta bancaria
        await pool.query(
            'UPDATE cuenta_bancaria SET saldo = saldo - $1 WHERE numero_cuenta = $2',
            [auto.precio, numero_cuenta]
        );
        console.log('Saldo actualizado');

        // Reducir stock
        await pool.query('UPDATE automovil SET stock = stock - 1 WHERE id_automovil = $1', [id_automovil]);
        console.log('Stock actualizado');

        const datosFactura = {
            id_venta: id_venta,
            id_persona: id_persona,
            nombre_cliente: persona.nombres + ' ' + persona.apellidos, // Necesitas el nombre del cliente
            documento_cliente: persona.documento, // Y su documento
            nombre_automovil: auto.matricula,
            precio_automovil: auto.precio,
            matricula: matricula,
            encargado_fabrica: encargado_fabrica,
            fecha_venta: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
            total: auto.precio, // O el 'total' que viene del body si es el precio final
            // Añade cualquier otro dato que tu PDF necesite
        };
        // 2. Genera el PDF y obtén la ruta del archivo
        const factura_url = await generarFacturaPDF(datosFactura); // Asume que generarFacturaPDF devuelve la URL o el nombre del archivo

        // 3. Registra la factura en la tabla 'factura'
        // NOTA: 'archivo_url' debe ser una columna VARCHAR en tu tabla 'factura'
        await pool.query(
            'INSERT INTO factura (id_venta, fecha_emision, archivo_url) VALUES ($1, NOW(), $2)',
            [id_venta, factura_url]
        );
        console.log('Factura registrada en la base de datos:', factura_url);
        // --- FIN Lógica para GENERAR y REGISTRAR la factura ---

        res.status(200).json({ mensaje: 'Compra confirmada y factura generada con éxito.', id_venta: id_venta, factura_url: factura_url });

    } catch (error) {
        console.error('Error al confirmar compra y generar factura:', error);
        res.status(500).json({ mensaje: 'Error interno al confirmar compra.' });
    }
};

const getFacturasPorPersona = async (req, res) => {
    try {
        const id_persona = req.user.id_persona; // Usa el ID del usuario autenticado

        const result = await pool.query(
            `SELECT
                v.id_venta,
                v.total,
                v.fecha_entrega,
                f.fecha_emision,
                f.archivo_url,
                a.modelo as nombre_automovil,
                dv.matricula
            FROM
                venta v
            JOIN
                factura f ON v.id_venta = f.id_venta
            JOIN
                detalle_venta dv ON v.id_venta = dv.id_venta
            JOIN
                automovil a ON dv.id_automovil = a.id_automovil
            WHERE
                v.id_persona = $1
            ORDER BY
                v.fecha_entrega DESC`,
            [id_persona]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener historial de facturas:', error);
        res.status(500).json({ mensaje: 'Error interno al obtener historial de facturas.' });
    }
};

module.exports = {
    crearVenta,
    obtenerHistorial,
    detalleVenta,
    obtenerHistorialVentasUsuario,
    generarYDescargarFactura,
    realizarVenta,
    confirmarCompra,
    getFacturasPorPersona
};
