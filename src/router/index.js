import { createRouter, createWebHistory } from 'vue-router'
import WaitingRoom from "@/views/WaitingRoom.vue";
import GameRoom from "@/views/GameRoom.vue";

const routes = [
  {
    path: '/',
    name: 'home',
    component: WaitingRoom,
    children:[
      {
        path:'game/:key',
        name:'game',
        component:GameRoom
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
