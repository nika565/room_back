const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = socketIO(server, {
    cors: {
        origin: '*',
    }
});

io.on('connection', (socket) => {

    socket.on('criarSala', (nomeSala) => {
        socket.join(nomeSala);
    });

    socket.on('mensagemSala', dados => {
        io.to(dados.sala).emit('mensagem', dados);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado...');
    });
});


// Rota padrão para outras requisições HTTP
app.use((req, res) => {
    res.status(404).send('Recurso não encontrado');
});

// Iniciando o servidor
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`http://localhost:3000`);
});
