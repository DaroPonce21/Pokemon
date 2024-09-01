const { Router } = require('express');
const pokemonsControllers = require('../controllers/pokemonController')
const typeControllers = require('../controllers/typeController')



const router = Router();

router.get('/pokemons', pokemonsControllers.getPokemons)
router.get('/pokemons/:id', pokemonsControllers.getPokemonsById)
router.post('/pokemons', pokemonsControllers.postPokemons)
router.put('/pokemons/:id', pokemonsControllers.putPokemons)
router.delete('/pokemons/:id', pokemonsControllers.deletePokemons)

router.get('/type', typeControllers.getTypes)

module.exports = router;
