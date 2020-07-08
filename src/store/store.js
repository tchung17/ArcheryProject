import Vue from "vue";
import Vuex from "vuex";
import db from "../firebase/init";
import VuexPersist from 'vuex-persist'
const vuexPersist = new VuexPersist({
    key: 'my-app',
    storage: window.sessionStorage
  })
Vue.use(Vuex);
let initialMeta = {
    turn: 1,
    p1arrows: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    p2arrows: [-2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2],
    setNumber: 1,
    p1score: 0,
    p2score: 0,
    ready: 0,
};
export default new Vuex.Store({
    plugins: [vuexPersist.plugin],
    state: {
        playerID: "johnny",
        meta: initialMeta,
        winner: 0,
        whichPlayer: 2,
        yourTurn: 0,
        sessionID: "",
        listener: null,
    },
    getters: {
        getPlayerID: (state) => {
            return state.playerID;
        },
        getReady: (state) => {
            return state.meta.ready;
        },
        getWhichPlayer: (state) => {
            return state.whichPlayer;
        },
        getWinner: (state) => {
            return state.winner;
        },
        getSessionID: (state) => {
            return state.sessionID;
        },
        getListener: (state) => {
            return state.listener;
        },
        getSetNumber: (state) => {
            return state.meta.setNumber;
        },
        getYourTurn: (state) => {
            return state.yourTurn;
        },
        getMeta: (state) => {
            return state.meta;
        },
    },
    mutations: {
        setMeta(state, payload) {
            state.meta = payload;
        },
        setWinner(state, payload) {
            state.winner = payload;
        },
        setListener(state, payload) {
            state.listener = payload;
        },
        setReady(state, payload) {
            state.meta.ready = payload;
        },
        setSessionID(state, payload) {
            state.sessionID = payload;
        },
        setWhichPlayer(state, payload) {
            state.whichPlayer = payload;
        },
        setYourTurn(state, payload) {
            state.yourTurn = payload == state.whichPlayer;
        },
    },
    actions: {
        setWinner({ commit }, payload) {
            commit("setWinner", payload)
        },
        readyUp({ commit, state }) {
            let meta = state.meta;
            if (meta.ready == 0) {
                meta.ready = 1;
            } else {
                meta.ready = 0;
            }
            db.collection("sessions")
                .doc(state.sessionID)
                .set({ meta: JSON.stringify(meta) }, { merge: true })
                .then()
                .catch((err) => {
                    console.log(err);
                });
        },
        createSession({ commit, state, dispatch }) {
            db.collection("sessions")
                .add({
                    completed: false,
                    matchwinner: -1,
                    p1ID: state.playerID,
                    meta: JSON.stringify(state.meta),
                })
                .then((doc) => {
                    state.listener = db
                        .collection("sessions")
                        .doc(doc.id)
                        .onSnapshot((doc) => {
                            let meta = JSON.parse(doc.data().meta);
                            commit("setMeta", meta);
                            commit("setYourTurn", meta.turn);
                        });
                    return doc;
                })
                .then((doc) => {
                    commit("setSessionID", doc.id);
                    commit("setWhichPlayer", 1);
                });
        },
        joinSession({ commit, state, dispatch }, payload) {
            db.collection("sessions")
                .doc(payload)
                .set(
                    {
                        p2ID: state.playerID,
                    },
                    {
                        merge: true,
                    }
                )
                .then(() => {
                    commit("setSessionID", payload);
                    state.listener = db
                        .collection("sessions")
                        .doc(state.sessionID)
                        .onSnapshot((doc) => {
                            let meta = JSON.parse(doc.data().meta);
                            commit("setMeta", meta);
                            commit("setYourTurn", meta.turn);
                        });
                })
                .then(() => {
                    setTimeout(() => {
                        dispatch("readyUp", payload);
                    }, 1000);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        startListener({ commit, state }) {
            if (state.listener) {
                state.listener();
            }
            state.listener = db
                .collection("sessions")
                .doc(state.sessionID)
                .onSnapshot((doc) => {
                    let meta = JSON.parse(doc.data().meta);
                    commit("setMeta", meta);
                    console.log(meta.turn);
                    commit("setYourTurn", meta.turn);
                });
        },
        submitArrow({ commit, state, dispatch }, payload) {
            if (!state.listener) {
                dispatch("startListener")
            }
            let index1 = state.meta.p1arrows.indexOf(-1); //index 3, 4th arrow
            let index2 = state.meta.p2arrows.indexOf(-2);
            if (state.whichPlayer == 1) {
                state.meta.p1arrows[index1] = payload; //insert into meta
            } else if (state.whichPlayer == 2) {
                state.meta.p2arrows[index2] = payload;
            }
            let indices = (state.meta.setNumber - 1) * 3; //determine which indices to check based on which set it is
            let p1Set = state.meta.p1arrows.slice(indices, indices + 3);
            let p2Set = state.meta.p2arrows.slice(indices, indices + 3);
            let p1SetDone = state.meta.p1arrows
                .slice(indices, indices + 3)
                .indexOf(-1);
            let p2SetDone = state.meta.p2arrows
                .slice(indices, indices + 3)
                .indexOf(-2);
            //switch turn
            if (state.meta.turn === 1) {
                state.meta.turn = 2;
            } else if (state.meta.turn === 2) {
                state.meta.turn = 1;
            }
            //sets are both done, udpate scores, adjust turn as necessary
            if (p1SetDone === -1 && p2SetDone === -1) {
                state.meta.setNumber += 1
                let p1SetScore = state.meta.p1arrows
                    .slice(indices, indices + 3)
                    .reduce((score, arrow) => score + arrow, 0);
                let p2SetScore = state.meta.p2arrows
                    .slice(indices, indices + 3)
                    .reduce((score, arrow) => score + arrow, 0);
            
                if (p1SetScore > p2SetScore) {
                    // if p1 win
                    state.meta.p1score += 2;
                } else if (p1SetScore < p2SetScore) {
                    //if p2 win
                    state.meta.p2score += 2;
                } else if (p1SetScore === p2SetScore) {
                    //if tie
                    state.meta.p1score += 1;
                    state.meta.p2score += 1;
                }
                //check match winner
                if (state.meta.p1score === 5 && state.meta.p2score === 5) {
                    //TODO
                } else if (state.meta.p1score > state.meta.p2score) {
                    //adjust turn based on lead
                    state.meta.turn = 2
                } else if (state.meta.p1score > state.meta.p2score) {
                    state.meta.turn = 1
                }
            }
            //submit to database to synchronize with both players
            let metaToString = JSON.stringify(state.meta);
            db.collection("sessions")
                .doc(state.sessionID)
                .set({ meta: metaToString }, { merge: true });
        },
    },
});
