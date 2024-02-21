const express = require('express');
const http = require('node:http');
const { Server } = require('socket.io');
const cors = require('cors');
const corsOptions = require('./src/options/corsOptions');

// Iniciando servidores
const app = express();

// Configuração de cors
app.use(cors(corsOptions));

// Criando servidor para aplicação juntamente com o socket.io
const server = http.createServer(app);
const io = new Server(server, {
    
    // Em casos onde o domínio é diferente, é necessário configurar o cors do socket.io
    cors: {
        origin: '*'
    }

});

// Evento de conexão websocket
io.on('connection', (socket) => {

    console.log(`Cliente Conectado`)

    socket.on('criarSala', (nomeSala) => {
        socket.join(nomeSala)
        console.log(`SALA ${nomeSala} CRIADA.`)
    });

    socket.on('mensagemSala', (dados) => {
        console.log('DADOS:', dados.sala)
        console.log('MSG:', dados.mensagem)
        io.to(dados.sala).emit('mensagem', dados.mensagem);
    });

    socket.on('disconnect', () => {
        console.log(`Cliente disconectado...`)
    })
});


// Inciando o servidor
server.listen(3333, () => {
    console.log(`Acesse: http://localhost:3333`);
});