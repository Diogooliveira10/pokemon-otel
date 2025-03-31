const winston = require("winston") // Biblioteca popular para logs em Node.js, e configurar para gerar logs estruturados em JSON.
const { Pool } = require("pg") // Importa o pool de conexões com o PostgreSQL
// Diretório para armazenar os logs
const fs = require("fs") // (File System) manipula arquivos e diretórios
const path = require("path") // Garante que os caminhos dos arquivos sejam compatíveis em diferentes sistemas operacionais (Windows, Linux, Mac)

// Configuração do banco de dados
const pool = new Pool({ // `Pool` cria um conjunto de conexões reutilizáveis com o banco de dados
  user: "admin",
  host: "localhost",
  database: "pokemon_logs",
  password: "admin",
  port: 5432,
})

// Garante que o diretório logs existe
const logDirectory = path.join(__dirname, "logs") // Caminho do diretório `logs/`
if (!fs.existsSync(logDirectory)) { // Verifica se o diretório já existe
  fs.mkdirSync(logDirectory)
}

// Transporte customizado para salvar logs no PostgreSQL
class PostgresTransport extends winston.Transport {
  async log(info, callback) {
    const { level, message } = info
    try {
      await pool.query(
        "INSERT INTO logs (level, message, timestamp) VALUES ($1, $2, NOW())",
        [level, message]
      )
    } catch (err) {
      console.warn("Error saving log to the database:", err);
    }
    callback() // Garante que Winston continua processando os logs
  }
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
    new winston.transports.File({ filename: path.join(logDirectory, "app.log") }), // Os logs serão salvos em um arquivo dentro do diretório `logs/`, no arquivo `app.log`
    new PostgresTransport(), // Envia os logs para o PostgreSQL
  ],
})

// Exporta o logger para uso na API
module.exports = logger
