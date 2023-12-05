const player = null;
const x = null;
const y = null;
const z = null;
const alive = true;
export class Board {
    fields = {
        x: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        y: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
        z: []
    }
    ships = [];

    constructor() {
        this.fields.y.forEach(y => {
            this.fields.x.forEach(x => {
                this.fields.z.push(`${y}${x}`)
            })
        })
        for (let id = 1; id < 9; id++) {
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
}