<template>
	<div class="container">
		<score-header />
		<div class="lower-container">
			<div class="time-bar">
				<br />
				<h3>{{ time }}s</h3>
				<el-progress
					:percentage="time * 5"
					:show-text="false"
					:color="colors"
				></el-progress>
			</div>
			<br />
			<div class="arrow-entry" v-if="yourTurn">
				<h1>Enter Your Arrow</h1>
				<br />
				<el-input-number
					v-model="num"
					:min="1"
					:max="10"
				></el-input-number>
				<br />
				<br />

				<div class="button-container" @click="submit(num)">
					<el-button class="button" type="primary">
						Submit
					</el-button>
				</div>
			</div>
			<div class="waiting" v-else>
				<h3>Opponent is shooting...</h3>
			</div>
		</div>
	</div>
</template>

<script>
import ScoreHeader from '../components/ScoreHeader.vue'
import {mapGetters} from 'vuex'
import {mapActions} from 'vuex'
export default {
	name: 'Game',
	components: {
		ScoreHeader,
	},
	data() {
		return {
			num: 10,
			time: 20,
			interval: null,
			colors: [
				{color: '#f56c6c', percentage: 30},
				{color: '#e6a23c', percentage: 50},
				{color: '#5cb87a', percentage: 51},
			],
		}
	},
	computed: {
		...mapGetters([
			'getMeta',
			'getYourTurn',
			'getListener',
			'getWhichPlayer',
			'getSetNumber',
		]),
		yourTurn: function() {
			this.restartTime()
			this.num = 10
			return this.getYourTurn
		},
		p1score: function() {
			return this.getMeta.p1score
		},
		p2score: function() {
			return this.getMeta.p2score
		},
	},
	watch: {
		getListener: {
			handler: function() {
				if (!this.getListener) {
					this.startListener()
				}
			},
		},
		p1score: {
			handler: function(val, oldVal) {
				console.log('p1' + val)
				if (val >= 3) {
					this.setWinner(1)
					this.$router.push({
						name: 'WinLose',
					})
					return
				}
				if (val == oldVal + 1) {
					this.$message({
						showClose: true,
						message: `You tied set ${this.getSetNumber}`,
						type: 'success',
					})
				} else if (val == oldVal + 2) {
					if (this.getWhichPlayer == 1) {
						this.$message({
							showClose: true,
							message: `You won set ${this.getSetNumber}`,
							type: 'success',
						})
					} else {
						this.$message({
							showClose: true,
							message: `You lost set ${this.getSetNumber}`,
							type: 'warning',
						})
					}
				}
				this.$router.push({name: 'SetWaiting'})
			},
		},
		p2score: {
			handler: function(val, oldVal) {
				console.log('p2' + val)
				if (val >= 3) {
					this.setWinner(2)
					this.$router.push({
						name: 'WinLose',
					})
					return
				}
				if (val == oldVal + 1) {
					this.$message({
						showClose: true,
						message: `You tied set ${this.getSetNumber}`,
						type: 'success',
					})
				} else if (val == oldVal + 2) {
					if (this.getWhichPlayer == 2) {
						this.$message({
							showClose: true,
							message: `You won set ${this.getSetNumber}`,
							type: 'success',
						})
					} else {
						this.$message({
							showClose: true,
							message: `You lost set ${this.getSetNumber}`,
							type: 'warning',
						})
					}
				}
				this.$router.push({name: 'SetWaiting'})
			},
		},
	},
	methods: {
		...mapActions(['submitArrow', 'startListener', 'setWinner']),
		timerTick() {
			if (this.time > 0) {
				this.time -= 1
			}
		},
		restartTime() {
			clearInterval(this.interval)
			this.time = 20
			this.interval = setInterval(this.timerTick, 1000)
		},
		submit(num) {
			this.submitArrow(num).then(() => {
				this.$message({
					showClose: true,
					message: `You shot a ${num}`,
					type: 'success',
				})
			})
			// let storage = Object.entries(JSON.parse(sessionStorage.getItem('my-app'))).filter((value) => {
			//     if (value[0] == 'playerID') {
			//         console.log(value[1])
			//         return value
			//     }
			// })
			// console.log(storage[0][0])
		},
	},
	mounted() {
		this.interval = setInterval(this.timerTick, 1000)
	},
	beforeDestroy() {
		clearInterval(this.interval)
	},
}
</script>

<style scoped>
.button {
	width: 150px;
}
.time-bar {
	width: 400px;
}
.lower-container {
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>
