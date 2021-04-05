const express = require('express');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });
const SERVER_PORT = 5000;

const Msg = require('./src/models/messages')



require('./src/database');


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


var Tokens = []
var Message = {}


io.on('connection', socket => {

    socket.on('auth', data => {
        var user = {
            token: socket.id,
            src: data.src,
            tAPIac: data.tAPIac
        }
        Tokens.push(user)
        console.log(`[IO] => New Connection(${data.src} -> ${socket.id})`)
        if (getUser(data.tAPIac)) {
            console.log("Usuário existente")
        }else{
            console.log("Novo")
        }
    })

    socket.on('msg_client_from_admin', msg => {
        const message = new Msg(
            {
                ref: msg.tAPIac,
                username: msg.id,
                messages: {
                    msg: {
                        ref: 'clientToAdmin',
                        content: msg.message
                    }
                }
            }
        )
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

const getUser = (ref) => {
    return Msg.findOne({ ref: ref })
}


server.listen(SERVER_PORT, () => {
    console.log(`[SERVER] => host http://localhost:${SERVER_PORT}`)
})