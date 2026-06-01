const express = require('express');
const expressApp = express();
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

expressApp.use(cors());
expressApp.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

expressApp.put('/api/empresas/:cnpj', async (req, res) => {
    const { cnpj } = req.params;
    const { razao_social, email_empresa, rat_status, juridico_situacao, juridico_contrato, vigencia_contrato, termino_aditivo } = req.body;
    try {
        await pool.query(`UPDATE empresas SET razao_social = $1, email_contato = $2 WHERE cnpj = $3`, [razao_social, email_empresa, cnpj]);
        await pool.query(`UPDATE rat SET status = $1 WHERE cnpj_empresa = $2`, [rat_status, cnpj]);
        await pool.query(`UPDATE contratos SET situacao = $1, numero_contrato = $2, vigencia_contrato = $3, termino_aditivo = $4 WHERE cnpj_empresa = $5`, [juridico_situacao, juridico_contrato, vigencia_contrato, termino_aditivo, cnpj]);
        res.json({ mensagem: 'Atualizado!' });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

const PORT = process.env.PORT || 3000;
expressApp.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}...`));