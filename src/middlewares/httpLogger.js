const logger = require('../logger') // Importa o logger central do projeto

/**
 * Middleware para logar todas as requisições HTTP.
 * 
 * Este middleware:
 * - Marca o tempo inicial da requisição
 * - Aguarda a resposta ser finalizada (res.on('finish'))
 * - Calcula a duração da requisição
 * - Loga método, URL, status, duração e timestamp
 */
const httpLogger = (req, res, next) => {
  // Marca o início da requisição
  const start = Date.now()

  // Aguarda a resposta ser finalizada
  res.on('finish', () => {
    const duration = Date.now() - start

    // Registra os detalhes da requisição como log estruturado
    logger.info({
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration,
      timestamp: new Date().toISOString()
    })
  })

  next() // Passa para o próximo middleware ou rota
}

module.exports = httpLogger
