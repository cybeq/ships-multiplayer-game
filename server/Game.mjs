import {Board} from "./Board.mjs";

export class Game {
    _key = undefined;
    status = 'created';
    io = undefined;
    socket = undefined;
    serverBox = undefined;
    players = [
        {
            board: new Board(),
            id: undefined,
            ready:false,
        },
        {
            board: new Board(),
            id:undefined,
            ready:false,
        }
    ]
    constructor(io, socket, challenge, key, serverBox) {
        this.socketHandler()
        this.io = io;
        this.socket = socket;
        this._key = key;
        this.players[0].id = challenge.asking
        this.players[1].id = challenge.pending
        this.status = 'hashing'
        this.serverBox = serverBox;
    }
    getKey(){
        return this._key
    }
    socketHandler(){
        //
    }
    setShipCoordinates(playerId,x,y,z){
        const player = this.players.find(p=>p.id === playerId)
        if(!player){
            this.socket.emit('error', 'no player')
            return;
        }
        console.log('player', player)
        try{
            player.board.setShipCoordinates(x,y,z)
            this.io.to(playerId).emit('coordinateSet', {message: 'COORDINATES HAS BEEN SET', x,y,z, success:true})
        }catch(e){
            this.io.to(playerId).emit('error', e.message)
        }
    }
    setPlayerReady(playerId){
        const player = this.players.find(p=>p.id === playerId)
        if(!player){
            this.socket.emit('error', 'no player')
            return;
        }
        player.ready = true;
        const opponent = this.players.find(p=>p.id !== playerId)
        this.io.to(opponent.id).emit('playerReady', {
            player:player.id
        })
        if(this.players.filter(p=>p.ready === true).length>1){
            console.log('wszyscy gotowi na co czekamy')
            console.log(this.players)
            this.io.emit('showBoards', this.players)
        }
    }



}
