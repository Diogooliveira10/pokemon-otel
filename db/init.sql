-- Criação da tabela de logs estruturados
CREATE TABLE IF NOT EXISTS logs (
  id SERIAL PRIMARY KEY,
  level TEXT,
  message JSONB,
  trace_id TEXT,
  span_id TEXT,
  trace_flags TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);