<template>
	<div class="container">
		<score-header />
		<div class="lower-container">
			<div class="time-bar">
				<br />
				<h3>{{ Math.floor(time / 5) }}s</h3>
				<el-progress
					:percentage="time"
					:show-text="false"
					color="#F8E9A1"
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
import MathService from '../services/MathService'
export default {
	name: 'Game',
	components: {
		ScoreHeader,
	},
	data() {
		return {
			num: 10,
			time: 100,
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
		setNumber: function() {
			return this.getSetNumber
		},
	},
	watch: {
		setNumber: {
			handler: function(val, oldVal) {
				if (val == 6) {
					this.$router.push({name: 'ShootOff'})
				} else if (this.p1score >= 6) {
					this.setWinner(1)
					this.$router.push({
						name: 'WinLose',
					})
				} else if (this.p2score >= 6) {
					this.setWinner(2)
					this.$router.push({
						name: 'WinLose',
					})
				} else {
					let winner = MathService.getSetWinner(
						this.getMeta.p1arrows,
						this.getMeta.p2arrows
					)
					if (winner == 3) {
						this.$message({
							showClose: true,
							message: `You tied set ${this.setNumber - 1}`,
							type: 'success',
						})
					} else if (this.getWhichPlayer == winner) {
						this.$message({
							showClose: true,
							message: `You won set ${this.setNumber - 1}`,
							type: 'success',
						})
					} else if (this.getWhichPlayer != winner) {
						this.$message({
							showClose: true,
							message: `You lost set ${this.setNumber - 1}`,
							type: 'success',
						})
                    }
                    this.$router.push({name: 'SetWaiting'})
				}
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
            if (this.interval) {
                clearInterval(this.interval)
            }
			this.time = 100
			this.interval = setInterval(this.timerTick, 190)
		},
		submit(num) {
			this.submitArrow(num)
			this.$message({
				showClose: true,
				message: `You shot a ${num}`,
				type: 'success',
			})
		},
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
