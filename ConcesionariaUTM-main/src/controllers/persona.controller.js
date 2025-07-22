const service = require('../services/persona.service');

exports.getAll = async (req, res) => {
    try {
        const data = await service.getAllPersonas();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const data = await service.getPersonaById(req.params.id);
        if (!data) return res.status(404).json({ error: 'Persona no encontrada' });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const data = await service.createPersona(req.body);
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const data = await service.updatePersona(req.params.id, req.body);
        if (!data) return res.status(404).json({ error: 'Persona no encontrada' });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const data = await service.deletePersona(req.params.id);
        if (!data) return res.status(404).json({ error: 'Persona no encontrada' });
        res.json({ message: 'Persona eliminada exitosamente', data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.search = async (req, res) => {
    try {
        const name = req.params.name;
        if (!name) return res.status(400).json({ error: 'Debe proporcionar un nombre para buscar' });

        const data = await service.searchPersonasByName(name);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
