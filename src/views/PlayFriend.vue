<template>
	<div class="container">
		<div class="code" v-if="showCode" style="margin-bottom: 100px;">
			{{ code }}
		</div>

		<div class="button-container" style="width:85%" v-else>
			<el-carousel
				indicator-position="outside"
				:interval="4000"
				direction="vertical"
				:autoplay="true"
			>
				<el-carousel-item>
					<div class="wrapper" style="text-align: center">
						<div
							class="card-box"
							style="width: 40%; display: inline-block"
						>
							<div
								class="text"
								style="width: 40%; margin: 10px; text-align: left;"
							>
								<strong>Create a live match!</strong><hr>
								Invite your opponent by sharing a unique code
							</div>
							<el-popover
								placement="top-end"
								content="Create a session"
								trigger="hover"
							>
								<el-button
									class="button"
									style="width: 100%; margin-top: 10px;"
									type="primary"
									slot="reference"
									@click="generateCode()"
								>
									Generate Code
								</el-button>
							</el-popover>
						</div>
					</div>
				</el-carousel-item>
				<el-carousel-item>
					<div class="wrapper" style="text-align: center">
						<div
							class="card-box"
							style="width: 40%; display: inline-block"
						>
							<div
								class="text"
								style="width: 40%; margin: 10px; text-align: left"
							>
								<strong>Join a match!</strong><hr>
								Enter your code below
							</div>
							<el-input
								style="margin-top: 10px; width:100%;"
								placeholder="Enter code"
								v-model="code"
							></el-input>
							<el-button
								class="button"
								style="width:100%; margin-top:10px;"
								@click="submitCode"
								type="primary"
								:loading="loading"
							>
								Submit
							</el-button>
						</div>
					</div>
				</el-carousel-item>
			</el-carousel>
		</div>
	</div>
</template>

<script>
import {mapActions} from 'vuex'
import {mapGetters} from 'vuex'
import db from '../firebase/init'
export default {
	name: 'PlayFriend',
	computed: {
		...mapGetters(['getWhichPlayer', 'getReady', 'getSessionID']),
	},
	data() {
		return {
			code: '',
			showCode: false,
			loading: false,
			unsubscribe: null,
		}
	},
	watch: {
		getReady: {
			handler: function(val, oldVal) {
				if (oldVal == 1 && val == 0) {
					console.log('pushed')
					this.$router.push({name: 'SetWaiting'})
				}
			},
			immediate: true,
		},
		getSessionID: {
			handler: function(val) {
				this.code = val
			},
			immediate: true,
		},
	},
	methods: {
		...mapActions(['createSession', 'joinSession', 'readyUp']),
		submitCode() {
			let ref = db.collection('sessions').doc(this.code)
			ref.get().then(doc => {
				if (!doc.exists) {
					alert('Incorrect Code')
					return
				}
			})
			if (this.getWhichPlayer == 2) {
				return this.joinSession(this.code)
			} else {
				return this.readyUp(this.code)
			}
		},
		generateCode() {
			this.createSession()
			this.showCode = true
			this.loading = this.$loading({
				lock: true,
				text: 'Waiting for opponent to join...',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.3)',
			})
			setTimeout(() => {
				this.$copyText(this.getSessionID).then(
					() => {
						this.$message({
							showClose: true,
							message: 'Code copied to clipboard!',
							type: 'success',
						})
					},
					err => {
						console.log(err)
					}
				)
			}, 400)
			setTimeout(() => {
				this.readyUp(this.code)
			}, 600)
		},
	},
	mounted() {
		this.code = ''
	},
	beforeCreate() {
		sessionStorage.clear()
    },
    beforeDestroy () {
        this.loading.close();
    },
}
</script>

<style scoped>
.container {
	height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.button-container {
	margin: 30px;
}
</style>
