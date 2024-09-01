const server = require('./src/app.js');
const { conn } = require('./src/config/db.js');
const { fetchAndStoreTypes } = require('./src/controllers/typeController.js'); // Importa la función fetchAndStoreTypes

conn.sync({ force: true }).then(async () => {
  try {
    // Llama a fetchAndStoreTypes para cargar los tipos desde la API en la base de datos
    await fetchAndStoreTypes();
    console.log('Tipos cargados en la base de datos');

    // Inicia el servidor en el puerto 3001
    server.listen(3001, () => {
      console.log('%s listening at 3001');
    });
  } catch (error) {
    console.error('Error al cargar los tipos en la base de datos:', error);
  }
});
