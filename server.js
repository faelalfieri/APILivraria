const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = "seuSegredoJWT"; // Altere para um segredo mais seguro

app.use(bodyParser.json());
app.use(cors());

// 📌 Conectar ao MongoDB (sem opções deprecated)
mongoose.connect('mongodb://localhost:27017/biblioteca')
    .then(() => console.log('MongoDB conectado!'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// 📌 Modelos (Schemas)
const AutorSchema = new mongoose.Schema({
    numero: { type: Number, unique: true },
    nome: String
});

const LivroSchema = new mongoose.Schema({
    numero: { type: Number, required: true },
    titulo: String,
    edicao: String,
    isbn: String,
    categoria: String
});

const Autor = mongoose.model('Autor', AutorSchema);
const Livro = mongoose.model('Livro', LivroSchema);

// 📌 Middleware de Autenticação
const autenticarToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ mensagem: "Token necessário" });

    jwt.verify(token.split(" ")[1], SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ mensagem: "Token inválido" });
        req.user = user;
        next();
    });
};

// 📌 Rota para login (gera token JWT)
app.post('/api/login', (req, res) => {
    const { usuario } = req.body;
    if (!usuario) return res.status(400).json({ mensagem: "Usuário obrigatório" });

    const token = jwt.sign({ usuario }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// 📌 Criar um novo autor
app.post('/api/v1/autor', autenticarToken, async (req, res) => {
    try {
        const autor = new Autor(req.body);
        await autor.save();
        res.status(201).json(autor);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

// 📌 Criar um novo livro para um autor específico
app.post('/api/v1/autor/:numero/livro', autenticarToken, async (req, res) => {
    try {
        const { numero } = req.params;
        const livro = new Livro({ ...req.body, numero });
        await livro.save();
        res.status(201).json(livro);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

// 📌 Buscar um autor pelo número
app.get('/api/v1/autor/:numero', async (req, res) => {
    try {
        const autor = await Autor.findOne({ numero: req.params.numero });
        if (!autor) return res.status(404).json({ mensagem: "Autor não encontrado" });
        res.json(autor);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// 📌 Listar todos os autores
app.get('/api/v1/autor/', async (req, res) => {
    try {
        const autores = await Autor.find();
        res.json(autores);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// 📌 Listar todos os livros de um autor específico
app.get('/api/v1/autor/:numero/livro/', async (req, res) => {
    try {
        const livros = await Livro.find({ numero: req.params.numero });
        res.json(livros);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// 📌 Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});