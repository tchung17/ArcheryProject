<template>
	<div class="container">
		<div class="result" v-if="winner">
			<h1>You won!</h1>
			The score was {{ getMeta.p1score }} to {{ getMeta.p2score }}
		</div>
		<div class="result" v-if="!winner">
			<h1>You lost.</h1>
			The score was {{ getMeta.p1score }} to {{ getMeta.p2score }}
		</div>
        <div class="table" style="width: 80%; margin: 20px;">
            <div class="title" style="text-align: left; margin-left: 30px; font-family: PantonDark">
                Analysis
            </div>
            <el-table
			class="table"
			:data="data"
			style="width: 100%;"
			align="center"
		>
			<el-table-column
				v-for="(column, index) in columns"
				:key="index"
				:prop="column.prop"
				:label="column.label"
			>
			</el-table-column>
		</el-table>
        </div>
	</div>
</template>

<script>
import db from './../firebase/init'
import {mapGetters} from 'vuex'
import MathService from './../services/MathService'
export default {
	data() {
		return {
			isWinner: null,
            data: [],
            columns: [
                {
                    prop: 'name',
                    label: 'player'
                },
                {
                    prop: 'average',
                    label: 'avg'
                }
            ]
		}
	},
	computed: {
		...mapGetters([
			'getWhichPlayer',
			'getMeta',
			'getWinner',
            'getPlayerID',
            'getSessionID',
		]),
		winner: function() {
			return this.isWinner
		},
	},
	methods: {
		async getPlayerNames(sessionID) {
			let playerIDs = await this.getPlayerIDs(sessionID)
            let playerNames = []
			for (let playerID of playerIDs) {
				playerNames.push(await this.getPlayerName(playerID))
			}
			return playerNames
		},
		getPlayerIDs(sessionID) {
			return new Promise((resolve, reject) => {
				db.collection("sessions")
					.doc(sessionID)
					.get()
					.then(doc => {
						let p1ID = doc.data().p1ID
                        let p2ID = doc.data().p2ID
						resolve([p1ID, p2ID])
					})
			})
		},
		getPlayerName(playerID) {
			return new Promise((resolve, reject) => {
				db.collection("players")
					.doc(playerID)
					.get()
					.then(doc => {
						resolve(doc.data().name)
					})
			})
        },
        structureData(p1name, p2name, p1arrows, p2arrows) {
            let p1sets = MathService.destructure(p1arrows)
            let p2sets = MathService.destructure(p2arrows)
            let p1 = Object.assign({}, { name: p1name }, { average: MathService.getArrowsAverage(p1arrows) }, ...p1sets)
            let p2 = Object.assign({}, { name: p2name }, { average: MathService.getArrowsAverage(p2arrows) }, ...p2sets)
            p1sets.forEach(set => {
                let key = Object.keys(set)[0]
                let obj = {}
                obj['prop'] = key
                obj['label'] = key
                this.columns.push(obj)
            })
            this.data.push(p1, p2)
        }
	},
	async mounted() {
		if (this.getWinner == this.getWhichPlayer) {
			this.isWinner = true
		} else {
			this.isWinner = false
        }
        let playerNames = await this.getPlayerNames(this.getSessionID)
        this.structureData(playerNames[0], playerNames[1], this.getMeta.p1arrows, this.getMeta.p2arrows)

	},
}
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	align-items: center;
}
.table {
	margin: 40px;
}
</style>
