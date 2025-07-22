const db = require('../config/db');

// Obtener todas las personas
exports.getAllPersonas = async () => {
    const result = await db.query('SELECT * FROM persona');
    return result.rows;
};

// Obtener persona por ID
exports.getPersonaById = async (id) => {
    const result = await db.query('SELECT * FROM persona WHERE id_persona = $1', [id]);
    return result.rows[0];
};

// Crear una nueva persona
exports.createPersona = async ({
    tipo_documento,
    documento,
    nombres,
    apellidos,
    correo,
    direccion,
    telefono
}) => {
    const result = await db.query(
        `INSERT INTO persona 
     (tipo_documento, documento, nombres, apellidos, correo, direccion, telefono) 
     VALUES ($1, $2, $3, $4, $5, $6, $7) 
     RETURNING *`,
        [tipo_documento, documento, nombres, apellidos, correo, direccion, telefono]
    );
    return result.rows[0];
};

// Actualizar datos de una persona
exports.updatePersona = async (id, {
    tipo_documento,
    documento,
    nombres,
    apellidos,
    correo,
    direccion,
    telefono
}) => {
    const result = await db.query(
        `UPDATE persona SET 
       tipo_documento = $1,
       documento = $2,
       nombres = $3,
       apellidos = $4,
       correo = $5,
       direccion = $6,
       telefono = $7
     WHERE id_persona = $8
     RETURNING *`,
        [tipo_documento, documento, nombres, apellidos, correo, direccion, telefono, id]
    );
    return result.rows[0];
};

// Eliminar persona por ID
exports.deletePersona = async (id) => {
    const result = await db.query(
        'DELETE FROM persona WHERE id_persona = $1 RETURNING *',
        [id]
    );
    return result.rows[0];
};

// Buscar personas por nombre o apellido
exports.searchPersonasByName = async (name) => {
    const result = await db.query(
        `SELECT * FROM persona 
     WHERE LOWER(nombres) LIKE LOWER($1) 
     OR LOWER(apellidos) LIKE LOWER($1)`,
        [`%${name}%`]
    );
    return result.rows;
};
