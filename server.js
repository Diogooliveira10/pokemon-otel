require('./tracing') // Importa a configuração do OpenTelemetry

const express = require('express')
const axios = require('axios')
const logger = require('./logger') // Importa o logger configurado

const app = express()
const PORT = 3000

// Rota inicial para testar o servidor
app.get('/', (req, res) => {
    logger.info("Request received", { route: "/", method: "GET" }) // Registra um log sempre que essa rota for acessada
    res.send('Server is running!')
})

// Rota para buscar informações do Pokémon
app.get('/pokemon/:name', async (req, res) => {
    try {
        const { name } = req.params // Captura o nome do Pokémon na URL
        logger.info("Searching for Pokémon information", { pokemon: name }) // Loga quando um Pokémon é buscado

        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)

        res.json({
            name: response.data.name,
            height: response.data.height,
            weight: response.data.weight,
            types: response.data.types.map(t => t.type.name)
        });

        logger.info("Response sent successfully", { pokemon: name }) // Loga se a resposta foi enviada corretamente

    } catch (error) {
        logger.error("Error searching for Pokémon", { error: error.message }) // Loga erros detalhados se houver falha
        res.status(500).json({ error: 'Pokémon not found!' })
    }
})

// Middleware de erro global
app.use((err, req, res, next) => { 
    logger.error("Internal API error", { message: err.message, stack: err.stack }) // Captura qualquer erro inesperado na API
    res.status(500).send("Internal error!")
});

// Inicia o servidor
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`) // Garantindo que a mensagem seja estruturada
})
