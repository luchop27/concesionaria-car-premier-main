const db = require('../config/db');

const Factura = {
    crear: async ({ id_venta, archivo_url }) => {
        await db.query(
            `INSERT INTO factura (id_venta, fecha_emision, archivo_url)
       VALUES (?, NOW(), ?)`,
            [id_venta, archivo_url]
        );
    }
};

module.exports = Factura;
