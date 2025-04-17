'use strict'

const { NodeSDK } = require('@opentelemetry/sdk-node')
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node')
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http')
const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus')
const { Resource } = require('@opentelemetry/resources')
const { TraceIdRatioBasedSampler } = require('@opentelemetry/sdk-trace-base')
const {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_INSTANCE_ID,
  HOST_NAME,
  SEMRESATTRS_SERVICE_VERSION
} = require('@opentelemetry/semantic-conventions')

// Configuração do exportador OTLP com timeout e tratamento de erros
const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
  timeoutMillis: 15000,
  concurrencyLimit: 10,
  headers: {},
  onSuccess: (result) => {
    console.log('Trace exported successfully:', result);
  },
  onError: (error) => {
    console.error('Error exporting trace:', error);
  }
})

// Exportador Prometheus com tratamento de erros
const prometheusExporter = new PrometheusExporter({ port: 9464 }, (err) => {
  if (err) {
    console.error('Erro ao iniciar exportador Prometheus:', err)
    return
  }
  console.log('Prometheus scrape endpoint: http://localhost:9464/metrics')
})

// Recursos enriquecidos para melhor contexto
const resource = Resource.default().merge(
  new Resource({
    [SEMRESATTRS_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || 'pokemon-api',
    [SEMRESATTRS_SERVICE_INSTANCE_ID]: require('os').hostname(),
    [HOST_NAME]: require('os').hostname(),
    [SEMRESATTRS_SERVICE_VERSION]: process.env.npm_package_version || '1.0.0',
    app: 'pokemon-api',
    environment: process.env.NODE_ENV || 'development',
    deployment: process.env.DEPLOYMENT_ENV || 'local'
  })
)

// Configuração do SDK com sampling e tratamento de erros
const sdk = new NodeSDK({
  resource,
  traceExporter,
  metricReader: prometheusExporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': { enabled: false },
      '@opentelemetry/instrumentation-dns': { enabled: false },
      '@opentelemetry/instrumentation-express': { enabled: true },
      '@opentelemetry/instrumentation-http': { enabled: true }
    })
  ],
  sampler: new TraceIdRatioBasedSampler(1.0)
})

// Inicialização com tratamento de erros
async function initializeTracing() {
  try {
    await sdk.start()
    console.log('OpenTelemetry inicializado com sucesso')
  } catch (error) {
    console.error('Erro ao inicializar OpenTelemetry:', error)
    process.exit(1)
  }
}

// Shutdown seguro
async function shutdownTracing() {
  try {
    await sdk.shutdown()
    console.log('SDK do OpenTelemetry encerrado com sucesso')
  } catch (error) {
    console.error('Erro ao encerrar SDK do OpenTelemetry:', error)
  } finally {
    process.exit(0)
  }
}

// Inicializa o tracing
initializeTracing()

// Tratamento de sinais de encerramento
process.on('SIGTERM', shutdownTracing)
process.on('SIGINT', shutdownTracing)
