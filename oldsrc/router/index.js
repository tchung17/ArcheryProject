import Vue from 'vue'
import VueRouter from 'vue-router'
import Landing from '../views/Landing.vue'
import Login from '../views/Login.vue'
import PlayFriend from '../views/PlayFriend.vue'
import PlayRandoms from '../views/PlayRandoms'
import SetWaiting from '../views/SetWaiting'
import Game from '../views/Game'
import WinLose from '../views/WinLose.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/landing/friend',
    name: 'PlayFriend',
    component: PlayFriend,
  },
  {
    path: '/landing/randoms',
    name: 'PlayRandoms',
    component: PlayRandoms,
  },
  {
    path: '/setwaiting',
    name: 'SetWaiting',
    component: SetWaiting,
  },
  {
    path: '/game',
    name: 'Game',
    component: Game,
  },
  {
    path: '/landing',
    name: 'Landing',
    component: Landing,
  },
  {
    path: '/game/end',
    name: 'WinLose',
    component: WinLose,
  },
  
]

const router = new VueRouter({
  mode: 'history',
  routes
})


export default router