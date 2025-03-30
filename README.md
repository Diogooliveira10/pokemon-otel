# Pokémon OTEL Monitoring

Este projeto tem como objetivo coletar métricas, logs e traces da API do Pokémon utilizando **OpenTelemetry**, **Prometheus** e **Grafana**.

## 📌 Tecnologias Utilizadas

- **Node.js** - Aplicação backend
- **OpenTelemetry Collector** - Coletor de métricas, logs e traces
- **Prometheus** - Banco de dados de séries temporais para armazenar métricas
- **Grafana** - Ferramenta de visualização de métricas
- **Docker** - Gerenciamento de containers

## 🚀 Passo a Passo para Configuração

### 1️⃣ Clonar o Repositório
```bash
git clone https://github.com/Diogooliveira10/pokemon-otel.git
cd pokemon-otel
```

### 2️⃣ Criar e Configurar os Arquivos Necessários

#### Criar o arquivo **otel-config.yaml**
```yaml
receivers:
  otlp:
    protocols:
      grpc:
      http:

exporters:
  prometheus:
    endpoint: "0.0.0.0:9090"

service:
  pipelines:
    metrics:
      receivers: [otlp]
      exporters: [prometheus]
```

#### Criar o arquivo **prometheus.yml**
```yaml
scrape_configs:
  - job_name: 'otel-collector'
    static_configs:
      - targets: ['otel-collector:9090']
```

### 3️⃣ Criar a Rede Docker
```bash
docker network create sentinel
```

### 4️⃣ Subir os Containers Docker

#### OpenTelemetry Collector
```bash
docker run -d --name otel-collector --network sentinel -p 4317:4317 -p 4318:4318 \
-v "$(pwd)/otel-config.yaml:/etc/otel-config.yaml" \
otel/opentelemetry-collector-contrib:latest \
--config /etc/otel-config.yaml
```

#### Prometheus
```bash
docker run -d --name prometheus --network sentinel -p 9090:9090 \
-v "$(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml" \
prom/prometheus
```

#### Grafana
```bash
docker run -d --name grafana --network sentinel -p 3000:3000 grafana/grafana
```

### 5️⃣ Acessar as Ferramentas

- **OpenTelemetry**: Coletando métricas em `http://localhost:4317`
- **Prometheus**: Consultando métricas em `http://localhost:9090`
- **Grafana**: Dashboard de visualização em `http://localhost:3000`

### 6️⃣ Configurar o Grafana

1. Acesse `http://localhost:3000`
2. Adicione o Prometheus como fonte de dados
3. Crie um Dashboard para visualizar as métricas

---

📌 **Feito por Diogo Oliveira** | 💡 _Contribuições são bem-vindas!_

