// Ativa a instrumentação automática com OpenTelemetry (tracing, métricas e logs)
require('./tracing')

const express = require('express')
const axios = require('axios')

// Importa a função de log customizada que envia logs para o OpenTelemetry Collector
const emitLog = require('./logger')

// Middleware de log de requisições HTTP (opcional e configurável)
const httpLogger = require('./middlewares/httpLogger')

const app = express()
const PORT = process.env.PORT || 3000

// Permite o uso de JSON no corpo das requisições
app.use(express.json())

// Middleware para logar todas as requisições HTTP recebidas (GET, POST, etc.)
app.use(httpLogger)

/**
 * Rota principal da API
 * - Teste de status da API
 */
app.get('/', (req, res) => {
  emitLog({
    severityText: 'INFO',
    body: 'Root route accessed',
    attributes: {
      route: '/',
      method: 'GET'
    }
  })

  res.send('Server is running!')
})

/**
 * Rota para buscar informações de um Pokémon via PokéAPI
 * Exemplo: GET /pokemon/pikachu
 */
app.get('/pokemon/:name', async (req, res) => {
  const { name } = req.params

  // Validação do nome
  if (!name || name.trim() === '') {
    emitLog({
      severityText: 'WARN',
      body: 'Empty Pokémon name received',
      attributes: {
        route: '/pokemon/:name',
        method: 'GET'
      }
    })
    return res.status(400).json({ error: 'Pokémon name is required' })
  }

  // Log da requisição
  emitLog({
    severityText: 'INFO',
    body: `Requesting Pokémon: ${name}`,
    attributes: {
      pokemon: name,
      route: '/pokemon/:name',
      method: 'GET'
    }
  })

  try {
    // Consulta à PokéAPI
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)

    // Dados relevantes extraídos da resposta
    const data = {
      name: response.data.name,
      height: response.data.height,
      weight: response.data.weight,
      types: response.data.types.map(t => t.type.name)
    }

    // Log de sucesso
    emitLog({
      severityText: 'INFO',
      body: 'Pokémon data retrieved',
      attributes: {
        ...data,
        route: '/pokemon/:name'
      }
    })

    res.json(data)
  } catch (error) {
    // Log se o Pokémon não for encontrado (404)
    if (error.response && error.response.status === 404) {
      emitLog({
        severityText: 'WARN',
        body: `Pokémon not found: ${name}`,
        attributes: { route: '/pokemon/:name', pokemon: name }
      })
      return res.status(404).json({ error: 'Pokémon not found' })
    }

    // Log de erro genérico (500)
    emitLog({
      severityText: 'ERROR',
      body: 'Error fetching Pokémon',
      attributes: {
        message: error.message,
        stack: error.stack,
        route: '/pokemon/:name'
      }
    })

    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * Middleware global para capturar e registrar erros não tratados
 */
app.use((err, req, res, next) => {
  emitLog({
    severityText: 'ERROR',
    body: 'Unhandled API error',
    attributes: {
      message: err.message,
      stack: err.stack,
      route: req.originalUrl
    }
  })

  res.status(500).send('Internal error!')
})

/**
 * Inicia o servidor na porta especificada
 */
app.listen(PORT, () => {
  emitLog({
    severityText: 'INFO',
    body: `Server running on port ${PORT}`,
    attributes: { port: PORT }
  })

  console.log(`Server is running on http://localhost:${PORT}`)
})
