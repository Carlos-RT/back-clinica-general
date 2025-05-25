const express = require('express');
const router = express.Router();
const { registrarUsuario, loginUsuario, agendarCita, obtenerTodasLasCitas, obtenerMedicos, asignarMedicoACita, obtenerCitasPorMedico, agregarTratamiento, obtenerCitasTratadasPorPaciente } = require('../Controllers/controllers');

router.post('/registrar', registrarUsuario);
router.post('/login', loginUsuario);

// Nueva ruta para agendar cita
router.post('/citas', agendarCita);
router.get('/todaslascitas', obtenerTodasLasCitas);
router.get('/medicos', obtenerMedicos);
router.post('/asignar-medico', asignarMedicoACita);
router.get('/asignadas/:id', obtenerCitasPorMedico);
router.post('/citas/tratamiento', agregarTratamiento);
router.get('/tratamientos/:pacienteId', obtenerCitasTratadasPorPaciente);

module.exports = router;