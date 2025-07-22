const Cuenta = require('../models/cuenta.models');

/**
 * Controlador para validar una cuenta bancaria.
 */
exports.validarCuenta = async (req, res) => {
    // 1. Extraer los parámetros de la query de la URL.
    // Para una URL como "...?idPersona=1&idBanco=1", req.query será { idPersona: '1', idBanco: '1' }
    const { idPersona, idBanco, numeroCuenta } = req.query;

    // 2. Validar que todos los parámetros necesarios están presentes.
    // Si falta alguno, enviamos un error 400 (Bad Request), que es lo que te ocurría.
    if (!idPersona || !idBanco || !numeroCuenta) {
        return res.status(400).json({
            message: 'Faltan parámetros requeridos: idPersona, idBanco y numeroCuenta son obligatorios.'
        });
    }

    try {
        // 3. Llamar al método del modelo para buscar la cuenta en la BD.
        const cuenta = await Cuenta.validar(idPersona, idBanco, numeroCuenta);

        // 4. Evaluar la respuesta del modelo.
        if (cuenta) {
            // Si la cuenta existe, devolvemos un 200 OK con los datos.
            res.status(200).json(cuenta);
        } else {
            // Si no se encuentra la cuenta, devolvemos un 404 Not Found.
            // Es más específico que un 400, ya que la petición era correcta pero el recurso no existe.
            res.status(404).json({ message: 'La cuenta no existe o los datos no coinciden.' });
        }
    } catch (error) {
        // 5. Si ocurre un error en la base de datos, enviamos un 500 Internal Server Error.
        console.error('Error en el controlador al validar cuenta:', error);
        res.status(500).json({ message: 'Error interno del servidor al validar la cuenta.' });
    }
};
