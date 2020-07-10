import Vue from "vue";
import VueRouter from "vue-router";
import Landing from "../views/Landing.vue";
import Login from "../views/Login.vue";
import PlayFriend from "../views/PlayFriend.vue";
import PlayRandoms from "../views/PlayRandoms.vue";
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
        path: "/landing/randoms",
        name: "PlayRandoms",
        component: PlayRandoms,
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
        path: "/landing",
        name: "Landing",
        component: Landing,
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
    mode: "history",
    routes,
});

export default router;
