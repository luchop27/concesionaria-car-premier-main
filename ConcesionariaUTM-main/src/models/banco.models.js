const db = require('../config/db');

const Banco = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            db.query('SELECT id_banco AS id, nombre FROM banco', (err, results) => {
                if (err) {
                    console.error('Error en consulta SQL:', err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
};

getById: (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM banco WHERE id_banco = ?', [id], (err, results) => {
            if (err) reject(err);
            else resolve(results[0] || null);
        });
    });
};

module.exports = Banco;
