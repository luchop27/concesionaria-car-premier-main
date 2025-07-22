const pool = require('../config/db');

exports.getPerfilCompleto = async (id_usuario) => {
  const result = await pool.query(
    `SELECT p.*
     FROM persona p
     JOIN usuario u ON u.id_persona = p.id_persona
     WHERE u.id_usuario = $1`,
    [id_usuario]
  );
  return result.rows[0];
};

module.exports = {
  async create({ id_persona, correo, password_hash }) {
    const result = await pool.query(
      `
      INSERT INTO usuario (id_persona, email, password_hash, estado, fecha_creacion)
      VALUES ($1, $2, $3, true, NOW())
      RETURNING *
      `,
      [id_persona, correo, password_hash]
    );
    return result.rows[0];
  },

  async findByCorreo(correo) {
    const result = await pool.query(
      `SELECT id_usuario, id_persona, email, password_hash, estado
     FROM usuario WHERE email = $1`,
      [correo]
    );
    return result.rows[0];
  },

  async getAll() {
    const result = await pool.query(
      `SELECT * FROM usuario`
    );
    return result.rows;
  }
};

exports.findUserWithPersonaByCorreo = async (correo) => {
  const result = await pool.query(
    `
    SELECT u.id_usuario, u.email, u.password_hash, u.id_persona,
           p.nombres, p.apellidos, p.tipo_documento, p.documento, 
           p.direccion, p.telefono
    FROM usuario u
    JOIN persona p ON u.id_persona = p.id_persona
    WHERE u.email = $1
    `,
    [correo]
  );
  return result.rows[0];
};


