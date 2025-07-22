const db = require('../config/db');

const Modelo = {
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM modelo');
    return rows;
  },
  create: async (data) => {
    const [result] = await db.query(
      'INSERT INTO modelo (nombre, descripcion, id_marca) VALUES (?, ?, ?)',
      [data.nombre, data.descripcion, data.id_marca]
    );
    return result;
  },
  update: async (id, data) => {
    const [result] = await db.query(
      'UPDATE modelo SET nombre = ?, descripcion = ?, id_marca = ? WHERE id_modelo = ?',
      [data.nombre, data.descripcion, data.id_marca, id]
    );
    return result;
  },
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM modelo WHERE id_modelo = ?', [id]);
    return result;
  }
};

module.exports = Modelo;
