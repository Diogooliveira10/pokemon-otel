# Utiliza a imagem oficial do Node.js versão 20 como base
FROM node:20

# Define o diretório de trabalho dentro do container como /app
# Todos os comandos subsequentes serão executados dentro desse diretório
WORKDIR /app

# Copia os arquivos de dependências (package.json e package-lock.json) para o diretório de trabalho do container
COPY package*.json ./

# Instala as dependências, ignorando conflitos de peer dependencies
RUN npm install --legacy-peer-deps

# Copia todos os demais arquivos da aplicação para o diretório de trabalho no container
COPY . .

# Expõe a porta 3000 para acesso externo ao container
# Essa é a porta onde a API Node.js estará escutando
EXPOSE 3000

# Define o comando padrão para iniciar a aplicação quando o container for iniciado
CMD ["node", "src/server.js"]
