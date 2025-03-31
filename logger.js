const winston = require("winston") // Biblioteca popular para logs em Node.js, e configurar para gerar logs estruturados em JSON.

// Diretório para armazenar os logs
const fs = require("fs") // (File System) manipula arquivos e diretórios
const path = require("path") // Garante que os caminhos dos arquivos sejam compatíveis em diferentes sistemas operacionais (Windows, Linux, Mac)

// Garante que o diretório logs existe
const logDirectory = path.join(__dirname, "logs") // Caminho do diretório `logs/`
if (!fs.existsSync(logDirectory)) { // Verifica se o diretório já existe
  fs.mkdirSync(logDirectory)
}

// Configuração do logger
const logger = winston.createLogger({
  level: "info", // Níveis: error, warn, info, http, verbose, debug, silly
  format: winston.format.combine(
    winston.format.timestamp(), // Adiciona timestamps
    winston.format.json() // Formato JSON para integração com Loki/Grafana
  ),
  // Define onde os logs serão armazenados
  transports: [
    new winston.transports.Console(), // Os logs serão exibidos no console (útil para depuração durante o desenvolvimento)
    new winston.transports.File({ filename: path.join(logDirectory, "app.log") }) // Os logs serão salvos em um arquivo dentro do diretório `logs/`, no arquivo `app.log`
  ],
})

// Exporta o logger para uso na API
module.exports = logger