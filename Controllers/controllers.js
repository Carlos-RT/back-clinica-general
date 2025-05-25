const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../Models/Usuario'); // Asegúrate de que la ruta sea correcta
const Cita = require('../Models/Cita');
const registrarUsuario = async (req, res) => {
  try {
    const {
      nombre,
      documento,
      telefono,
      fechaNacimiento,
      correo,
      sexo,
      contraseña,
      rol
    } = req.body;

    // Encriptar la contraseña
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

    const nuevoUsuario = new Usuario({
      nombre,
      documento,
      telefono,
      fechaNacimiento,
      correo,
      sexo,
      contraseña: hashedPassword,
      rol
    });

    await nuevoUsuario.save();
    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};


// Login de usuario
const loginUsuario = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contraseñaValida) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      {
        id: usuario._id,
        rol: usuario.rol,
        nombre: usuario.nombre,
        documento: usuario.documento,
        fechaNacimiento: usuario.fechaNacimiento // ✅ agrega esta línea
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Error en loginUsuario:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Agendar cita
const agendarCita = async (req, res) => {
  try {
    const { usuarioId, enfermedades, tipoCita } = req.body;

    // Verificar que se envíen todos los campos necesarios
    if (!usuarioId || !enfermedades || !tipoCita) {
      return res.status(400).json({ mensaje: 'Faltan datos obligatorios.' });
    }

    // Verificar si el usuario existe
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    // Crear la cita
    const nuevaCita = new Cita({
      paciente: usuarioId,
      enfermedades,
      tipoCita,
    });

    await nuevaCita.save();

    res.status(201).json({ mensaje: 'Cita agendada exitosamente.' });
  } catch (error) {
    console.error('Error al agendar cita:', error);
    res.status(500).json({ mensaje: 'Error del servidor al agendar la cita.' });
  }
};

// Obtener todas las citas
const obtenerTodasLasCitas = async (req, res) => {
  try {
    const citas = await Cita.find().populate('paciente').populate('medico');
    res.json(citas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener las citas' });
  }
};

// Obtener todos los médicos
const obtenerMedicos = async (req, res) => {
  try {
    const medicos = await Usuario.find({ rol: 'medico' });
    res.json(medicos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener los médicos' });
  }
};

// Asignar médico a una cita
const asignarMedicoACita = async (req, res) => {
  const { medicoId, citaIds } = req.body;

  if (!medicoId || !Array.isArray(citaIds) || citaIds.length === 0) {
    return res.status(400).json({ mensaje: 'Datos inválidos para la asignación.' });
  }

  try {
    await Cita.updateMany(
      { _id: { $in: citaIds } },
      { $set: { medico: medicoId } }
    );

    res.status(200).json({ mensaje: 'Citas asignadas correctamente al médico.' });
  } catch (error) {
    console.error('Error al asignar médico:', error);
    res.status(500).json({ mensaje: 'Error del servidor al asignar médico.' });
  }
};

const obtenerCitasPorMedico = async (req, res) => {
  try {
    const { id } = req.params; // <-- aquí está el cambio

    const citas = await Cita.find({ medico: id }).populate('paciente', 'nombre documento');

    res.json(citas);
  } catch (error) {
    console.error('Error al obtener citas del médico:', error);
    res.status(500).json({ mensaje: 'Error del servidor.' });
  }
};


const agregarTratamiento = async (req, res) => {
  try {
    const { citaId, tratamiento } = req.body;

    const cita = await Cita.findById(citaId);
    if (!cita) {
      return res.status(404).json({ mensaje: 'Cita no encontrada.' });
    }

    cita.tratamiento = tratamiento;
    cita.atendida = true;
    await cita.save();

    res.json({ mensaje: 'Tratamiento enviado al paciente.' });
  } catch (error) {
    console.error('Error al guardar tratamiento:', error);
    res.status(500).json({ mensaje: 'Error del servidor.' });
  }
};

const obtenerCitasTratadasPorPaciente = async (req, res) => {
  try {
    const { pacienteId } = req.params;

    const citas = await Cita.find({ paciente: pacienteId, tratamiento: { $exists: true, $ne: '' } })
      .populate('medico', 'nombre documento');

    res.json(citas);
  } catch (error) {
    console.error('Error al obtener tratamientos:', error);
    res.status(500).json({ mensaje: 'Error al obtener los tratamientos.' });
  }
};


module.exports = { registrarUsuario, loginUsuario, agendarCita, obtenerTodasLasCitas, obtenerMedicos, asignarMedicoACita, obtenerCitasPorMedico, agregarTratamiento, obtenerCitasTratadasPorPaciente };