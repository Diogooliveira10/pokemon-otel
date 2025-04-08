# Pokémon OTEL Monitoring

Este projeto é uma API em *Node.js* que integra *OpenTelemetry*, *PostgreSQL*, *Prometheus*, *Grafana* e *Loki* para fornecer *observabilidade completa* (tracing, logs e métricas) de chamadas à PokéAPI. Os logs são armazenados no banco de dados e poderão ser visualizados tudo em tempo real via dashboards Grafana.

## ✨ Visão Geral

A aplicação expõe endpoints para buscar dados de Pokémon e monitora cada requisição HTTP com:
- **Traces** exportados via OTLP para o *OpenTelemetry Collector*;
- **Logs** estruturados armazenados no *PostgreSQL*;
- **Métricas** exportadas para *Prometheus* (ex: tempo de resposta HTTP, latência, contadores, etc);
- Tudo sendo visualizado com **Grafana + Loki**.

## 🛠️ Tecnologias Utilizadas

- **Node.js + Express** – Backend da aplicação
- **Axios** - Requisições HTTP para consumo da PokéAPI
- **Winston** - Gerenciamento de logs
- **PostgreSQL** - Banco de dados para armazenamento de logs
- **OpenTelemetry** - Coleta de métricas, traces e logs
- **Prometheus** - Coletor de métricas
- **Grafana + Loki** - Dashboard para visualização de métricas e logs
- **Docker** - Ambiente containerizado com PostgreSQL, Grafana, Loki, etc.

## ⚙️ Configuração do Projeto

### 1️⃣ Clonar o Repositório

```sh
git clone https://github.com/Diogooliveira10/pokemon-otel.git
cd pokemon-otel
```

### 2️⃣ Instalar Dependências

```sh
npm install
```

### 3️⃣ Configurar Banco de Dados PostgreSQL

Criar um banco de dados chamado `pokemon_logs` e a tabela de logs:

```sql
CREATE DATABASE pokemon_logs;

\c pokemon_logs

CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    level VARCHAR(10),
    message JSONB,
    trace_id VARCHAR(255),
    span_id VARCHAR(255),
    trace_flags VARCHAR(255),
    timestamp TIMESTAMP DEFAULT NOW()
);
```

### 4️⃣ Configurar o Arquivo `.env`

Crie um arquivo `.env` com as configurações do PostgreSQL:

```
PORT=3000

# Banco de Dados PostgreSQL
DB_USER=admin
DB_HOST=localhost
DB_NAME=pokemon_logs
DB_PASSWORD=admin
DB_PORT=5432

DATABASE_URL=postgresql://admin:admin@localhost:5432/pokemon_logs

# OpenTelemetry
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
OTEL_SERVICE_NAME=pokemon-api
```

### 5️⃣ Rodar o Servidor

```sh
node src/server.js
```

Saída esperada:

```
✅ OpenTelemetry initialized
✅ Prometheus scrape endpoint: http://localhost:9464/metrics
{"level":"info","message":"Server running on port 3000", ...}
```

## 🧪 Testando a Observabilidade

### Traces
1. Acesse `http://localhost:3000/pokemon/pikachu`
2. Veja os **traces** no Grafana (via Tempo ou outro visualizador OTLP)

### Logs
Após acessar rotas da API (ex: /pokemon/pikachu), veja os logs no banco:

```sh
psql -U admin -d pokemon_logs
```

Verifique os logs:

```sql
SELECT * FROM logs;
```
Ou visualize no Grafana, via Loki.

## 📊 Métricas Prometheus

O endpoint de métricas Prometheus estará disponível em:

```
http://localhost:9464/metrics
```

Você poderá configurar o Prometheus para ler esse endpoint e exibir as métricas no Grafana.

## 🖥️ Painéis no Grafana
```
http://localhost:3000
http://localhost:9464/metrics
http://localhost:3001 (Grafana)
```
Login padrão Grafana: `admin` / `admin`

## 📌 Observabilidade Reunida

| Tipo        | Coletado por           | Visualizado com       |
|-------------|------------------------|-----------------------|
| Logs        | Winston + OTEL         | Loki + Grafana        |
| Traces      | OTEL Tracing SDK       | Tempo / Grafana       |
| Métricas    | Prometheus Exporter    | Grafana Dashboards    |

---

📌 **🧑‍💻 Desenvolvido por Diogo Oliveira** | 💡 _Contribuições são bem-vindas!_
