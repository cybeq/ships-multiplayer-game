<script>
import {Board} from "@/models/Board";
import alertE from "@/views/alertE";

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
            alertE('Waiting for player move', true)
            this.socket.emit('iAmReady', {
              key:this.gameKey,
              player:this.player,
            })
          }
        }
      })
      this.socket.on('playerReady', params=>{
        this.opponentReady = true;
      })
      this.socket.on('showBoards',params=>{
        this.mode = 'play'
        this.opponentReady = false;
        this.selected.forEach(s=>s.classList.remove('black'))
        console.log('selected', this.selected)
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
        alertE("You missed", true)
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
        alertE("NICE SHOT!", )
        console.log('niceShot', this.shooted)
      })
      this.socket.on('finish', params=>{
        console.log('game finished', params)
        if(params.looser === this.player.id){
          alertE('You lost')
          alert('You lost')
        }else{
          alertE('You won')
          alert('You won')
        }
        setTimeout(()=>{ location.reload()},1500)
      })
      this.socket.on('drunk', params=>{
        console.log('your ship is dead', params)
        const el = document.getElementById(`owned-${params.z}`)
        if(!el){
          console.error('no field on document, OMG :D')
        }
        alertE("Your ships has been shot", true)
        el.classList.add('red')
        this.drunk.push({
          params,
          el
        } )
      })

      this.socket.on('jail', params=>{
        console.log('your opponent missed', params)
        const el = document.getElementById(`owned-${params.z}`)
        if(!el){
          console.error('no field on document, OMG :D')
        }
        el.classList.add('grey')
        this.jail.push({
          params,
          el
        } )
        alertE('Your opponent missed', true)
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
  <div>
  <h3 style="margin-bottom:80px;">{{payload.pending}} <span style="color:#c0143c;">⚔</span> {{payload.asking}}</h3>
  </div>
  <div v-if="this.opponentReady" style="height:120px">

  </div>
  <section class="board-container" style="height:450px;" >
    <div class="div" >
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
        <div v-if="this.mode === 'ready'">
          <h1>Oczekiwanie</h1>
          <p class="nomargin">Poczekaj na przeciwnika....</p>
        </div>
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
                 :style="`width:12px; height:15px; ${this.selected.find(s=>s.id === field) ? 'background:linear-gradient(275deg, rgba(9,33,121,1) 15%, rgba(12,136,158,1) 100%);' :'' }`"
                 :id="`owned-${field}`"
            ></div>
          </main>
          </div>
        </div>
      </main>
    </div>
    </div>
  </section>
</template>

<style>
.board-container{
  width:100vw;
  height:100vh;
  .div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.board{
  display:grid;
  grid-gap:2px;
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