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
            this.io.emit('showBoards', this.players)
        }
    }
    shot(playerId, x,y,z){
        const opponent = this.players.find(p=>p.id !== playerId)
        if(!opponent){
            this.io.to(playerId).emit('error', 'NO OPPONENT / ERROR DATA')
            return;
        }
        const opponentBoard = opponent.board;
        if(!opponentBoard){
            this.io.to(playerId).emit('error', 'NO OPPONENT BOARD / ERROR DATA')
            return;
        }
        const goal = opponentBoard.ships.find(ship=> ship.z === z && ship.alive || (ship.x === x && ship.y ===y && ship.alive))
        if(!goal){
            this.io.to(playerId).emit('miss', {x,y,z})
            this.io.to(opponent.id).emit('jail', {x,y,z})
            return;
        }
        goal.alive = false;
        this.io.to(playerId).emit('niceShot', {x, y, z})
        this.io.to(opponent.id).emit('drunk', {x,y,z})
        if(!opponentBoard.ships.find(ship=>  ship.alive )){
            this.io.emit('finish', {looser:opponent.id})
        }


    }


}
