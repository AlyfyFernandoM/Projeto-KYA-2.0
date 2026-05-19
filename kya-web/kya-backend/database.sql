-- Tabela de Utilizadores (Perfil e Configurações)
CREATE TABLE utilizadores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    morada_padrao VARCHAR(255),
    preferencias_alimentares TEXT -- Ex: "Vegano, Sem Lactose"
);

-- Tabela de Mercados
CREATE TABLE mercados (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    distancia VARCHAR(50),
    tags VARCHAR(255) -- Ex: "geral carnes padaria" para a nossa barra de pesquisa
);

-- Tabela de Histórico de Compras
CREATE TABLE compras (
    id SERIAL PRIMARY KEY,
    utilizador_id INT REFERENCES utilizadores(id),
    mercado_id INT REFERENCES mercados(id),
    produtos TEXT NOT NULL,
    tempo_entrega VARCHAR(50),
    avaliacao VARCHAR(20),
    data_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir alguns dados de teste para podermos ver na API
INSERT INTO mercados (nome, distancia, tags) VALUES 
('Mercado Central', '1.2 km de distância', 'geral limpeza'),
('Hortifruti KYA', '2.5 km de distância', 'frutas verduras saudável orgânico');