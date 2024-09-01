const { Pokemon, Type } = require('../config/db')
const axios = require('axios')
const { getAllPokemons } = require('../utils/fetchData')
const { where } = require('sequelize')


exports.getPokemons = async (req, res, next) => {
    const name = req.query.name
    let pokemons = await getAllPokemons()
    try {
        if (name) {
            let pokemonName = await pokemons.filter(p => p.name.toLowerCase().includes(name.toLowerCase()))
            pokemonName.length ?
                res.status(200).send(pokemonName) :
                res.status(404).send('Pokemon not found')
        } else {
            res.status(200).send(pokemons)
        }
    } catch (error) {
        return next(error)
    }
}

exports.getPokemonsById = async (req, res, next) => {
    const id = req.params.id
    let pokemons = await getAllPokemons()

    try {
        let pokemonById = await pokemons.filter(p => p.id === id)
        pokemonById.length ?
            res.status(200).send(pokemonById) :
            res.status(404).send('Pokemon not found')
    } catch (error) {
        return next(error)
    }

}

exports.postPokemons = async (req, res, next) => {
    let {
        name, image, hp, att, def, speed, height, weight, types
    } = req.body;

    // Si no se proporciona una imagen, asigna una imagen por defecto
    if (!image) image = 'https://www.pinpng.com/pngs/m/8-82850_poke-ball-png-pokeball-png-transparent-png.png';

    try {
        // Verifica si todos los campos obligatorios están presentes
        if (!name || !hp || !att || !def || !speed || !height || !weight || !types || (Array.isArray(types) && types.length === 0)) {
            return res.status(400).send('Faltan datos vitales'); // Envía un error si faltan datos
        }

        // Maneja los tipos según si es un array o un string
        let tipo;
        if (Array.isArray(types)) {
            // Si `types` es un array, busca todos los tipos en la base de datos
            tipo = await Promise.all(types.map(async (t) => {
                return await Type.findOne({ where: { name: t } });
            }));
            tipo = tipo.filter(t => t !== null); // Filtra los tipos que no existen
        } else {
            // Si `types` es un string, búscalo o créalo
            const [foundType, created] = await Type.findOrCreate({ where: { name: types } });
            tipo = [foundType];
        }

        // Crea el nuevo Pokémon
        let newPokemon = await Pokemon.create({
            name, image, hp, att, def, speed, height, weight,
        });

        // Asocia los tipos al nuevo Pokémon
        await newPokemon.addTypes(tipo);

        return res.status(200).send('Pokemon created');
    } catch (error) {
        console.log('Error al crear el Pokémon:', error);
        return next(error);
    }
};




exports.putPokemons = async (req, res, next) => {
    const {
        name, image, hp, att, def, speed, height, weight, type
    } = req.body;
    const id = req.params.id;

    try {
        const pokemon = await Pokemon.findByPk(id);
        if (!pokemon) {
            return res.status(404).send('Pokémon no encontrado');
        }
        await pokemon.update({
            name, image, hp, att, def, speed, height, weight
        });
        const pokemontypes = await Type.findAll({
            where: { name: type }
        });
        await pokemon.setTypes(pokemontypes);
        res.status(200).send('Pokémon actualizado con éxito');
    } catch (error) {
        console.error('Error al actualizar el Pokémon:', error);
        return next(error);
    }
};

exports.deletePokemons = async (req, res, next) => {
    const id = req.params.id;

    try {
        // Buscar el Pokémon por ID
        const pokemon = await Pokemon.findByPk(id);

        // Verificar si el Pokémon existe
        if (!pokemon) {
            return res.status(404).send('Pokémon no encontrado');
        }

        // Eliminar el Pokémon
        await pokemon.destroy();

        res.status(200).send('Pokémon eliminado con éxito');
    } catch (error) {
        console.error('Error al borrar el Pokémon:', error);
        return next(error);
    }
};