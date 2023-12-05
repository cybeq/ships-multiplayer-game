<script>
import {Board} from "@/models/Board";

export default{
  props:{
    gameKey:undefined,
    socket:undefined,
    player:undefined,
    payload:undefined,

  },
  data(){
    return{
      board:new Board(),
      mode:'arrange',
      opponentReady:false,
      selected:[],
      shooted:[],
      missed:[],

      drunk:[],
      jail:[]
    }
  },
  mounted(){
      this.socketHandler()
  },
  methods:{
    socketHandler(){
      this.socket.on('coordinateSet', (params)=>{
        if(params.success){
          this.board.ships.pop()
          if(this.board.ships.length<1){
            this.mode = 'ready'
            this.socket.emit('iAmReady', {
              key:this.gameKey,
              player:this.player,
            })
          }
        }
      })
      this.socket.on('playerReady', params=>{
        console.log('player ready', params)
        this.opponentReady = true;
      })
      this.socket.on('showBoards',params=>{
        this.mode = 'play'
        this.opponentReady = false;
        this.selected.forEach(s=>s.classList.remove('black'))
      })
      this.socket.on('miss', params=>{
        console.log('miss', params)
        const el = document.getElementById(params.z)
        console.log('missed el', el)
        if(!el){
          console.error('no field on document, OMG :D')
        }
        el.classList.add('grey')
        this.missed.push({
          params,
          el
        } )
      })
      this.socket.on('niceShot', params=>{
        console.log('params nice shot', params)

        const el = document.getElementById(params.z)
        console.log('shooted el', el)
        if(!el){
          console.error('no field on document, OMG :D')
        }
        el.classList.add('red')
        this.shooted.push({
          params,
          el
        } )
        console.log('niceShot', this.shooted)
      })
      this.socket.on('finish', params=>{
        console.log('game finished', params)
        if(params.looser === this.player.id){
          alert('You lost')
        }else{
          alert('You won')
        }
        location.reload()
      })
      this.socket.on('drunk', params=>{
        console.log('your ship is dead', params)
        const el = document.getElementById(`owned-${params.z}`)
        if(!el){
          console.error('no field on document, OMG :D')
        }
        el.classList.add('red')
        this.drunk.push({
          params,
          el
        } )
        console.log('drunk', this.drunk)
      })

      this.socket.on('jail', params=>{
        console.log('your opponent had a miss', params)
        const el = document.getElementById(`owned-${params.z}`)
        if(!el){
          console.error('no field on document, OMG :D')
        }
        el.classList.add('grey')
        this.jail.push({
          params,
          el
        } )
        console.log('jail', this.jail)
      })
    },
    onFieldMouseEnter(event, field){
      switch(this.mode){
        case 'arrange':
          event.target.style.background='#f0f0f0'
          break;
        case 'play':
          event.target.style.background='#b41e1e'
        break;
      }
    },
    onFieldMouseLeave(event, field){
      switch(this.mode){
        default:
          event.target.style.background='#fff'
          break;
      }
    },
    onFieldClick(event, field){
      switch(this.mode){
        case 'arrange':
          this.socket.emit('setShipCoordinates', {
            key:this.gameKey,
            z:field,
            x:field[0],
            y:field.substring(1)
          })
          event.target.classList.add('black')
          this.selected.push(event.target)
          break;

        case 'play':
          this.socket.emit('shot', {
            key:this.gameKey,
            z:field,
            x:field[0],
            y:field.substring(1)
          })
          break;
      }
    }
  }
}
</script>

<template>
  <h3 style="margin-bottom:80px;">{{payload.pending}} <span style="color:#c0143c;">⚔</span> {{payload.asking}}</h3>
  <div v-if="this.mode === 'ready'">
    <h3 style="color:red; margin-bottom:30px;">READY!</h3>
    <p class="nomargin">waiting...</p>
  </div>
  <div v-if="this.opponentReady">
    <h3 style="color:red; margin-bottom:80px;">Your Opponent is READY!</h3>
  </div>
  <section class="board-container" style="margin-top:-180px;">
    <div style="display: grid;grid-template-columns: 1fr 1fr">
      <main class="board">
      <div v-for="field in this.board.fields.z"
           :key="field"
           class="field"
           @mouseenter="onFieldMouseEnter($event, field)"
           @mouseleave="onFieldMouseLeave($event, field)"
           @click="onFieldClick($event,field)"
           :id="field"
      ></div>
      </main>
      <main style=" text-align:right;">
        <div v-if="this.mode === 'arrange'">
          <h1>Twoje statki</h1>
          <p class="nomargin">Ulokuj wszystkie statki klikając na pola</p>
          <p class="nomargin">Twoja gotowść zostanie zgłoszona!</p>
          <p class="nomargin">AHOJ!</p>
          <div style="display: flex; justify-content: flex-end; gap:3px;">
            <div v-for="field in this.board.ships"
                 :key="field"
                 class="field smaller"
            ></div>
          </div>
        </div>
        <div v-if="this.mode === 'play'">
          <h1>Spróbuj trafić wroga</h1>
          <p class="nomargin">Wygrywa ten kto ustrzeli najwiecej</p>
          <p class="nomargin">POWODZENIA!</p>
          <div style="display: flex; justify-content: flex-end; gap:3px;">
            <div v-for="field in this.board.ships"
                 :key="field"
                 class="field smaller"
            ></div>
          </div>
          <h1>Twoja siatka</h1>
          <div style="display:flex; justify-content: right">
          <main class="board">
            <div v-for="field in this.board.fields.z"
                 :key="field"
                 class="field"
                 style="width:12px; height:15px;"
                 :id="`owned-${field}`"
            ></div>
          </main>
          </div>
        </div>
      </main>
    </div>
  </section>
</template>

<style>
.board-container{
  width:100vw;
  height:100vh;
  display:flex;
  justify-content: center;
  align-items: center;
}
.board{
  display:grid;
  width:fit-content;
  grid-template-columns: repeat(9,1fr);

}
.field{
  background:#fff;
  width:35px;
  height:35px;
  border:solid 1px #646464;
}
.field.smaller{
  width:25px;
  height:25px;
  background:#646464;
}
.nomargin{
  margin:0;
  padding:0;
  font-size:0.9em;
}
.black{
  background:#646464!important;
}
.red{
  background:red!important;
}
.grey{
  background:#00000020!important;
}
</style>