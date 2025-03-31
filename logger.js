const winston = require("winston") // Biblioteca popular para logs em Node.js, e configurar para gerar logs estruturados em JSON.

const logger = winston.createLogger({
  level: "info", // Níveis: error, warn, info, http, verbose, debug, silly
  format: winston.format.combine(
    winston.format.timestamp(), // Adiciona timestamps
    winston.format.json() // Formato JSON para integração com Loki/Grafana
  ),
  transports: [
    new winston.transports.Console(), // Exibe no console
    new winston.transports.File({ filename: "logs/app.log" }) // Salva em arquivo
  ],
})

module.exports = logger