const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: String,
  documento: String,
  telefono: String,
  fechaNacimiento: String,
  correo: String,
  sexo: String,
  contraseña: String,
  rol: String,
});

module.exports = mongoose.model('Usuario', usuarioSchema);