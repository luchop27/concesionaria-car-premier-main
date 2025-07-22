const autoService = require('../services/auto.service');

// GET /api/autos
exports.getAllAutos = async (req, res) => {
    try {
        console.log('Iniciando obtención de autos...');
        const autos = await autoService.getAllAutos();
        console.log('Autos obtenidos:', autos?.length || 0);
        res.json(autos);
    } catch (error) {
        console.error('Error al obtener los vehículos:', error);
        res.status(500).json({ message: 'Error al obtener los vehículos', error: error.message });
    }
};

// GET /api/autos/id/:id
exports.getAutoById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const auto = await autoService.getAutoById(id);
        if (!auto) {
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }
        res.json(auto);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el vehículo', error: error.message });
    }
};

// GET /api/autos/:modelo
exports.getAutoByModelo = async (req, res) => {
    try {
        const modelo = req.params.modelo;
        const auto = await autoService.getAutoByModelo(modelo);
        if (!auto) {
            return res.status(404).json({ message: 'Vehículo no encontrado por modelo' });
        }
        res.json(auto);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el vehículo', error: error.message });
    }
};

// POST /api/autos
exports.createAuto = async (req, res) => {
    try {
        const nuevoAuto = await autoService.createAuto(req.body);
        // Devolvemos el objeto completo creado con su nuevo ID
        res.status(201).json(nuevoAuto);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el vehículo', error: error.message });
    }
};

// PUT /api/autos/:id
exports.updateAuto = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const autoActualizado = await autoService.updateAuto(id, req.body);
        if (!autoActualizado) {
            return res.status(404).json({ message: 'Vehículo no encontrado para actualizar' });
        }
        res.json({ message: 'Vehículo actualizado', auto: autoActualizado });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el vehículo', error: error.message });
    }
};

// DELETE /api/autos/:id
exports.deleteAuto = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const deletedAuto = await autoService.deleteAuto(id);
        if (!deletedAuto) {
            return res.status(404).json({ message: 'Vehículo no encontrado para eliminar' });
        }
        res.json({ message: 'Vehículo eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el vehículo', error: error.message });
    }
};






