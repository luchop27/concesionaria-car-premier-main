// Importaciones que ya tienes
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Persona = require('../models/persona.models');
const Usuario = require('../models/usuario.models');
require('dotenv').config();

// =================================================================
// TU FUNCIÓN DE REGISTRO (la dejamos como estaba, funciona bien)
// =================================================================
exports.registerUser = async (req, res) => {
    try {
        const {
            tipo_documento,
            documento,
            nombres,
            apellidos,
            correo,
            direccion,
            telefono,
            password,
            confirmPassword
        } = req.body;

        if (!password || !confirmPassword || password !== confirmPassword) {
            return res.status(400).json({ message: 'Las contraseñas no coinciden.' });
        }

        const existingUser = await Usuario.findByCorreo(correo);
        if (existingUser) {
            return res.status(400).json({ message: 'El correo ya está registrado como usuario.' });
        }

        const nuevaPersona = await Persona.create({
            tipo_documento,
            documento,
            nombres,
            apellidos,
            correo,
            direccion,
            telefono
        });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await Usuario.create({
            id_persona: nuevaPersona.id_persona,
            correo,
            password_hash: hashedPassword
        });

        // Para una mejor experiencia, podrías enviar también el perfil aquí
        // Pero por ahora, nos enfocamos en el login
        const token = jwt.sign(
            { id: newUser.id_usuario },
            process.env.JWT_SECRET,
            { expiresIn: '1m' }
        );

        res.status(201).json({ token });

    } catch (error) {
        console.error("Error en registerUser:", error);
        res.status(500).json({ message: 'Error al registrar usuario.' });
    }
};


// =================================================================
// TU FUNCIÓN DE LOGIN (¡ESTA ES LA VERSIÓN CORREGIDA Y ÚNICA!)
// =================================================================
exports.loginUser = async (req, res) => {
    try {
        const { correo, password } = req.body;

        if (!correo || !password) {
            return res.status(400).json({ message: 'Correo y contraseña son obligatorios.' });
        }

        // 1. Buscar al usuario por correo (usando tu modelo)
        const user = await Usuario.findByCorreo(correo);
        console.log("Usuario encontrado:", user); // 👈 esto debe mostrar el id_persona
        if (!user) {
            return res.status(401).json({ message: 'Credenciales incorrectas.' }); // Usamos 401 para no dar pistas
        }

        // 2. Verificar si está activo
        if (user.estado !== true) {
            return res.status(403).json({ message: 'Usuario inactivo.' });
        }

        // 3. Validar password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ message: 'Credenciales incorrectas.' });
        }

        // 4. ¡ÉXITO! Ahora buscamos los datos de la persona asociada
        const persona = await Persona.findById(user.id_persona); // Asegúrate que tu modelo Persona tenga un método 'findById'
        console.log("Usuario encontrado:", persona);
        if (!persona) {
            // Esto es un error de integridad de datos, pero es bueno manejarlo
            return res.status(500).json({ message: 'Error: No se encontró el perfil asociado al usuario.' });
        }

        // 5. Generar un token LIGERO (solo con el ID)
        const token = jwt.sign(
            {
                id_persona: persona.id_persona,
                nombres: persona.nombres,
                apellidos: persona.apellidos,
                correo: persona.correo,
                documento: persona.documento,
                tipo_documento: persona.tipo_documento,
                direccion: persona.direccion,
                telefono: persona.telefono
            },
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
        );

        // 6. ¡LA RESPUESTA CORRECTA! Enviamos el token Y el perfil.
        res.json({
            token: token,
            perfil: {
                id_persona: persona.id_persona,
                nombres: persona.nombres,
                apellidos: persona.apellidos,
                correo: persona.correo,
                documento: persona.documento,
                tipo_documento: persona.tipo_documento,
                direccion: persona.direccion,
                telefono: persona.telefono
            }
        });
        res.setHeader('Content-Type', 'application/json; charset=utf-8');

    } catch (error) {
        console.error("Error en loginUser:", error);
        res.status(500).json({ message: 'Error al iniciar sesión.' });
    }
};

exports.obtenerPerfil = async (req, res) => {
    try {
        const id_usuario = req.user.id; // si el middleware decodifica el token
        const user = await Usuario.findById(id_usuario);
        const persona = await Persona.findById(user.id_persona);
        res.json(persona);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener perfil' });
    }
};

const JWT_SECRET = process.env.JWT_SECRET || 'patopatoganso';

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Buscar el usuario por email
        // Asume que tu modelo Usuario tiene una asociación con Persona o que id_persona está directamente en Usuario
        const usuario = await db.Usuario.findOne({
            where: { email },
            // Si id_persona está en la tabla Persona y necesitas asociarla:
            // include: [{ model: db.Persona, as: 'persona' }]
        });

        if (!usuario) {
            return res.status(400).json({ message: 'Credenciales inválidas.' });
        }

        // 2. Comparar la contraseña
        const isMatch = await bcrypt.compare(password, usuario.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas.' });
        }

        // 3. Generar el Token JWT
        // ¡CRUCIAL! Incluir id_persona en el payload del token
        const payload = {
            id_usuario: usuario.id_usuario,
            id_persona: usuario.id_persona // <--- ¡Asegúrate de que este campo exista en tu objeto 'usuario'!
            // Si está en una tabla asociada (ej. Persona), sería usuario.persona.id_persona
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Token expira en 1 hora

        res.status(200).json({
            message: 'Login exitoso',
            token,
            user: {
                id_usuario: usuario.id_usuario,
                id_persona: usuario.id_persona, // También envía id_persona al frontend si lo necesitas
                email: usuario.email
            }
        });

    } catch (error) {
        console.error('Error en el login (usuario.controller.js):', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};



// NOTA: Las otras funciones como 'getPerfilCompleto' y 'login' que tenías
// ya no son necesarias porque 'loginUser' ahora hace todo el trabajo.
// Las hemos eliminado para mantener el código limpio.
