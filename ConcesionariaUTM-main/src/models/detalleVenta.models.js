// src/models/detalleVenta.models.js
const db = require('../config/db');

const DetalleVenta = {
    crear: async ({ id_venta, id_automovil, matricula, encargado_fabrica }) => {
        await db.query(
            `INSERT INTO detalle_venta (id_venta, id_automovil, matricula, encargado_fabrica)
       VALUES (?, ?, ?, ?)`,
            [id_venta, id_automovil, matricula, encargado_fabrica]
        );
    }
};

module.exports = DetalleVenta;
