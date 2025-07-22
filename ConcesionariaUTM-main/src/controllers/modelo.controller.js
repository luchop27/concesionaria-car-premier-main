const Modelo = require('../models/modelo.models');

exports.getAll = async (req, res) => {
    const modelos = await Modelo.findAll();
    res.json(modelos);
};

exports.create = async (req, res) => {
    const nuevo = await Modelo.create(req.body);
    res.json({ success: true, id: nuevo.insertId });
};

exports.update = async (req, res) => {
    await Modelo.update(req.params.id, req.body);
    res.json({ success: true });
};

exports.remove = async (req, res) => {
    await Modelo.delete(req.params.id);
    res.json({ success: true });
};
