const express = require('express');
const expressApp = express();
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

expressApp.use(cors());
expressApp.use(express.json());

// Conexão com o Supabase
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Rota de teste inicial
expressApp.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW() as data_banco');
        res.json({ mensagem: '🚀 Servidor conectado ao Supabase!', data: result.rows[0].data_banco });
    } catch (error) {
        res.status(500).json({ erro: 'Falha na conexão.' });
    }
});

// ROTA DO DASHBOARD GERAL - INFORMAÇÕES ADMINISTRATIVAS UNIFICADAS
expressApp.get('/api/dashboard-contratos', async (req, res) => {
    try {
        const query = `
            SELECT 
                c.situacao,
                c.id_profissional AS id_tecnico,
                c.natureza,
                'Olericultura' AS cadeia_produtiva, 
                'ATEG MAIS CACAU II' AS projeto,  
                p.nome AS nome_tecnico,
                p.email AS email_tecnico,
                e.razao_social,
                c.cnpj_empresa,
                c.numero_contrato,
                c.ordem_servico
            FROM contratos c
            LEFT JOIN profissionais_campo p ON c.id_profissional = p.id_tecnico
            LEFT JOIN empresas e ON c.cnpj_empresa = e.cnpj;
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao coletar dados para o dashboard.' });
    }
});

// 1. ROTA PARA SALVAR EMPRESA
expressApp.post('/api/empresas', async (req, res) => {
    const { cnpj, razao_social, email_contato } = req.body;
    
    try {
        const query = `
            INSERT INTO empresas (cnpj, razao_social, email_contato) 
            VALUES ($1, $2, $3) 
            ON CONFLICT (cnpj) DO UPDATE SET razao_social = $2, email_contato = $3
            RETURNING *;
        `;
        const result = await pool.query(query, [cnpj, razao_social, email_contato]);
        res.status(201).json({ mensagem: 'Empresa salva com sucesso!', dados: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao salvar a empresa no banco de dados.' });
    }
});

// 2. ROTA PARA SALVAR PROFISSIONAL (TÉCNICO/SUPERVISOR)
expressApp.post('/api/profissionais', async (req, res) => {
    const { id_tecnico, nome, tipo, email, telefone } = req.body;
    
    try {
        const query = `
            INSERT INTO profissionais_campo (id_tecnico, nome, tipo, email, telefone) 
            VALUES ($1, $2, $3, $4, $5) 
            ON CONFLICT (id_tecnico) DO UPDATE SET nome = $2, tipo = $3, email = $4, telefone = $5
            RETURNING *;
        `;
        const result = await pool.query(query, [id_tecnico, nome, tipo, email, telefone]);
        res.status(201).json({ mensagem: 'Profissional salvo com sucesso!', dados: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao salvar o profissional no banco de dados.' });
    }
});

// 3. ROTA PARA SALVAR CONTRATO / INFORMAÇÃO JURÍDICA
expressApp.post('/api/contratos', async (req, res) => {
    const { cnpj_empresa, id_profissional, situacao, natureza, numero_contrato, ordem_servico, vigencia_contrato, vigencia_aditivo } = req.body;
    
    try {
        const query = `
            INSERT INTO contratos (cnpj_empresa, id_profissional, situacao, natureza, numero_contrato, ordem_servico, vigencia_contrato, vigencia_aditivo) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING *;
        `;
        const result = await pool.query(query, [
            cnpj_empresa, 
            id_profissional, 
            situacao, 
            natureza, 
            numero_contrato, 
            ordem_servico, 
            vigencia_contrato || null, // Corrigido! Sem o ":" e com o nome certo
            vigencia_aditivo || null   // Corrigido!
        ]);
        res.status(201).json({ mensagem: 'Contrato salvo com sucesso!', dados: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao salvar o contrato no banco de dados.' });
    }
});

const PORT = process.env.PORT || 3000;
expressApp.listen(PORT, () => {
    console.log(`Servidor 100% atualizado rodando na porta ${PORT}...`);
});