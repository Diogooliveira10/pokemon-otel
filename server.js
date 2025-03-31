require('./tracing') // Importa a configuração do OpenTelemetry

const express = require('express')
const axios = require('axios')
const logger = require('./logger') // Importa o logger configurado
const httpLogger = require('./middlewares/httpLogger') // Importa o middleware de logs HTTP

const app = express()
const PORT = 3000

app.use(express.json())
app.use(httpLogger) // Middleware que registra logs de todas as requisições HTTP

// Rota inicial para testar o servidor
app.get('/', (req, res) => {
    logger.info('Rota / acessada') // Registra o acesso
    res.send('Server is running!')
})

// Rota para buscar informações do Pokémon
app.get('/pokemon/:name', async (req, res) => {
    try {
        const { name } = req.params // Captura o nome do Pokémon na URL
        logger.info(`Searching for Pokémon information: ${name}`) // Registra a requisição

        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
        const data = {
            name: response.data.name,
            height: response.data.height,
            weight: response.data.weight,
            types: response.data.types.map(t => t.type.name)
        }

        logger.info(`Pokémon Data ${name} returned successfully`) // Log de sucesso
        res.json(data)

    } catch (error) {
        logger.error(`Error searching for Pokémon: ${error.message}`) // Loga erros detalhados se houver falha
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
    logger.info(`Server running on port ${PORT}`) // Log de inicialização do servidor
    console.log(`Server is running on http://localhost:${PORT}`)
})
