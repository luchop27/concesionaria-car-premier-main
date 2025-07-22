const db = require('../config/db');

exports.findByEmail = async (email) => {
    const result = await db.query('SELECT * FROM usuario WHERE email = $1', [email]);
    return result.rows[0];
};

exports.createUsuario = async ({ email, password_hash, nombres }) => {
    const result = await db.query(
        'INSERT INTO usuario (email, password_hash, nombres) VALUES ($1, $2, $3) RETURNING *',
        [email, password_hash, nombres]
    );
    return result.rows[0];
};
