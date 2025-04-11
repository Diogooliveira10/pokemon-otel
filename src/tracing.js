'use strict'

const { NodeSDK } = require('@opentelemetry/sdk-node')
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node')
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http')
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http')
const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus')
const { Resource } = require('@opentelemetry/resources')
const { LoggerProvider, BatchLogRecordProcessor } = require('@opentelemetry/sdk-logs')
const os = require('os')

// === Resource comum para logs, traces e métricas ===
const resource = new Resource({
  'service.name': process.env.OTEL_SERVICE_NAME || 'pokemon-api',
  'service.instance.id': os.hostname(),
  'host.name': os.hostname(),
  app: 'pokemon-api',
})

// === Exportadores ===
const traceExporter = new OTLPTraceExporter()
const prometheusExporter = new PrometheusExporter({ port: 9464 }, () => {
  console.log('Prometheus scrape endpoint: http://localhost:9464/metrics')
})
const logExporter = new OTLPLogExporter()

// === Logger Provider separado para logs OTLP ===
const loggerProvider = new LoggerProvider({ resource })
loggerProvider.addLogRecordProcessor(new BatchLogRecordProcessor(logExporter))

// === SDK Node com métricas e traces ===
const sdk = new NodeSDK({
  resource,
  traceExporter,
  metricReader: prometheusExporter,
  instrumentations: [getNodeAutoInstrumentations()],
  loggerProvider, // Aqui está o loggerProvider incluído no SDK
})

// Inicializa SDK
sdk.start()
console.log('OpenTelemetry initialized')

// Encerra o SDK ao sair
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('SDK shut down successfully'))
    .catch((err) => console.error('Error shutting down SDK', err))
    .finally(() => process.exit(0))
})
