# Pokémon OTEL Monitoring API

Este projeto é uma **API Node.js** com **Express** que consome dados da PokéAPI e implementa **observabilidade completa** utilizando **OpenTelemetry**, **Prometheus**, **Grafana**, **Loki**, **Tempo** e **PostgreSQL**. A solução é totalmente containerizada com Docker Compose e permite monitorar **logs estruturados**, **traces distribuídos e métricas de performance**, exibindo os resultados em dashboards modernos no Grafana.

## ✨ Visão Geral

A aplicação expõe endpoints para buscar dados de Pokémon e monitora cada requisição HTTP através de:
- **Traces**: Exportados via OTLP HTTP para o OpenTelemetry Collector e encaminhados para o Tempo
- **Logs**: Estruturados e enviados via OTLP para o Loki
- **Métricas**: Coletadas via Prometheus e exibidas no Grafana
- **Dashboards**: Visualização integrada de traces, logs e métricas no Grafana

## 🛠️ Tecnologias Utilizadas

- **Node.js + Express** – Backend da aplicação
- **Axios** - Requisições HTTP para consumo da PokéAPI
- **OpenTelemetry** - Instrumentação automática e coleta de telemetria
  - SDK Node.js
  - Auto-instrumentações para Express e HTTP
  - Exportador OTLP HTTP
- **PostgreSQL** - Banco de dados para armazenamento de dados
- **Prometheus** - Coleta e armazenamento de métricas
- **Grafana** - Visualização de métricas, logs e traces
- **Loki** - Agregação e busca de logs
- **Tempo** - Armazenamento e visualização de traces distribuídos
- **Docker + Docker Compose** - Containerização e orquestração dos serviços

## 🚀 Funcionalidades implementadas

- ✅ **Traces Distribuídos**
  - Instrumentação automática de requisições HTTP
  - Exportação via OTLP HTTP para o Collector
  - Visualização detalhada no Tempo
  
- ✅ **Logs Estruturados**
  - Exportação via OTLP para o Loki
  - Correlação com traces através de trace ID
  
- ✅ **Métricas**
  - Coleta automática de métricas HTTP
  - Exposição para scrape do Prometheus
  - Visualização em dashboards do Grafana

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

### 5️⃣ Verificar Status

Aguarde todos os serviços iniciarem e verifique se estão saudáveis:
```sh
docker-compose ps
```

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

### Acessar as Interfaces

- **API**: http://localhost:3000
- **Grafana**: http://localhost:3001
  - Login: `admin`
  - Senha: `admin`
- **Prometheus**: http://localhost:9090

### Visualizar Telemetria

1. **Traces**:
   - Acesse o Grafana
   - Vá em Explore > Tempo
   - Busque por: `{ service.name="pokemon-api" }`

2. **Logs**:
   - No Grafana: Explore > Loki
   - Query: `{ job="pokemon-api" }`

3. **Métricas**:
   - No Grafana: Explore > Prometheus
   - Métricas disponíveis incluem requisições HTTP, latência, etc.

## 🔍 Troubleshooting

Se encontrar problemas com a exportação de traces:
1. Verifique os logs do collector: `docker-compose logs -f otel-collector`
2. Confirme se o endpoint no `otel-config.yaml` está correto
3. Verifique se o Tempo está recebendo dados na porta 3201

---

📌 **🧑‍💻 Desenvolvido por Diogo Oliveira** | 💡 _Contribuições são bem-vindas!_
