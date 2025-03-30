const { NodeSDK } = require('@opentelemetry/sdk-node') // Importa o SDK do OpenTelemetry para Node.js
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node') // Auto-instrumentações para detectar requisições HTTP, DB, etc.
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http')// Exportador para enviar os traces para o OTEL Collector via HTTP

const traceExporter = new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces', // Endpoint do OTEL Collector
})

const sdk = new NodeSDK({
    traceExporter, // Exportador de traces
    instrumentations: [getNodeAutoInstrumentations()] // Instrumentações automáticas para monitorar requisições HTTP, DB, etc.
})

// Inicializa o OpenTelemetry de forma assíncrona
async function startOpenTelemetry() {
    try {
        await sdk.start() // Inicia o OpenTelemetry para capturar traces
        console.log('OpenTelemetry started!')
    } catch (err) {
        console.error('Error starting OpenTelemetry:', err)
    }
}

startOpenTelemetry();

// Fecha o SDK corretamente ao encerrar a aplicação
process.on('SIGTERM', async () => {
    try {
        await sdk.shutdown() // Encerra o OpenTelemetry e exporta todos os dados pendentes
        console.log('OpenTelemetry finished!')
    } catch (err) {
        console.error('Error terminating OpenTelemetry:', err)
    } finally {
        process.exit(0) // Finaliza o processo de maneira limpa
    }
});
