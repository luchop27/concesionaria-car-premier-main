// src/models/persona.models.js
const pool = require('../config/db');

module.exports = {
    /**
     * Crea una nueva persona en la base de datos
     * @param {Object} data - Datos de la persona
     * @returns {Object} La fila insertada
     */
    async create({
        tipo_documento,
        documento,
        nombres,
        apellidos,
        correo,
        direccion,
        telefono
    }) {
        const result = await pool.query(
            `
      INSERT INTO persona
        (tipo_documento, documento, nombres, apellidos, correo, direccion, telefono)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
            [
                tipo_documento,
                documento,
                nombres,
                apellidos,
                correo,
                direccion,
                telefono
            ]
        );
        return result.rows[0];
    },

    /**
     * Busca una persona por ID
     * @param {Number} id_persona
     * @returns {Object} persona
     */
    async findById(id_persona) {
        const result = await pool.query(
            `SELECT * FROM persona WHERE id_persona = $1`,
            [id_persona]
        );
        return result.rows[0];
    },

    /**
     * Devuelve todas las personas
     * @returns {Array} lista de personas
     */
    async getAll() {
        const result = await pool.query(
            `SELECT * FROM persona`
        );
        return result.rows;
    }
};
