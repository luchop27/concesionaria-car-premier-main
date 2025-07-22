const Procedencia = require('../models/procedencia.models');

exports.getAll = async (req, res) => {
    const resultados = await Procedencia.findAll();
    res.json(resultados);
};

exports.create = async (req, res) => {
    const resultado = await Procedencia.create(req.body);
    res.json({ success: true, id: resultado.insertId });
};

exports.update = async (req, res) => {
    await Procedencia.update(req.params.id, req.body);
    res.json({ success: true });
};

exports.remove = async (req, res) => {
    await Procedencia.delete(req.params.id);
    res.json({ success: true });
};
