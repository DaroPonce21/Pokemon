const { Type } = require('../config/db');
const axios = require('axios');

// Función que obtiene los tipos desde la API y los guarda en la base de datos
async function fetchAndStoreTypes() {
    try {
        // Busca todos los tipos existentes en la base de datos
        let types = await Type.findAll();

        // Si ya existen, no hace nada
        if (types.length > 0) {
            return types;
        }

        // Obtiene los tipos desde la API
        let typesApi = await axios.get('https://pokeapi.co/api/v2/type');

        // Mapea y crea cada tipo en la base de datos
        typesApi = await Promise.all(typesApi.data.results.map(async (t) => {
            let tipo = await Type.create({ name: t.name });
            return tipo;
        }));

        return typesApi;
    } catch (error) {
        console.error('Error al obtener los tipos:', error);
        throw new Error('Error al obtener los tipos');
    }
}

// Función que actúa como controlador HTTP y utiliza fetchAndStoreTypes
exports.getTypes = async (req, res, next) => {
    try {
        const types = await fetchAndStoreTypes();
        return res.json(types);
    } catch (error) {
        return res.status(400).json('Error al obtener los tipos');
    }
};

// Exporta fetchAndStoreTypes para que pueda ser utilizada en server.js
exports.fetchAndStoreTypes = fetchAndStoreTypes;
