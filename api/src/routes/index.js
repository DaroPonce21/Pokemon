const { Router } = require('express');
const { allPokemonsWeb } = require('../utils/fetchData');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use('/', allPokemonsWeb)

module.exports = router;
