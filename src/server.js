// Importa a configuração do OpenTelemetry
require('./tracing')

const express = require('express')
const axios = require('axios')
// Importa o logger configurado
const logger = require('./logger')
// Importa o middleware de logs HTTP
const httpLogger = require('./middlewares/httpLogger')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
// Middleware que registra logs de todas as requisições HTTP
app.use(httpLogger)

// Rota inicial para testar o servidor
app.get('/', (req, res) => {
    logger.info('Root route accessed')
    res.send('Server is running!')
});

// Rota para buscar informações do Pokémon
app.get('/pokemon/:name', async (req, res) => {
    // Captura o nome do Pokémon na URL
    const { name } = req.params

    // Validação do parâmetro `name`
    if (!name || name.trim() === "") {
        logger.warn("Empty Pokémon name received");
        return res.status(400).json({ error: "Pokémon name is required" })
    }

    // Registra a requisição
    logger.info(`Requesting Pokémon: ${name}`)

    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
        const data = {
            name: response.data.name,
            height: response.data.height,
            weight: response.data.weight,
            types: response.data.types.map(t => t.type.name)
        };

        // Log de sucesso
        logger.info("Pokémon data retrieved", data)
        res.json(data)
    } catch (error) {
        if (error.response && error.response.status === 404) {
            logger.warn(`Pokémon not found: ${name}`)
            return res.status(404).json({ error: "Pokémon not found" })
        }

        // Loga erros detalhados se houver falha
        logger.error("Error fetching Pokémon", { message: error.message, stack: error.stack })
        res.status(500).json({ error: "Internal server error" })
    }
});

// Global error handler
app.use((err, req, res, next) => {
    // Captura qualquer erro inesperado na API
    logger.error("Unhandled API error", { message: err.message, stack: err.stack })
    res.status(500).send("Internal error!")
});

app.listen(PORT, () => {
    // Inicia o servidor
    logger.info(`Server running on port ${PORT}`)
    console.log(`Server is running on http://localhost:${PORT}`)
});
