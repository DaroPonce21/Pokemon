const axios = require('axios');
const { Pokemon, Type } = require('../config/db')

const POKEWEB151 = 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=151'

const allPokemonsWeb = async () => {
    try {
        let pokeUrl = await axios.get(POKEWEB151)
        let pokemons = await pokeUrl.data.results
        pokemons = await Promise.all(pokemons.map(async (poke) => {
            let dataPoke = await axios.get(poke.url)
            return {
                id: poke.url.split('/')[6],
                name: poke.name,
                hp: dataPoke.data.stats[0].base_stat
                ,
                att: dataPoke.data.stats[1].base_stat,
                def: dataPoke.data.stats[2].base_stat,
                speed: dataPoke.data.stats[5].base_stat,
                height: dataPoke.data.height,
                weight: dataPoke.data.weight,
                image: dataPoke.data.sprites.other.dream_world.front_default,
                type: dataPoke.data.types.map(t => t.type.name)
            }
        }))
        return pokemons

    } catch (error) {
        console.log('Error al obtener los pokemons de la Web', error)
        throw error
    }
}

const allPokemonsDb = async () => {
    return await Pokemon.findAll({
        include: {
            model: Type,
            attributes: ['name'],
            throught: {
                attributes: []
            }
        }
    })
}

const getAllPokemons = async () => {
    const apiPoke = await allPokemonsWeb()
    const dbPoke = await allPokemonsDb()

    const allPoke = apiPoke.concat(dbPoke).sort((a, b) => {
        return parseInt(a.id) < parseInt(b.id) ? -1 : 1
    })
    return allPoke
}

module.exports = { getAllPokemons }
