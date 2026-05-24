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

// ==========================================================
// ROTAS GET (BUSCA DE DADOS)
// ==========================================================

expressApp.get('/api/dashboard-contratos', async (req, res) => {
    try {
        const query = `
            SELECT 
                c.situacao, c.id_profissional AS id_tecnico, c.natureza,
                'Olericultura' AS cadeia_produtiva, 'ATEG MAIS CACAU II' AS projeto,  
                p.nome AS nome_tecnico, p.email AS email_tecnico,
                e.razao_social, c.cnpj_empresa, c.numero_contrato, c.ordem_servico
            FROM contratos c
            LEFT JOIN profissionais_campo p ON c.id_profissional = p.id_tecnico
            LEFT JOIN empresas e ON c.cnpj_empresa = e.cnpj;
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao coletar dados para o dashboard.' });
    }
});

expressApp.get('/api/empresas', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM empresas ORDER BY razao_social ASC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar empresas.' });
    }
});

expressApp.get('/api/profissionais', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM profissionais_campo ORDER BY nome ASC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar profissionais.' });
    }
});

// ✨ ROTA DO BD_EMPRESAS (O RAIO-X COMPLETO DA CONTRATAÇÃO)
expressApp.get('/api/historico-empresas', async (req, res) => {
    try {
        const query = `
            SELECT 
                e.cnpj, 
                e.razao_social,
                e.email_contato AS email_empresa, 
                r.status AS rat_status,
                r.data_rat AS rat_data,
                r.avaliacao AS rat_avaliacao,
                r.observacao AS rat_observacao,
                c.numero_contrato AS juridico_contrato,
                c.situacao AS juridico_situacao,
                c.natureza AS juridico_natureza,
                c.vigencia_contrato, 
                c.inicio_aditivo,
                c.termino_aditivo,
                p.nome AS nome_tecnico,
                p.telefone AS telefone_tecnico
            FROM empresas e
            LEFT JOIN rat r ON e.cnpj = r.cnpj_empresa
            LEFT JOIN contratos c ON e.cnpj = c.cnpj_empresa
            LEFT JOIN profissionais_campo p ON (r.id_tecnico = p.id_tecnico OR c.id_profissional = p.id_tecnico)
            ORDER BY e.razao_social ASC;
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error("Erro no Raio-X BD_Empresas:", error);
        res.status(500).json({ erro: 'Erro ao gerar o cruzamento de histórico das empresas.' });
    }
});

// ==========================================================
// ROTAS POST (SALVAR DADOS)
// ==========================================================

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
        res.status(201).json({ mensagem: 'Empresa salva!', dados: result.rows[0] });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao salvar empresa.' });
    }
});

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
        res.status(201).json({ mensagem: 'Profissional salvo!', dados: result.rows[0] });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao salvar profissional.' });
    }
});

// ✨ ROTA DE CONTRATOS ATUALIZADA COM SUPORTE A ADITIVOS
expressApp.post('/api/contratos', async (req, res) => {
    const { 
        cnpj_empresa, id_profissional, situacao, natureza, numero_contrato, 
        ordem_servico, vigencia_contrato, numero_aditivo, inicio_aditivo, termino_aditivo 
    } = req.body;
    
    try {
        const query = `
            INSERT INTO contratos (
                cnpj_empresa, id_profissional, situacao, natureza, numero_contrato, 
                ordem_servico, vigencia_contrato, numero_aditivo, inicio_aditivo, termino_aditivo
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING *;
        `;
        const result = await pool.query(query, [
            cnpj_empresa, 
            id_profissional, 
            situacao, 
            natureza, 
            numero_contrato, 
            ordem_servico, 
            vigencia_contrato || null, 
            numero_aditivo || null, 
            inicio_aditivo || null, 
            termino_aditivo || null
        ]);
        res.status(201).json({ mensagem: 'Contrato e Aditivo salvos com sucesso!', dados: result.rows[0] });
    } catch (error) {
        console.error("ERRO AO SALVAR CONTRATO:", error);
        res.status(500).json({ erro: error.message }); 
    }
});

expressApp.post('/api/rat', async (req, res) => {
    const { 
        status, data_solicitacao_gerente, local, data_rat, horario, 
        natureza, id_tecnico, cnpj_empresa, email_empresa, municipio, 
        cadeia_produtiva, gerente, email_gerente, observacao, avaliacao 
    } = req.body;
    
    try {
        const query = `
            INSERT INTO rat (
                status, data_solicitacao_gerente, local, data_rat, horario, 
                natureza, id_tecnico, cnpj_empresa, email_empresa, municipio, 
                cadeia_produtiva, gerente, email_gerente, observacao, avaliacao
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
            RETURNING *;
        `;
        
        const result = await pool.query(query, [
            status, data_solicitacao_gerente, local, 
            data_rat || null, horario || null, natureza || null, 
            id_tecnico || null, cnpj_empresa, email_empresa || null, 
            municipio || null, cadeia_produtiva || null, gerente || null, 
            email_gerente || null, observacao || null, avaliacao || null
        ]);
        
        res.status(201).json({ mensagem: 'RAT salvo com sucesso!', dados: result.rows[0] });
    } catch (error) {
        console.error("ERRO NO RAT:", error);
        res.status(500).json({ erro: 'Erro ao salvar RAT no banco.', detalhes: error.message });
    }
});

const PORT = process.env.PORT || 3000;
expressApp.listen(PORT, () => {
    console.log(`Servidor 100% atualizado rodando na porta ${PORT}...`);
});

// ROTA PARA ATUALIZAR DADOS DA EMPRESA
expressApp.put('/api/empresas/:cnpj', async (req, res) => {
    const { cnpj } = req.params;
    const { razao_social, email_contato } = req.body;
    try {
        const query = `UPDATE empresas SET razao_social = $1, email_contato = $2 WHERE cnpj = $3 RETURNING *;`;
        const result = await pool.query(query, [razao_social, email_contato, cnpj]);
        res.json({ mensagem: 'Empresa atualizada!', dados: result.rows[0] });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao atualizar.' });
    }
});