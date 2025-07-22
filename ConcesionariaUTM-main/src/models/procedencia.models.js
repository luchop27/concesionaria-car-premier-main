const db = require('../config/db');

const Procedencia = {
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM procedencia');
    return rows;
  },
  create: async (data) => {
    const [result] = await db.query(
      'INSERT INTO procedencia (nombre, descripcion) VALUES (?, ?)',
      [data.nombre, data.descripcion]
    );
    return result;
  },
  update: async (id, data) => {
    const [result] = await db.query(
      'UPDATE procedencia SET nombre = ?, descripcion = ? WHERE id_procedencia = ?',
      [data.nombre, data.descripcion, id]
    );
    return result;
  },
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM procedencia WHERE id_procedencia = ?', [id]);
    return result;
  }
};

module.exports = Procedencia;
