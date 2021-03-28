const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { dbConnection } = require('./db/config');

//* Creando el servidor de express
const app = express();

//* Configurar CORS
app.use(cors());

//* Base de datos
dbConnection();

//* Rutas
app.get('/', (req, res) => {
  res.json({ ok: true, msg: 'Hola mundo' });
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto: ${process.env.PORT}`);
});
