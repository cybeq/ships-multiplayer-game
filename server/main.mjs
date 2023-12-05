import express from 'express';
import * as http from "http";

import { Server } from "socket.io";
import {Game} from "./Game.mjs";
import {uuid} from "uuidv4";
import cors from 'cors';

const app = express();
app.use(cors({
    origin: '*',
}));
const server = http.createServer(app);
const io = new Server(server);



const serverBox = {
    onlinePlayers:[],
    games:[],
};


app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
io.on('connection', (socket) => {
    serverBox.onlinePlayers.push({
        id:socket.id
    })
    io.emit('setOnline', serverBox.onlinePlayers)
    socket.emit('setPlayerId', socket.id)
    const sessionBox = {

    };
    console.log('Online players', serverBox.onlinePlayers);

    socket.on('getOnline', ()=>{
        io.emit('setOnline', serverBox.onlinePlayers)
    })

    // challenge w jsonie jest
    socket.on(`askRival`, (params)=>{
        try{
            var challenge = params
            console.log('challenge', challenge)
            if(!challenge.pending || !challenge.asking){
                console.log("INVALID CHALLENGE OBJECT")
                socket.emit("error", "INVALID CHALLENGE OBJECT")
                return;
            }
            io.emit('askRival', params)
        }catch{
            console.log('blad zapytania, niepoprawny format json')
        }
    })

    socket.on('acceptRival', (params)=>{
        try{
            var challenge = params
            var pl = serverBox.onlinePlayers.find(p=>p.id === challenge.asking )
            if(!pl){
                socket.emit("error", "USER HAS ESCAPED")
                return;
            }
            console.log('challenge', challenge)
            if(!challenge.pending || !challenge.asking){
                console.log("INVALID CHALLENGE OBJECT")
                socket.emit("error", "INVALID CHALLENGE OBJECT")
                return;
            }

            const game = (new Game(io, socket, challenge, uuid(), serverBox));
            serverBox.games.push(game);
            challenge.key = game.getKey()

            serverBox.onlinePlayers.filter(p=>p.id === challenge.pending || p.id === challenge.asking).forEach(p=>{
                p.inGame = true;
            })
            io.emit('setOnline', serverBox.onlinePlayers)

            io.emit('startGame', challenge)

        }catch{
            console.log('JSON PARSING ERROR, NOT AN OBJECT')
            socket.emit("error", "JSON PARSING ERROR, NOT AN OBJECT")
        }

    })

    socket.on('message', (message) => {
        console.log(`Received message: ${message}`);
        io.emit('message', `Server: ${message}`);
    });

    socket.on('outGame',params=>{
        var game = serverBox.games.find(g=>g._key === params.key)
        game.players?.forEach(p=>{
            var p = serverBox.onlinePlayers.find(_p=>_p.id === p.id);
            if(p) p.inGame = false;
        })
        console.log(`${params.playerId}___online players`, serverBox.onlinePlayers)
    })

    socket.on('setShipCoordinates', (params)=>{
        try {
            const _params = params
            console.log('games', serverBox.games)
            const game = serverBox.games.find(g=> g._key === _params.key)
            if (!game) {
                io.emit('error', 'NO GAME')
                return;
            }
            if(game.getKey() !== _params.key){
                io.emit('error', 'wrong game key')
                return;
            }
            if(!_params.z || !_params.x || !_params.y){
                io.emit('error', 'wrong / no coordinates')
                return;
            }

            game.setShipCoordinates(socket.id, _params.x, _params.y, _params.z)
        }catch(e){
            io.emit('error', 'ERROR / PARSE ERROR')
        }
    })
    socket.on('shot', params=>{
        const game = serverBox.games.find(g=> g._key === params.key)
        if (!game) {
            io.emit('error', 'NO GAME')
            return;
        }
        if(game.getKey() !== params.key){
            io.emit('error', 'wrong game key')
            return;
        }
        game.shot(socket.id, params.x, params.y, params.z)

    })

    socket.on('iAmReady', (params)=>{
        const game = serverBox.games.find(g=> g._key === params.key)
        if (!game) {
            io.emit('error', 'NO GAME')
            return;
        }
        if(game.getKey() !== params.key){
            io.emit('error', 'wrong game key')
            return;
        }
        game.setPlayerReady(params.player.id)
    })

    socket.on('disconnect', () => {
        serverBox.onlinePlayers = serverBox.onlinePlayers.filter(player=> player.id !== socket.id)
        io.emit('abortGame', socket.id)
        console.log('User disconnected', socket.id);
        console.log('active players', serverBox.onlinePlayers)
        io.emit('setOnline', serverBox.onlinePlayers)
    });

});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
