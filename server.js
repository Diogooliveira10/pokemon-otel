const express = require('express')
const axios = require('axios')

const app = express()
const PORT = 3000

// Rota inicial para testar o servidor
app.get('/', (req, res) => {
    res.send('Server is running!')
})

// Rota para buscar informações do Pokémon
app.get('/pokemon/:name', async (req, res) => {
    try {
        const { name } = req.params // Captura o nome do Pokémon na URL
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)

        res.json({
            name: response.data.name,
            height: response.data.height,
            weight: response.data.weight,
            types: response.data.types.map(t => t.type.name)
        })
    } catch (error) {
        res.status(500).json({ error: 'Pokémon not found!' })
    }
})

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})