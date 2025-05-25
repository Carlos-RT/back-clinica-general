// models/Cita.js
const mongoose = require('mongoose');

const citaSchema = new mongoose.Schema({
  paciente: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  enfermedades: [{ type: String, required: true }],
  tipoCita: { type: String, enum: ['presencial', 'virtual'], required: true },
  fechaCreacion: { type: Date, default: Date.now },
  medico: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  tratamiento: { type: String, default: '' },
  atendida: { type: Boolean, default: false }
});

module.exports = mongoose.model('Cita', citaSchema);