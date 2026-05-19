const express = require('express');
const cors = require('cors');
const mysql = require('mysql2'); // Importando o conector do MySQL

const app = express();

app.use(cors());
app.use(express.json());

// 1. CONFIGURAÇÃO DA CONEXÃO COM O BANCO DE DADOS
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '#Alyfy19', // <--- COLOQUE A SENHA QUE VOCÊ LEMBROU AQUI!
    database: 'kya_db'
});

// 2. TESTANDO A CONEXÃO
db.connect((err) => {
    if (err) {
        console.error('❌ Erro ao conectar no banco de dados:', err.message);
        return;
    }
    console.log('✅ Conectado ao banco de dados MySQL da KYA com sucesso!');
});

// 3. ROTAS DA NOSSA API

// ROTA: Cadastro de novo utilizador
app.post('/api/cadastro', (req, res) => {
    const { nome, email, telefone, cpf } = req.body;
    const query = 'INSERT INTO utilizadores (nome, email, telefone, cpf) VALUES (?, ?, ?, ?)';
    
    db.query(query, [nome, email, telefone, cpf], (err, result) => {
        if (err) {
            console.error('Erro ao cadastrar:', err);
            return res.status(500).json({ erro: 'Erro ao cadastrar utilizador' });
        }
        res.json({ sucesso: true, id: result.insertId });
    });
});

// ROTA: Login simples (verifica se o email existe)
app.post('/api/login', (req, res) => {
    const { email } = req.body;
    const query = 'SELECT id, nome FROM utilizadores WHERE email = ?';
    
    db.query(query, [email], (err, results) => {
        if (err) return res.status(500).json({ erro: 'Erro no servidor' });
        if (results.length > 0) {
            res.json({ autenticado: true, utilizador: results[0] });
        } else {
            res.status(401).json({ autenticado: false, mensagem: 'Utilizador não encontrado' });
        }
    });
});


// Rota de teste padrão
app.get('/api/status', (req, res) => {
    res.json({ sucesso: true, mensagem: 'Servidor da KYA está online!' });
});

// NOVA ROTA: Buscar todos os mercados do banco de dados
app.get('/api/mercados', (req, res) => {
    const query = 'SELECT * FROM mercados';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar mercados:', err);
            return res.status(500).json({ erro: 'Erro interno no servidor' });
        }
        res.json(results); // Envia os mercados em formato JSON para o front-end
    });
});

// ROTA: Buscar histórico de compras de um utilizador específico (ex: ID 1)
app.get('/api/compras/:utilizadorId', (req, res) => {
    const { utilizadorId } = req.params;
    
    // Join para buscar também o nome do mercado
    const query = `
        SELECT c.*, m.nome as nome_mercado 
        FROM compras c 
        JOIN mercados m ON c.mercado_id = m.id 
        WHERE c.utilizador_id = ?
    `;
    
    db.query(query, [utilizadorId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar compras:', err);
            return res.status(500).json({ erro: 'Erro interno' });
        }
        res.json(results);
    });
});

// 4. INICIANDO O SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor KYA rodando na porta ${PORT}`);
});