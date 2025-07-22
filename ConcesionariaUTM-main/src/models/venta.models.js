const pool = require('../config/db');

const Venta = {
    crear: async ({ id_persona, total, fecha_entrega, id_forma_pago }) => {
        const [result] = await db.query(
            `INSERT INTO venta (id_persona, total, fecha_entrega, id_forma_pago)
       VALUES (?, ?, ?, ?)`,
            [id_persona, total, fecha_entrega, id_forma_pago]
        );
        return result.insertId;
    },

    obtenerPorPersona: async (id_persona) => {
        const [rows] = await db.query(
            `SELECT v.*, fp.descripcion AS forma_pago
       FROM venta v
       JOIN forma_pago fp ON v.id_forma_pago = fp.id_forma_pago
       WHERE v.id_persona = ?`,
            [id_persona]
        );
        return rows;
    },

    obtenerDetalle: async (id_venta) => {
        const [rows] = await db.query(
            `SELECT v.*, a.numero_bastidor, a.precio, m.nombre AS marca, mo.nombre AS modelo,
              fp.descripcion AS forma_pago
       FROM venta v
       JOIN detalle_venta dv ON dv.id_venta = v.id_venta
       JOIN automovil a ON dv.id_automovil = a.id_automovil
       JOIN marca m ON a.id_marca = m.id_marca
       JOIN modelo mo ON a.id_modelo = mo.id_modelo
       JOIN forma_pago fp ON v.id_forma_pago = fp.id_forma_pago
       WHERE v.id_venta = ?`,
            [id_venta]
        );
        return rows[0];
    }
};

module.exports = Venta;

