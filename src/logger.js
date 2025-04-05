require('dotenv').config()

const { createLogger, format, transports } = require('winston')
const { combine, timestamp, json } = format
const { Pool } = require('pg')

// Cria uma pool de conexões com o banco PostgreSQL usando a DATABASE_URL do .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

/**
 * Logger central usando Winston.
 * - Formato: JSON com timestamp
 * - Destino: console
 */
const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), json()),
  transports: [new transports.Console()],
})

/**
 * Salva cada log gerado no banco de dados PostgreSQL.
 * 
 * Campos salvos:
 * - level: nível do log (info, error, etc.)
 * - message: conteúdo do log (objeto ou texto)
 * - trace_id, span_id, trace_flags: dados de trace do OpenTelemetry (se disponíveis)
 * - timestamp: data/hora do log
 */
const saveLogToDB = async (info) => {
  try {
    await pool.query(
      'INSERT INTO logs (level, message, trace_id, span_id, trace_flags, timestamp) VALUES ($1, $2, $3, $4, $5, $6)',
      [
        info.level,
        typeof info.message === 'object' ? info.message : { text: info.message },
        info.trace_id || null,
        info.span_id || null,
        info.trace_flags || null,
        info.timestamp ? new Date(info.timestamp) : new Date(),
      ]
    )
  } catch (error) {
    console.error('Failed to save log to DB:', error)
  }
}

// Captura todos os logs emitidos e salva no banco
logger.on('data', (info) => {
  saveLogToDB(info)
})

module.exports = logger
