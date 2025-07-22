const pool = require('../config/db');

export const getAllAutos = async () => {
    const result = await pool.query('SELECT * FROM vista_autos_detalle');
    return result.rows;
};

export const getAutoById = async (id) => {
    const result = await pool.query(
        'SELECT * FROM vista_autos_detalle WHERE id_automovil = $1',
        [id]
    );
    return result.rows[0];
};

exports.getAutoByModelo = async (modelo) => {
    const result = await db.query(
        'SELECT * FROM vista_autos_detalle WHERE modelo = $1 LIMIT 1',
        [modelo]
    );
    return result.rows[0];
};

const db = require('../config/db');

const Auto = {
    findAll: async () => {
        const [rows] = await db.query(`
      SELECT a.*, 
             m.nombre AS modelo, 
             p.nombre AS procedencia,
             c.nombre AS color,
             mo.nombre AS motor,
             t.nombre AS tipo
      FROM automovil a
      JOIN modelo m ON a.id_modelo = m.id_modelo
      JOIN procedencia p ON a.id_procedencia = p.id_procedencia
      JOIN color c ON a.id_color = c.id_color
      JOIN motor mo ON a.id_motor = mo.id_motor
      JOIN tipo_vehiculo t ON a.id_tipo = t.id_tipo
    `);
        return rows;
    },

    // Crear auto
    create: async (data) => {
        const query = `
      INSERT INTO automovil (
        id_marca, id_modelo, id_procedencia, id_equipamiento, id_extra, 
        numero_bastidor, precio, descuento, potencia_fisica, cilindrada, 
        numero_plazas, stock
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
      ) RETURNING id_automovil
    `;
        const values = [
            data.id_marca,
            data.id_modelo,
            data.id_procedencia,
            data.id_equipamiento,
            data.id_extra,
            data.numero_bastidor,
            data.precio,
            data.descuento,
            data.potencia_fisica,
            data.cilindrada,
            data.numero_plazas,
            data.stock,
        ];

        const { rows } = await db.query(query, values);
        return rows[0]; // retorna el nuevo auto creado con id_automovil
    },

    // Actualizar auto
    update: async (id, data) => {
        const query = `
      UPDATE automovil SET
        id_marca = $1, id_modelo = $2, id_procedencia = $3, id_equipamiento = $4, id_extra = $5,
        numero_bastidor = $6, precio = $7, descuento = $8, potencia_fisica = $9, cilindrada = $10,
        numero_plazas = $11, stock = $12
      WHERE id_automovil = $13
    `;
        const values = [
            data.id_marca,
            data.id_modelo,
            data.id_procedencia,
            data.id_equipamiento,
            data.id_extra,
            data.numero_bastidor,
            data.precio,
            data.descuento,
            data.potencia_fisica,
            data.cilindrada,
            data.numero_plazas,
            data.stock,
            id,
        ];

        await db.query(query, values);
    },

    // Eliminar auto
    delete: async (id) => {
        const query = 'DELETE FROM automovil WHERE id_automovil = $1';
        await db.query(query, [id]);
    },
};

module.exports = Auto;

