const logger = require("../logger") // Importa o logger configurado
const { context, trace } = require("@opentelemetry/api")

const httpLogger = (req, res, next) => {
  const start = Date.now() // Marca o início da requisição
  const traceId = trace.getSpan(context.active())?.spanContext().traceId || "not_available"

  res.on("finish", () => {
    const duration = Date.now() - start // Calcula o tempo de resposta
    
    logger.info("HTTP Request", {
      method: req.method, // Método HTTP (GET, POST, PUT, DELETE, etc.)
      url: req.originalUrl, // URL requisitada
      status: res.statusCode, // Código de status HTTP (200, 404, 500, etc.)
      duration: `${duration}ms`, // Tempo de resposta
      ip: req.ip, // Endereço IP do cliente
      traceId,
    })
  })

  next() // Continua para o próximo middleware
}

module.exports = httpLogger