// app.js

const express = require('express');
const app = express();
const PORT = 3001; // Porta diferente da API

// Serve arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Rota para a página principal
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor do site rodando na porta ${PORT}`);
});
