require('dotenv').config(); // 👈 importante

const express = require('express');
const mongoose = require('mongoose');
const routes = require('./Routes/routes');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', routes);

// Variables desde .env
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Conexión a MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Conectado a MongoDB');
  app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
})
.catch((error) => console.error('Error al conectar a MongoDB:', error));