const emitLog = require('../logger') // Importa a função emitLog personalizada

/**
 * Middleware para logar todas as requisições HTTP.
 * 
 * Este middleware:
 * - Marca o tempo inicial da requisição
 * - Aguarda a resposta ser finalizada (res.on('finish'))
 * - Calcula a duração da requisição
 * - Emite um log estruturado com método, rota, status, tempo e timestamp
 */
const httpLogger = (req, res, next) => {
  const start = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - start

    emitLog({
      severityText: 'INFO',
      body: `HTTP ${req.method} ${req.originalUrl} - ${res.statusCode}`,
      attributes: {
        'http.method': req.method,
        'http.route': req.originalUrl,
        'http.status_code': res.statusCode,
        'http.duration_ms': duration
      },
      timestamp: new Date()
    })
  })

  next()
}

module.exports = httpLogger
