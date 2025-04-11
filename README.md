# Pokémon OTEL Monitoring API

Este projeto é uma **API Node.js** com **Express** que consome dados da PokéAPI e implementa **observabilidade completa** com **OpenTelemetry**, **Prometheus**, **Grafana**, **Loki** e **PostgreSQL**. Totalmente containerizado com Docker, ele permite monitorar **logs estruturados**, **tracing distribuído** e **métricas de performance**. Os logs são armazenados no banco de dados e poderão ser visualizados tudo em tempo real via dashboards Grafana.

## ✨ Visão Geral

A aplicação expõe endpoints para buscar dados de Pokémon e monitora cada requisição HTTP com:
- **Traces** exportados via OTLP para o *OpenTelemetry Collector*;
- **Logs** estruturados armazenados no *PostgreSQL*;
- **Métricas** exportadas para *Prometheus* (ex: tempo de resposta HTTP, latência, contadores, etc);
- Tudo sendo visualizado com **Grafana + Loki**;
- Arquitetura containerizada via **Docker Compose**.

## 🛠️ Tecnologias Utilizadas

- **Node.js + Express** – Backend da aplicação
- **Axios** - Requisições HTTP para consumo da PokéAPI
- **Winston** - Logger estruturado com envio para PostgreSQL
- **PostgreSQL** - Banco de dados para armazenamento de logs
- **OpenTelemetry** - Coleta de métricas, traces e logs
- **Prometheus** - Coletor de métricas
- **Grafana + Loki** - Dashboard para visualização de métricas e logs
- **Docker + Docker Compose** - Ambiente containerizado com PostgreSQL, Grafana, Loki, etc.

## 🚀 Funcionalidades implementadas

- ✅ Exporta **traces** com OTLP para o Collector
- ✅ Exporta **métricas** Prometheus (ex: tempo de resposta HTTP)
- ✅ Exporta **logs estruturados** com OTLP para o Loki
- ✅ **Armazena logs** também no PostgreSQL (como backup local)
- ✅ Middleware de logging HTTP
- ✅ Requisições à PokéAPI com logs de sucesso/erro
- ✅ Integração completa com **Grafana** para visualização dos dados

## ⚙️ Como instalar e configurar o projeto

### 1️⃣ Clonar o Repositório

```sh
git clone https://github.com/Diogooliveira10/pokemon-otel.git
cd pokemon-otel
```

### 2️⃣ Instalar Dependências

```sh
npm install
```

### 3️⃣ Suba todos os containers:

```
docker-compose up -d --build
```

### 4️⃣ Acesse:

- **API**: http://localhost:3000

- **Grafana**: http://localhost:3001 (login: `admin` / senha: `admin`)

- **Prometheus**: http://localhost:9090

- **Loki** (via **Grafana**): Explore > Logs

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

### Visualização no Grafana:
- Use a label `{job="pokemon-api"}` para logs no Loki
- Métricas HTTP são expostas em `http://localhost:9464/metrics`
- Dashboards prontos podem ser importados com o ID do dashboard na comunidade Grafana

---

📌 **🧑‍💻 Desenvolvido por Diogo Oliveira** | 💡 _Contribuições são bem-vindas!_
