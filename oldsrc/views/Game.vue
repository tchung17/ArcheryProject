<template>
	<div class="container">
		<score-header />
		<div class="lower-container">
			<div class="time-bar">
				<div class="time">
					{{ yourTurn }}
				</div>
				<br />
				<el-progress
					:percentage="time * 5"
					:show-text="false"
				></el-progress>
			</div>
			<br />
			<div class="arrow-entry" v-if="yourTurn">
				<div class="">Please Enter Your Arrow</div>
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
		}
	},
	computed: {
		...mapGetters([
			'getMeta',
			'getYourTurn',
			'getListener',
			'getSetNumber',
		]),
		yourTurn: function() {
			this.restartTime()
			this.num = 10
			return this.getYourTurn
		},
		meta: function() {
			return this.getMeta
		},
	},
	watch: {
		getListener: {
			handler: function() {
				if (!this.getListener) {
					this.startListener()
				}
			},
			immediate: true,
		},
		getSetNumber: {
			handler: function(val, oldVal) {
				if (this.getMeta.p1score >= 6) {
					this.setWinner(1)
					this.$router.push({
						name: 'WinLose',
					})
					return
				} else if (this.getMeta.p2score >= 6) {
					this.setWinner(2)
					this.$router.push({
						name: 'WinLose',
					})
					return
				}
				if (val > oldVal) {
					this.$router.push({name: 'SetWaiting'})
				}
			},
			immediate: true,
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
			this.submitArrow(num)
			this.$message({
				showClose: true,
				message: `You shot a ${num}`,
				type: 'success',
			})
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
