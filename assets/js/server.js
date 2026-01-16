/// server.js
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Conexão com o NEON (Coloque sua string no arquivo .env)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Sua pasta com HTML/CSS/JS deve chamar 'public'

// --- API ROUTES ---

// 1. Pegar Cursos (Filtrados por categoria se quiser)
app.get('/api/courses', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM courses ORDER BY category, title');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Login Simples
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // ATENÇÃO: Em produção, use bcrypt para comparar senhas hash!
        const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password_hash = $2', [email, password]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            delete user.password_hash; // Não devolva a senha pro front
            res.json({ user });
        } else {
            res.status(401).json({ error: "Credenciais inválidas" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Registrar Interesse (Matrícula)
app.post('/api/enroll', async (req, res) => {
    const { userId, courseId } = req.body;
    try {
        await pool.query('INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2)', [userId, courseId]);
        res.json({ message: "Solicitação recebida com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rota coringa para o SPA (Single Page Application)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Sistema rodando em http://localhost:${port}`);
});

app.get('/api/courses', async (req, res) => {
    const { type } = req.query; // Permite filtrar ?type=EJA ou ?type=GRADUACAO
    
    try {
        let query = 'SELECT * FROM courses';
        let params = [];

        if (type) {
            query += ' WHERE type = $1';
            params.push(type.toUpperCase());
        }
        
        query += ' ORDER BY title';
        
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});