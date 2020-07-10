import Vue from 'vue'
import Vuex from 'vuex'
import db from '../firebase/init'
import VuexPersist from 'vuex-persist'
import help from './test'

const vuexPersist = new VuexPersist({
	key: 'my-app',
	storage: window.sessionStorage,
})
Vue.use(Vuex)
export default new Vuex.Store({
	plugins: [vuexPersist.plugin],
	state: {
		playerID: 'johnny',
		meta: {
            turn: 1,
            p1arrows: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            p2arrows: [-2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2],
            setNumber: 1,
            p1score: 0,
            p2score: 0,
            ready: 1,
        },
		winner: 0,
		whichPlayer: 2,
		yourTurn: 0,
		sessionID: '',
		listener: null,
	},
	getters: {
		getPlayerID: state => {
			return state.playerID
		},
		getReady: state => {
			return state.meta.ready
		},
		getWhichPlayer: state => {
			return state.whichPlayer
		},
		getWinner: state => {
			return state.winner
		},
		getSessionID: state => {
			return state.sessionID
		},
		getListener: state => {
			return state.listener
		},
		getSetNumber: state => {
			return state.meta.setNumber
		},
		getYourTurn: state => {
			return state.yourTurn
		},
		getMeta: state => {
			return state.meta
		},
	},
	mutations: {
        setMeta(state, payload) {
            console.log("from meta @ ready changed to " + payload.ready)
			state.meta = payload
        },
        switchTurn(state) {
            if (state.meta.turn === 1) {
                state.meta.turn = 2
            } else if (state.meta.turn === 2) {
                state.meta.turn = 1
            }
        },
		setWinner(state, payload) {
			state.winner = payload
		},
		setListener(state, payload) {
			state.listener = payload
		},
		setReady(state, payload) {
			state.meta.ready = payload
		},
		setSessionID(state, payload) {
			state.sessionID = payload
		},
		setWhichPlayer(state, payload) {
			state.whichPlayer = payload
		},
		setYourTurn(state, payload) {
			state.yourTurn = payload == state.whichPlayer
		},
	},
	actions: {
		//resets state except for your playerID
        wipeState({ commit, state }) {
            const initialMeta = {
                turn: 1,
                p1arrows: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                p2arrows: [-2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2],
                setNumber: 1,
                p1score: 0,
                p2score: 0,
                ready: 1,
            }
            if (state.listener) {
				state.listener()
				state.listener = null
            }
            console.log("from wipe @ ready changed to " + initialMeta.ready)
			state.meta = initialMeta
			state.winner = 0
			state.whichPlayer = 2
			state.yourTurn = 0
			state.sessionID = ''
			
		},
		setWinner({commit}, payload) {
			commit('setWinner', payload)
		},
		readyUp({commit, state}) {
			return new Promise((resolve, reject) => {
				let meta = state.meta
				if (meta.ready == 0) {
					meta.ready = 1
				} else {
					meta.ready = 0
				}
				db.collection('sessions')
					.doc(state.sessionID)
					.set({meta: JSON.stringify(meta)}, {merge: true})
					.then(() => {
						resolve()
					})
			})
		},
		createSession({commit, state, dispatch}) {
			return new Promise(
                (resolve, reject) => {
                    const initialMeta = {
                        turn: 1,
                        p1arrows: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                        p2arrows: [-2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2],
                        setNumber: 1,
                        p1score: 0,
                        p2score: 0,
                        ready: 1,
                    }
					db.collection('sessions')
						.add({
							completed: false,
							matchwinner: -1,
							p1ID: state.playerID,
							meta: JSON.stringify(initialMeta),
						})
						.then(async doc => {
							commit('setSessionID', doc.id)
							commit('setWhichPlayer', 1)
                            await dispatch('startListener')
                            resolve()
						})
				}
			)
		},
		joinSession({commit, state, dispatch}, payload) {
			return new Promise(
				(resolve, reject) => {
					db.collection('sessions')
						.doc(payload)
						.set(
							{
								p2ID: state.playerID,
							},
							{
								merge: true,
							}
						)
						.then(async () => {
							commit('setSessionID', payload)
                            await dispatch('startListener')
                            resolve()
						})
				}
			)
		},
		startListener({commit, state}) {
			return new Promise((resolve, reject) => {
				if (state.listener) {
					console.log('listener cleared')
					state.listener()
                }
                if (!state.sessionID) {
                    console.log('listener prevented')
                    resolve()
                }
				state.listener = db
					.collection('sessions')
					.doc(state.sessionID)
					.onSnapshot(doc => {
						let meta = JSON.parse(doc.data().meta)
						commit('setMeta', meta)
						commit('setYourTurn', meta.turn)
					})
				console.log('listener init @ ' + state.sessionID)
				resolve()
			})
		},
		submitArrow({commit, state, dispatch}, payload) {
			return new Promise(async (resolve, reject) => {
				if (!state.listener) {
					await dispatch('startListener')
                }
				commit("switchTurn")
				let index1 = state.meta.p1arrows.indexOf(-1)
				let index2 = state.meta.p2arrows.indexOf(-2)
				if (state.whichPlayer == 1) {
					state.meta.p1arrows[index1] = payload 
				} else if (state.whichPlayer == 2) {
					state.meta.p2arrows[index2] = payload
				}
				if (help.isSetCompleted(state.meta.p1arrows, state.meta.p2arrows)) {
					state.meta.setNumber += 1
                    let winner = help.getSetWinner(state.meta.p1arrows, state.meta.p2arrows)
					if (winner == 1) {
						state.meta.p1score += 2
					} else if (winner == 2) {
						state.meta.p2score += 2
					} else if (winner == 3) {
						state.meta.p1score += 1
						state.meta.p2score += 1
					}
                    state.meta.turn = state.meta.p1score > state.meta.p2score ? 2 : 1
                }
                await db.collection('sessions')
					.doc(state.sessionID)
					.set({meta: JSON.stringify(state.meta)}, {merge: true})
				// db.collection('sessions')
				// 	.doc(state.sessionID)
				// 	.set({meta: JSON.stringify(state.meta)}, {merge: true})
				// 	.then(() => {
				// 		resolve()
				// 	})
			})
		},
	},
})
