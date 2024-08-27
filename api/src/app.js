// Importa las dependencias necesarias
const express = require('express');           // Framework para manejar solicitudes HTTP
const cookieParser = require('cookie-parser'); // Middleware para manejar cookies
const bodyParser = require('body-parser');     // Middleware para analizar cuerpos de solicitudes (JSON, URL encoded)
const morgan = require('morgan');              // Middleware para registrar solicitudes HTTP en la consola
const routes = require('./routes/index.js');   // Importa las rutas definidas en el archivo index.js de la carpeta routes

// Requiere el archivo de configuración de la base de datos
require('../src/config/db.js');

// Crea una instancia del servidor Express
const server = express();

// Establece un nombre para la instancia del servidor (útil para depuración)
server.name = 'API';

// Configura middlewares para analizar cuerpos de solicitudes
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' })); // Permite manejar datos codificados en URLs (e.g., formularios)
server.use(bodyParser.json({ limit: '50mb' }));  // Permite manejar solicitudes con cuerpos en formato JSON

// Configura el middleware para analizar cookies
server.use(cookieParser());

// Configura el middleware de Morgan para registrar todas las solicitudes en la consola en el modo 'dev'
server.use(morgan('dev'));

// Configura los encabezados CORS para permitir solicitudes desde el frontend
server.use((req, res, next) => {
  // Permite solicitudes desde el frontend en 'http://localhost:3000'
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');  // Permite el uso de credenciales en las solicitudes (cookies, headers)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Define los encabezados permitidos en las solicitudes
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');  // Define los métodos HTTP permitidos
  next(); // Pasa el control al siguiente middleware o ruta
});

// Usa las rutas definidas en el archivo routes/index.js para todas las solicitudes entrantes
server.use('/', routes);

// Middleware para manejar errores
server.use((err, req, res, next) => {
  const status = err.status || 500;       // Establece el código de estado HTTP (por defecto 500 si no se especifica)
  const message = err.message || err;     // Establece el mensaje de error (por defecto el error mismo si no se especifica)
  console.error(err);                     // Muestra el error en la consola para depuración
  res.status(status).send(message);       // Envía la respuesta con el código de estado y el mensaje de error
});

// Exporta el servidor para que pueda ser utilizado en otros archivos, como el archivo principal (e.g., index.js)
module.exports = server;
