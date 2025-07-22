const db = require('../config/db');
const Venta = require('../models/venta.models');
const DetalleVenta = require('../models/detalleVenta.models');
const CuentaBancaria = require('../models/cuenta.models');
const Credito = require('../models/credito.models');
const { obtenerPorPersonaYBanco } = require('./cuentaBancaria.service');
//const cuenta = await obtenerPorPersonaYBanco(id_persona, id_banco, numero_cuenta);

const procesarVenta = async (datos, id_persona) => {
    const {
        id_automovil,
        forma_pago, // 'Contado' o 'Crédito'
        id_banco,
        numero_cuenta,
        fecha_entrega,
        matricula,
        encargado_fabrica,
        total,
        plazo,     // si es crédito
        interes    // si es crédito
    } = datos;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Validar cuenta bancaria y saldo
        const cuenta = await Cuenta.obtenerPorPersonaYBanco(id_persona, id_banco, numero_cuenta);
        if (!cuenta) throw new Error('Cuenta bancaria no válida.');

        if (forma_pago === 'Contado' && cuenta.saldo < total) {
            throw new Error('Saldo insuficiente para realizar el pago.');
        }

        // Obtener ID de forma de pago
        const [fpResult] = await connection.query(
            'SELECT id_forma_pago FROM forma_pago WHERE descripcion = ?',
            [forma_pago]
        );
        if (!fpResult.length) throw new Error('Forma de pago inválida.');
        const id_forma_pago = fpResult[0].id_forma_pago;

        // Crear venta
        const id_venta = await Venta.crear({
            id_persona,
            total,
            fecha_entrega,
            id_forma_pago
        });

        // Crear detalle de la venta
        await DetalleVenta.crear({
            id_venta,
            id_automovil,
            matricula,
            encargado_fabrica
        });

        // Si es crédito, crear entrada en crédito
        if (forma_pago === 'Crédito') {
            await Credito.crear({
                id_banco,
                id_venta,
                fecha: new Date(),
                total,
                plazo,
                interes
            });
        } else {
            // Si es contado, descontar del saldo
            await Cuenta.actualizarSaldo(cuenta.id_cuenta, cuenta.saldo - total);
        }

        await connection.commit();
        // Obtener detalle extendido para factura
        const detalle = await Venta.obtenerDetalle(id_venta);

        // Generar PDF
        const filename = `factura_venta_${id_venta}.pdf`;
        const filepath = path.join(__dirname, '../../facturas', filename);
        await generarFacturaPDF(detalle, detalle, filepath);

        // Registrar factura en base de datos
        await Factura.crear({
            id_venta,
            archivo_url: `/facturas/${filename}`
        });
        return { id_venta, total };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
        const generarFacturaPDF = require('../utils/facturaPdf');
        const path = require('path');
        const Factura = require('../models/factura.models'); // Si decidiste usar la tabla factura
    }
};

const obtenerHistorial = async (id_persona) => {
    return await Venta.obtenerPorPersona(id_persona);
};

const obtenerDetalle = async (id_venta) => {
    return await Venta.obtenerDetalle(id_venta);
};

module.exports = {
    procesarVenta,
    obtenerHistorial,
    obtenerDetalle
};
