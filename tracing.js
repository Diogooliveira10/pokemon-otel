const { NodeSDK } = require('@opentelemetry/sdk-node')
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node')
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http')

const traceExporter = new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces' // Endpoint do OTEL Collector
})

const sdk = new NodeSDK({
    traceExporter,
    instrumentations: [getNodeAutoInstrumentations()]
})

// Inicializa OpenTelemetry
sdk.start()
    .then(() => console.log('OpenTelemetry iniciado!'))
    .catch(err => console.error('Erro ao iniciar OpenTelemetry', err))

// Fecha o SDK corretamente ao encerrar a aplicação
process.on('SIGTERM', () => {
    sdk.shutdown()
        .then(() => console.log('OpenTelemetry finalizado!'))
        .catch(err => console.error('Erro ao finalizar OpenTelemetry', err))
        .finally(() => process.exit(0))
})