const express = require('express');

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, { cors: { origin: '*' } })
const SERVER_PORT = 5000


var initial = {
    msg: 'Seja bem vindo ao chat da Simpli art, qual sua dúvida?'
}

var Tokens = []
var Message = {}


io.on('connection', socket => {
    
    socket.on('auth', data => {
        var user = {
            token: socket.id,
            src: data.src
        }
        Tokens.push(user)
        console.log(`[IO] => New Connection(${data.src} -> ${socket.id})`)
    })


    socket.on('sendMessage_client', data => {

        let from = []
        if (data.from == 'admin') {
            for (let index = 1; index < Tokens.length; index++) {
                if (Tokens[index].src === data.from && Tokens[index].token != socket.id) {
                    from.push(Tokens[index].token)
                }
            }
        } else {
            from = data.from
        }

        
        var clientIp = socket.request.connection.remoteAddress;
        
        Message = {
            to: socket.id,
            from: from,
            message: data.msg,
            address: clientIp
        }

        console.log(Message)

        io.to(Message.from).emit('receivedMessage', Message)
    })

    socket.on('disconnect', () => {
        for (let index = 1; index < Tokens.length; index++) {
            if (Tokens[index].token === socket.id) {
                console.log(`[IO] => Desconnection(${Tokens[index].src} -> ${socket.id})`)
                Tokens.splice(index, 1)
            }
        }
    })

});


server.listen(SERVER_PORT, () => {
    console.log(`[SERVER] => host http://localhost:${SERVER_PORT}`)
})