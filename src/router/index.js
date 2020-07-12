import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import ShootOff from "../views/ShootOff"
import PlayFriend from "../views/PlayFriend.vue";
import SetWaiting from "../views/SetWaiting.vue";
import Game from "../views/Game.vue";
import WinLose from "../views/WinLose.vue";
import store from '../store/store.js';
Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        redirect: '/landing/friend'
    },
    {
        path: "/landing/friend",
        name: "PlayFriend",
        component: PlayFriend,
    },
    {
        path: "/game/shootoff",
        name: "ShootOff",
        component: ShootOff
    },
    {
        path: "/setwaiting",
        name: "SetWaiting",
        component: SetWaiting,
        beforeEnter: (to, from, next) => {
            if (!!store.state.sessionID) {
                next()
            } else {
                next('/landing/friend')
            }
        }
    },
    {
        path: "/game",
        name: "Game",
        component: Game,
        beforeEnter: (to, from, next) => {
            if (!!store.state.sessionID) {
                next()
            } else {
                next('/landing/friend')
            }
        }
    },
    {
        path: "/game/end",
        name: "WinLose",
        component: WinLose,
        beforeEnter: (to, from, next) => {
            if (!!store.state.sessionID) {
                next()
            } else {
                next('/landing/friend')
            }
        }
    },
];

const router = new VueRouter({
    routes,
});

router.beforeEach(async (to, from, next) => {
    store.dispatch("startListener") //has built in !sessionID rejection
    next()
})
export default router;
