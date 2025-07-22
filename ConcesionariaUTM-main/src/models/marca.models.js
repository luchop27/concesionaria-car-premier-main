const db = require('../config/db');

const Marca = {
    findAll: async () => {
        const result = await db.query('SELECT * FROM marca');
        return result.rows;  // <-- aquí devuelves el arreglo de filas
    },
    create: async (data) => {
        const result = await db.query(
            'INSERT INTO marca (nombre, descripcion) VALUES ($1, $2) RETURNING *',
            [data.nombre, data.descripcion]
        );
        return result.rows[0]; // Devuelve la fila insertada
    },
    update: async (id, data) => {
        const result = await db.query(
            'UPDATE marca SET nombre = $1, descripcion = $2 WHERE id_marca = $3 RETURNING *',
            [data.nombre, data.descripcion, id]
        );
        return result.rows[0]; // Devuelve la fila actualizada
    },
    delete: async (id) => {
        const result = await db.query(
            'DELETE FROM marca WHERE id_marca = $1 RETURNING *',
            [id]
        );
        return result.rows[0]; // Devuelve la fila eliminada
    }
};

module.exports = Marca;