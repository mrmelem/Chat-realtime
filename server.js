const { Console } = require('console');
const express = require('express');
const { access } = require('fs');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });
const SERVER_PORT = 5000;
const Msg = require('./src/models/msg')
const User = require('./src/models/user')

app.use(express.json());

const UsersOn = []
const AdmsOn = []

io.on('connection', socket => {
    socket.on('auth', async (data) => {
        const ref = data.tAPIac
        var Access = await User.findOne({ where: { ref: ref } })
        if (Access === null) {
            var NewMessage = await Msg.findOne({ where: { ref: 'authenticate' } })
            socket.emit('registration', NewMessage.content)
        } else {
            let user = {
                username: Access['username'],
                socket: socket.id,
                src: data.src,
                ref: data.tAPIac
            }
            if (data.src == "client") {
                UsersOn.push(user)
            } else {
                AdmsOn.push(user)
            }
            var Messages = await Msg.findAll({ where: { ref: user.ref } })
            socket.emit('previous', Messages)
        }
    })

    socket.on('registration', data => {
        User.create({ username: data.username, ref: data.tAPIac })
        let user = {
            username: data.username,
            socket: socket.id,
            src: data.src,
            ref: data.tAPIac
        }
        UsersOn.push(user)
        console.log('[IO] Usuário cadastrado com sucesso!')
    })

    socket.on('msg_client_from_admin', data => {
        Msg.create({
            ref: data.tAPIac,
            path: data.path,
            content: data.message
        })
        let target = broadcastAdmn()
        io.to(target).emit('newMessage', data)
    })

    socket.on('msg_admin_from_client', data => {
        Msg.create({
            ref: data.from,
            path: data.path,
            content: data.message,
            from: data.tAPIac
        })
        for (let index = 0; index < UsersOn.length; index++) {
            if (data.from === UsersOn[index].ref) {
                io.to(UsersOn[index].socket).emit('newMessage', data)
            }
        }
    })

    socket.on('pmsg', async data => {
        var message = await Msg.findAll({ where: { ref: data } })
        socket.emit('previous-adm', message)
    })

    socket.on('disconnect', () => {
        for (let index = 0; index < UsersOn.length; index++) {
            if (UsersOn[index].socket === socket.id) {
                console.log(`[IO] => Disconnected ${UsersOn[index].src} -> ${socket.id}`)
                UsersOn.splice(index, 1)
            }
        }
        for (let index = 0; index < AdmsOn.length; index++) {
            if (AdmsOn[index].socket === socket.id) {
                console.log(`[IO] => Disconnected ${AdmsOn[index].src} -> ${socket.id}`)
                AdmsOn.splice(index, 1)
            }
        }
    })

    broadcastAdmn = () => {
        let socket = []
        AdmsOn.forEach(element => {
            socket.push(element.socket)
        });
        return socket
    }
});

server.listen(SERVER_PORT, () => { console.log(`[Server] host http://localhost:${SERVER_PORT}`) })


