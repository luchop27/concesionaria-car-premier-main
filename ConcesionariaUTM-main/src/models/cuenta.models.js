// Importa tu configuración de conexión a la base de datos.
// El nombre del archivo ('../config/db' o similar) puede variar en tu proyecto.
const db = require('../config/db');

const Cuenta = {};

/**
 * Valida si existe una cuenta bancaria para una persona y banco específicos.
 */
Cuenta.validar = async (idPersona, idBanco, numeroCuenta) => {
    const sql = `
        SELECT 
            cb.numero_cuenta,
            cb.saldo,
            b.nombre AS banco 
        FROM 
            cuenta_bancaria cb
        JOIN 
            banco b ON cb.id_banco = b.id_banco
        WHERE 
            cb.id_persona = $1
            AND cb.id_banco = $2
            AND cb.numero_cuenta = $3;
    `;

    const result = await db.query(sql, [idPersona, idBanco, numeroCuenta]);

    if (result.rows.length > 0) {
        return result.rows[0];
    }

    return null;
};

module.exports = Cuenta;
