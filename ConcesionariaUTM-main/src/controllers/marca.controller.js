const Marca = require('../models/marca.models');

exports.getAll = async (req, res) => {
    const marcas = await Marca.findAll();
    res.json(marcas);
};

exports.create = async (req, res) => {
    const nueva = await Marca.create(req.body);
    res.json({ success: true, id: nueva.insertId });
};

exports.update = async (req, res) => {
    await Marca.update(req.params.id, req.body);
    res.json({ success: true });
};

exports.remove = async (req, res) => {
    await Marca.delete(req.params.id);
    res.json({ success: true });
};
