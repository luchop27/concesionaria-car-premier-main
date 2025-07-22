const Banco = require('../models/banco.models');
const Cuenta = require('../models/cuenta.models'); // Asegúrate de tener esta línea si no la tienes

const bancoController = {
    getAll: async (req, res) => {
        try {
            const bancos = await Banco.getAll();
            console.log('bancos:', bancos);
            res.json(bancos.rows);
        } catch (error) {
            console.error('Error real:', error); // MOSTRAR ERROR REAL
            res.status(500).json({ message: 'Error al obtener bancos', error: error.message || error });
        }
    },


    confirmarCompra: async (req, res) => {
        const { numero_cuenta, id_persona, id_banco } = req.query;

        if (!numero_cuenta || !id_persona || !id_banco) {
            return res.status(400).json({ mensaje: 'Faltan parámetros' });
        }

        try {
            const [cuentas] = await pool.query(`
            SELECT c.saldo, b.nombre AS banco
            FROM cuenta_bancaria c
            JOIN banco b ON c.id_banco = b.id_banco
            WHERE c.numero_cuenta = ? AND c.id_persona = ? AND c.id_banco = ?
        `, [numero_cuenta, id_persona, id_banco]);

            if (cuentas.length === 0) {
                return res.status(404).json({ mensaje: 'Cuenta no encontrada' });
            }

            const { saldo, banco } = cuentas[0];
            res.json({ banco, saldo });
        } catch (error) {
            console.error('Error en confirmarCompra:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
        }
    }
};



module.exports = bancoController;
