# Pokémon OTEL Monitoring API

Este projeto é uma **API Node.js** com **Express** que consome dados da PokéAPI e implementa **observabilidade completa** utilizando **OpenTelemetry**, **Prometheus**, **Grafana**, **Loki**, **Tempo** e **PostgreSQL**. A solução é totalmente containerizada com Docker Compose e permite monitorar **logs estruturados**, **traces distribuídos e métricas de performance**, exibindo os resultados em dashboards modernos no Grafana.

## ✨ Visão Geral

A aplicação expõe endpoints para buscar dados de Pokémon e monitora cada requisição HTTP através de:
- **Traces**: Exportados via OTLP para o OpenTelemetry Collector e encaminhados para o Tempo para visualização dos spans e fluxos de execução.
- **Logs**: Estruturados e enviados via OTLP para o Loki (além de serem persistidos no PostgreSQL).
- **Métricas**: Coletadas via Prometheus (ex.: tempo de resposta, latência, contadores) e exibidas no Grafana.
- **Dashboards automatizados**: Provisionamento automático de datasources e dashboards no Grafana para facilitar a visualização dos dados.

## 🛠️ Tecnologias Utilizadas

- **Node.js + Express** – Backend da aplicação
- **Axios** - Requisições HTTP para consumo da PokéAPI
- **Winston** - Logger estruturado com envio para PostgreSQL
- **PostgreSQL** - Banco de dados para armazenamento de logs
- **OpenTelemetry** - Coleta de traces, métricas e logs (usando SDK, auto-instrumentações e OTLP exporters)
- **Prometheus** - Coleta e armazenamento de métricas
- **Grafana + Loki** - Dashboard para visualização de métricas e logs
- **Grafana Tempo** – Armazenamento e visualização de traces distribuídos
- **Docker + Docker Compose** - Ambiente containerizado com PostgreSQL, Grafana, Loki, etc

## 🚀 Funcionalidades implementadas

- ✅ Exporta **traces** via OTLP (HTTP e gRPC) para o Collector, que encaminha para Tempo
- ✅ Coleta **métricas** com Prometheus e as expõe via Endpoint scrape
- ✅ Exporta **logs estruturados** via OTLP para o Loki e persiste logs no PostgreSQL
- ✅ Middleware de logging HTTP para monitorar todas as requisições
- ✅ Rotas da API com tratamento adequado de logs de sucesso, aviso e erro
- ✅ Provisionamento automático dos datasources e dashboards do Grafana (opcional, configurável)
- ✅ Containerização completa com Docker Compose e healthchecks

## ⚙️ Como instalar e configurar o projeto

### 1️⃣ Clonar o Repositório

```sh
git clone https://github.com/Diogooliveira10/pokemon-otel.git
cd pokemon-otel
```

### 2️⃣ Instalar Dependências

```sh
npm install --legacy-peer-deps
```
Observação: O comando ```--legacy-peer-deps``` é usado para resolver conflitos de dependências do OpenTelemetry.

### 3️⃣ Suba todos os containers:

```
docker-compose up -d --build
```

### 4️⃣ Acesse:

- **API**: http://localhost:3000
- **Grafana**: http://localhost:3001 *(login: `admin` / senha: `admin`)*
- **Prometheus**: http://localhost:9090
- **Tempo**: http://tempo:3200 *(acessível via Grafana internamente)*
- **Loki**: Visualização (via **Grafana**): Explore > Logs

## ⚡ Como usar o projeto

### Requisição para buscar um pokémon:
```
curl http://localhost:3000/pokemon/pikachu
```

### Exemplo de retorno:
```
 {
   "name": "pikachu",
   "height": 4,
   "weight": 60,
   "types": ["electric"]
 }
```

### Verificar Traces, Logs e Métricas
- **Traces**: No Grafana, vá em **Explore** e selecione a fonte de dados **Tempo**. Use a query:
```
{ service.name = "pokemon-api" }
```

- **Logs**: No Grafana, explore **Loki** com a label:
```
{ job="pokemon-api" }
```

- **Métricas**: Acesse http://localhost:9464/metrics e configure um painel em Grafana para Prometheus.

### Provisionamento Automático no Grafana (Opcional)
Se desejar automatizar os datasources e dashboards, veja a seção de Provisionamento no próximo tópico.

---

📌 **🧑‍💻 Desenvolvido por Diogo Oliveira** | 💡 _Contribuições são bem-vindas!_
