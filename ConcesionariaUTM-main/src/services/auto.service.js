const db = require('../config/db'); // Asegúrate que la ruta a tu conexión de BD sea correcta

// --- READ ---
exports.getAllAutos = async () => {
    const result = await db.query('SELECT * FROM vista_autos_detalle ORDER BY id_automovil ASC');
    return result.rows;
};

exports.getAutoById = async (id) => {
    const result = await db.query('SELECT * FROM vista_autos_detalle WHERE id_automovil = $1', [id]);
    return result.rows[0] || null;
};

exports.getAutoByModelo = async (modelo) => {
    const result = await db.query('SELECT * FROM vista_autos_detalle WHERE modelo ILIKE $1', [modelo]);
    return result.rows[0] || null;
};

// --- CREATE ---
exports.createAuto = async (data) => {
    const query = `
        INSERT INTO automovil (
            id_marca, id_modelo, id_procedencia, id_equipamiento, id_extra, 
            numero_bastidor, precio, descuento, potencia_fisica, cilindrada, 
            numero_plazas, stock
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *;  -- Devuelve toda la fila recién creada
    `;
    const values = [
        data.id_marca, data.id_modelo, data.id_procedencia, data.id_equipamiento,
        data.id_extra, data.numero_bastidor, data.precio, data.descuento,
        data.potencia_fisica, data.cilindrada, data.numero_plazas, data.stock
    ];
    const { rows } = await db.query(query, values);
    return rows[0];
};

// --- UPDATE ---
exports.updateAuto = async (id, data) => {
    const query = `
        UPDATE automovil SET
            id_marca = $1, id_modelo = $2, id_procedencia = $3, id_equipamiento = $4,
            id_extra = $5, numero_bastidor = $6, precio = $7, descuento = $8,
            potencia_fisica = $9, cilindrada = $10, numero_plazas = $11, stock = $12
        WHERE id_automovil = $13
        RETURNING *; -- Devuelve la fila actualizada
    `;
    const values = [
        data.id_marca, data.id_modelo, data.id_procedencia, data.id_equipamiento,
        data.id_extra, data.numero_bastidor, data.precio, data.descuento,
        data.potencia_fisica, data.cilindrada, data.numero_plazas, data.stock,
        id
    ];
    const { rows } = await db.query(query, values);
    return rows[0] || null;
};

// --- DELETE ---
exports.deleteAuto = async (id) => {
    const query = 'DELETE FROM automovil WHERE id_automovil = $1 RETURNING *;';
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
};