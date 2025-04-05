'use strict'

const { NodeSDK } = require('@opentelemetry/sdk-node')
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node')
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http')
const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus')

// Exportador OTLP para enviar traces ao OpenTelemetry Collector via HTTP
const traceExporter = new OTLPTraceExporter()

// Exportador Prometheus para expor métricas na porta 9464
const prometheusExporter = new PrometheusExporter({ port: 9464 }, () => {
  console.log('Prometheus scrape endpoint: http://localhost:9464/metrics')
})

// Configuração do SDK do OpenTelemetry
const sdk = new NodeSDK({
  traceExporter, // Envia traces
  metricReader: prometheusExporter, // Exposição de métricas
  instrumentations: [getNodeAutoInstrumentations()], // Instrumentação automática
})

// Inicia o SDK de observabilidade
sdk.start()
console.log('OpenTelemetry initialized')

// Encerra o SDK com segurança ao receber SIGTERM (ex: CTRL+C)
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('SDK shut down successfully'))
    .catch((err) => console.error('Error shutting down SDK', err))
    .finally(() => process.exit(0))
})
