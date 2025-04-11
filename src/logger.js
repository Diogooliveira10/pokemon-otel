require('dotenv').config()

const { Pool } = require('pg')
const { Resource } = require('@opentelemetry/resources')
const { LoggerProvider, SimpleLogRecordProcessor } = require('@opentelemetry/sdk-logs')
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http')
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api')
const os = require('os')

// Ativa diagnósticos do OpenTelemetry (para debugging)
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO)

// Cria pool de conexões com o PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// Define os metadados do serviço para o OpenTelemetry
const resource = new Resource({
  'service.name': process.env.OTEL_SERVICE_NAME || 'pokemon-api',
  'service.instance.id': os.hostname(),
  'host.name': os.hostname(),
  app: 'pokemon-api', // usado como label em Loki/Grafana
})

// Exportador de logs via OTLP HTTP
const logExporter = new OTLPLogExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://otel-collector:4318/v1/logs',
})

// Configura o LoggerProvider e adiciona o processador
const loggerProvider = new LoggerProvider({ resource })
loggerProvider.addLogRecordProcessor(new SimpleLogRecordProcessor(logExporter))

// Obtém um logger nomeado
const logger = loggerProvider.getLogger('pokemon-api')

/**
 * Salva log no banco PostgreSQL (para persistência adicional)
 */
const saveLogToDB = async ({ body, attributes = {}, severityText, timestamp }) => {
  try {
    await pool.query(
      `INSERT INTO logs (level, message, trace_id, span_id, trace_flags, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        severityText?.toLowerCase?.() || 'info',
        typeof body === 'object' ? body : { text: body },
        attributes['trace_id'] || null,
        attributes['span_id'] || null,
        attributes['trace_flags'] || null,
        timestamp ? new Date(timestamp) : new Date(),
      ]
    )
  } catch (error) {
    console.error('Failed to save log to DB:', error)
  }
}

/**
 * Função para emitir log via OpenTelemetry e salvar no banco
 */
const emitLog = (logData) => {
  logger.emit(logData)
  saveLogToDB(logData)
}

module.exports = emitLog
