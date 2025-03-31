# Pokémon OTEL Monitoring

Este projeto é uma API em Node.js que utiliza OpenTelemetry para coletar métricas, logs e traces. A API consome dados da PokéAPI e armazena logs estruturados no PostgreSQL, permitindo monitoramento e análise com Grafana e Loki.

## 📌 Tecnologias Utilizadas

- **Node.js** - Aplicação backend
- **Express** - Framework para API
- **Axios** - Requisições HTTP para a PokéAPI
- **Winston** - Gerenciamento de logs
- **PostgreSQL** - Banco de dados para armazenamento de logs
- **OpenTelemetry Collector** - Coletor de métricas, logs e traces
- **Prometheus** - Banco de dados de séries temporais para armazenar métricas
- **Grafana** - Ferramenta de visualização de métricas
- **Docker** - Gerenciamento de containers

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
CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    level VARCHAR(10),
    message TEXT,
    timestamp TIMESTAMP DEFAULT NOW(),
    metadata JSONB
);
```

### 4️⃣ Criar o Arquivo `.env`

Crie um arquivo `.env` com as configurações do PostgreSQL:

```
DB_USER=admin
DB_HOST=localhost
DB_DATABASE=pokemon_logs
DB_PASSWORD=suasenha
DB_PORT=5432
```

### 5️⃣ Rodar o Servidor

```sh
node server.js
```

Saída esperada:

```
{"level":"info","message":"Server running on port 3000","timestamp":"..."}
OpenTelemetry started!
```

## 🔍 Testando Logs no Banco de Dados

Após rodar o servidor, acesse o PostgreSQL para verificar os logs armazenados:

```sh
psql -U admin -d pokemon_logs
```

Dentro do psql, execute:

```sql
SELECT * FROM logs;
```

Saída esperada:

```
 id | level | message                   | timestamp           | metadata 
----+-------+---------------------------+---------------------+----------
  1 | info  | Server running on port 3000 | 2025-03-31 19:20:23 | 
  2 | info  | Database log test          | 2025-03-31 19:23:07 | 
```

## 🚀 Próximos Passos

- Configurar Loki e Grafana para visualizar logs
- Adicionar coletores de métricas
- Criar dashboards personalizados

---

📌 **Feito por Diogo Oliveira** | 💡 _Contribuições são bem-vindas!_
