// Carga las variables de entorno desde un archivo .env
require('dotenv').config();

// Importa el módulo Sequelize desde la biblioteca sequelize
const { Sequelize } = require('sequelize');

// Importa los módulos fs y path, necesarios para manejar el sistema de archivos y las rutas
const fs = require('fs');
const path = require('path');

// Desestructura las variables de entorno para obtener las credenciales de la base de datos
const {
  DB_USER, DB_PASSWORD, DB_HOST,
} = process.env;

// Crea una instancia de Sequelize con la URL de conexión a la base de datos PostgreSQL
const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/pokemon`, {
  logging: false,  // Desactiva el registro de las consultas SQL en la consola
  native: false,   // Desactiva el uso de funciones nativas de PostgreSQL para mayor compatibilidad
});

// Obtiene el nombre del archivo actual (db.js)
const basename = path.basename(__filename);

// Array donde se almacenarán las definiciones de los modelos
const modelDefiners = [];

// Lee todos los archivos en la carpeta 'models' y los filtra para incluir solo archivos .js que no sean ocultos y no sea el archivo actual
fs.readdirSync(path.join(__dirname, '../models'))
  .filter((file) => (
    file.indexOf('.') !== 0 && // Excluye archivos que comiencen con '.'
    file !== basename &&       // Excluye el archivo actual (db.js)
    file.slice(-3) === '.js'   // Incluye solo archivos que terminen en .js
  ))
  .forEach((file) => {
    // Requiere cada archivo de modelo y lo añade al array modelDefiners
    modelDefiners.push(require(path.join(__dirname, '../models', file)));
  });

// Inicializa cada modelo pasándole la instancia de Sequelize
modelDefiners.forEach(model => model(sequelize));

// Obtiene los modelos y capitaliza sus nombres (primera letra en mayúscula)
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),  // Capitaliza la primera letra del nombre del modelo
  entry[1]
]);

// Reasigna los modelos con los nombres capitalizados
sequelize.models = Object.fromEntries(capsEntries);

// Desestructura los modelos definidos para su uso posterior
const { Pokemon, Type } = sequelize.models;

// Define la relación de muchos a muchos entre Pokemon y Type
// Un Pokemon puede tener muchos tipos, y un Tipo puede estar asociado a muchos Pokémon
Pokemon.belongsToMany(Type, { through: 'PokemonType' });  // 'through' especifica la tabla intermedia
Type.belongsToMany(Pokemon, { through: 'PokemonType' });

// Exporta los modelos y la conexión a la base de datos para su uso en otras partes de la aplicación
module.exports = {
  ...sequelize.models,  // Exporta los modelos
  conn: sequelize,      // Exporta la conexión a la base de datos
};
