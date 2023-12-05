<script>
import {Board} from "@/models/Board";
import GameRoom from "@/views/GameRoom.vue";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import { io } from 'socket.io-client';
import PopupMsg from "@/components/PopupMsg.vue";
import alertE from "@/views/alertE";
export default{
  components: {PopupMsg, GameRoom, AgGridVue},
  data(){
    return{
      socketData:{
        URL:"http://localhost:3000"
      },
      player:{
        id:null,
      },
      gameKey:null,
      payload:null,
      socket:undefined,
      players:[],
      grid:{
        api:undefined,
        data:[
          {
            id:"3123"
          }
        ],
        columns:[
          {
            headerName:'PLAYER_ID',
            field:'id',
            flex:1,
            headerClass: 'ag-right-aligned-header',
            cellStyle:params=>{
              return{
                textAlign:'right'
              }
            }
          },
          {
            headerName:'Status',
            field:'status',
            flex:1,
            cellStyle:params=>{
              return{
                textAlign:'left',
                color: params.data.inGame ? 'red' : 'darkgreen'
              }
            },
            valueGetter:params=>{
              console.log('player.id',params.data)
              return `${params.data.inGame ? 'IN GAME': 'FREE'}`
            }
          },
          {
            headerName:'Play',
            field:'play',
            flex:1,
            cellStyle:params=>{
              return{
                textAlign:'left',
                border:'solid 1px #00000020',
                background:'#00000020',
                cursor:'pointer'
              }
            },
            valueGetter:params=>{
             return "🕹"
            }
          }
        ],
        options:{
            onGridReady: params =>{
              this.grid.api = params.api;
              this.grid?.api?.setRowData(this.grid.data)
            }


        }
      },
      popup:null
    }
  },
  mounted() {
    new Board()
    this.socketHandler()
  },
  methods:{
    socketHandler(){
      this.socket = io(this.socketData.URL, {
        transports: ['websocket'],
      });
      this.socket.on("connect", (params) => {
        console.log('connected with websocket', params)
      });
      this.socket.on('askRival', (params)=>{
        console.log('ask rival event', params)
        if(params.pending === this.player.id){
          console.log('you were chosen to play. Do you admit?')
          this.popup = {
            message:`Zaproszenie do gry od ${params.asking}`,
            button1:{
              command:()=>{
                console.log('dolacz')
                this.socket.emit('acceptRival', params)
                this.popup = null
              },
              label:'Dolacz',
              background:"#7fbb9d"
            },
            button2:{
              command:()=>{
                this.popup = null;
              },
              label:'Wole piwo',
              background:"#bb7f9d"
            }
          }
        }
      })
      this.socket.on('error', (params)=>{
        console.error(params)
      })
      this.socket.on('startGame', (params)=>{
        console.log(params)
      })

      this.socket.on('setOnline', (params)=>{
        console.log('setonline', params)
        if(this.grid.api) {
          this.grid.api.setRowData(params)
        }
      })
      this.socket.on('setPlayerId', (params)=>{
        this.player.id = params
      })
      this.socket.on('acceptRival', (params)=>{
        console.log('acceptRival', params)
      })
      this.socket.on('startGame', (params)=>{
        console.log('startGame', params)
        if(params.pending !== this.player.id && params.asking !== this.player.id){
          return;
        }
        if(params.key){
          this.payload = params
          this.gameKey = params.key
          console.log('game key has been set', this.gameKey)
          window.scrollTo(0, 0);
        }

      })
      this.socket.on('abortGame', playerId=>{
        console.log('abortGame', playerId)
        if(this.payload?.asking === playerId ||this.payload?.pending === playerId ){
          this.socket.emit('outGame', {playerId, key:this.gameKey})
          location.reload()

        }
      })
    },
    cellClicked(params){
      switch(params.colDef.field){
        case "play":
          if(this.gameKey){
            alertE('Yo have open game session')

            return;
          }
          if(this.player.id === params.data.id){
            alertE('You cannot play with yourself. Find an oppenent and try again')
            return;
          }
          if(params.data.inGame){
            alertE("You need to wait for that player...")
            return;
          }
          console.log(this.player.id + '__ wants to play with __' + params.data.id)
          console.log('sending socket to rival....')

          this.socket.emit('askRival', {
            asking: this.player.id,
            pending: params.data.id
          })

          break;
      }
    }
  }
}
</script>

<template>
  <popup-msg v-if="popup" :message="popup.message" :button1="popup.button1" :button2="popup.button2"></popup-msg>
  <img src="@/assets/herb.png" style="width:200px; border-radius:90%">
  <section  v-if="this.gameKey">
    <game-room :gameKey="this.gameKey" :socket="socket" :player="player" :payload="payload"></game-room>
  </section>
  <section class="players" style="height:50px;">
  <div>
    <ag-grid-vue
        class="ag-theme-alpine"
        :columnDefs="grid.columns"
        style="height:700px;"
        :pagination="true"
        :paginationPageSize="30"
        :rowMultiSelectWithClick="true"
        :grid-options="this.grid.options"
        @cellClicked="cellClicked"
    >
    </ag-grid-vue>
  </div>
  </section>


</template>

<style>

</style>