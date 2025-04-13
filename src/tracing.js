'use strict'

const { NodeSDK } = require('@opentelemetry/sdk-node')
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node')
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http')
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http')
const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus')
const { Resource } = require('@opentelemetry/resources')
const { LoggerProvider, BatchLogRecordProcessor } = require('@opentelemetry/sdk-logs')
const os = require('os')

// === Recurso comum para todos os dados observáveis ===
const resource = new Resource({
  'service.name': process.env.OTEL_SERVICE_NAME || 'pokemon-api',
  'service.instance.id': os.hostname(),
  'host.name': os.hostname(),
  app: 'pokemon-api',
})

// === Exportadores ===
// Traces → para o Collector (que repassa ao Tempo)
const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT || 'http://otel-collector:4318/v1/traces'
})

// Métricas → Prometheus (scrape em :9464)
const prometheusExporter = new PrometheusExporter({ port: 9464 }, () => {
  console.log('Prometheus scrape endpoint: http://localhost:9464/metrics')
})

// Logs → Collector (que repassa ao Loki)
const logExporter = new OTLPLogExporter({
  url: process.env.OTEL_EXPORTER_OTLP_LOGS_ENDPOINT || 'http://otel-collector:4318/v1/logs'
})

// Logger Provider manual (fora do NodeSDK) 
const loggerProvider = new LoggerProvider({ resource })
loggerProvider.addLogRecordProcessor(new BatchLogRecordProcessor(logExporter))

// SDK completo com Traces, Métricas e AutoInstrumentação
const sdk = new NodeSDK({
  resource,
  traceExporter,
  metricReader: prometheusExporter,
  instrumentations: [getNodeAutoInstrumentations()],
  loggerProvider,
})

sdk.start()
console.log('OpenTelemetry initialized')

// Encerra o SDK com segurança ao finalizar
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('SDK shut down successfully'))
    .catch((err) => console.error('Error shutting down SDK', err))
    .finally(() => process.exit(0))
})
