const player = null;
const x = null;
const y = null;
const z = null;
const alive = true;
export class Board{
    fields = {
        x:['1', '2', '3', '4','5','6','7','8','9'],
        y:['a','b','c','d','e','f','g','h','i','j'],
        z:[]
    }
    ships = [];
    constructor() {
        this.fields.y.forEach(y=>{
            this.fields.x.forEach(x=>{
                this.fields.z.push(`${y}${x}`)
            })
        })
        for(let id=1; id<9; id++){
            this.ships.push({
                id,
                z,
                x,
                y,
                alive
            })
        }
        // console.log(this.fields, 'fields')
        // console.log(this.ships, 'ships')
    }
    shipHasCoordinates(ship){
        return ship.x  && ship.y && ship.z
    }
    getFreeShips(){
        return this.ships.filter(s=>{
            return !this.shipHasCoordinates(s)
        })
    }
    getAllShips(){
        return this.ships;
    }
    getHuntingShips(){
        return this.ships.filter(s=>{
            return s.alive && this.shipHasCoordinates(s)
        })
    }
    getDeadShips(){
        return this.ships.filter(s=> !s.alive)
    }
    setShipCoordinates(x,y,z){
        const lockedSpace = this.ships.find(s=> s.x === x && s.y === y || s.z === z)
        if(lockedSpace){
            throw new Error("Locked space")
        }
        if(this.ships.filter(s=> !this.shipHasCoordinates(s)).length<1){
            throw new Error("No ships left")
        }
        const ship = this.ships.find(s=> !this.shipHasCoordinates(s))
        ship.x = x;
        ship.y = y;
        ship.z = z;

    }
    killShip(x,y,z){
        const ship = this.ships.find(s=> s.z === z || (s.y === y && s.x === x))
        ship.alive = false;
    }

}