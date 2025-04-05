require("dotenv").config()

// Biblioteca para logs em Node.js, e configurar para gerar logs estruturados em JSON.
const winston = require("winston")
// Importa o pool de conexões com o PostgreSQL
const { Pool } = require("pg")
// Diretório para armazenar os logs
const fs = require("fs")
// Garante que os caminhos dos arquivos sejam compatíveis em diferentes sistemas operacionais (Windows, Linux, Mac)
const path = require("path")

// Garante que o diretório logs existe
const logDirectory = path.join(__dirname, "logs") // Caminho do diretório `logs/`
if (!fs.existsSync(logDirectory)) { // Verifica se o diretório já existe
  fs.mkdirSync(logDirectory)
}

// Verifica se todas as variáveis de ambiente do banco estão configuradas
const isDbConfigured =
  process.env.DB_USER &&
  process.env.DB_HOST &&
  process.env.DB_NAME &&
  process.env.DB_PASSWORD &&
  process.env.DB_PORT

let pool
if (isDbConfigured) {
  // Configuração do pool de conexões com PostgreSQL
  pool = new Pool({ // `Pool` cria um conjunto de conexões reutilizáveis com o banco de dados
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  })
} else {
  console.warn(
    "⚠️ PostgreSQL environment variables are not configured. Logs will not be sent to the database."
  )
}

// Transporte customizado para salvar logs no PostgreSQL
class PostgresTransport extends winston.Transport {
  async log(info, callback) {
    const { level, message } = info;
    try {
      await pool.query(
        "INSERT INTO logs (level, message, timestamp) VALUES ($1, $2, NOW())",
        [level, message]
      );
    } catch (err) {
      console.warn("Erro ao salvar log no banco de dados:", err.message);
    }
    // Garante que Winston continua processando os logs
    callback()
  }
}

// Configuração do logger
const logger = winston.createLogger({
  // Níveis: error, warn, info, http, verbose, debug, silly
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    // Formato JSON para integração com Loki/Grafana
    winston.format.json()
  ),
  // Define onde os logs serão armazenados
  transports: [
    // Os logs serão exibidos no console (útil para depuração durante o desenvolvimento)
    new winston.transports.Console(),
    // Os logs serão salvos em um arquivo dentro do diretório `logs/`, no arquivo `app.log`
    new winston.transports.File({
      filename: path.join(logDirectory, "app.log"),
    }),
    new winston.transports.File({
      filename: path.join(logDirectory, "error.log"),
      level: "error",
    }),
    // Envia os logs para o PostgreSQL
    ...(isDbConfigured ? [new PostgresTransport()] : []),
  ],
})

// Exporta o logger para uso na API
module.exports = logger