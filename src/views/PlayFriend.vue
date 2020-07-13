<template>
	<div class="container">
		<div class="code" v-if="showCode" >
			{{ code }}
		</div>

		<div class="button-container" style="width:85%">
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
							style="width: 50%; display: inline-block"
						>
							<div
								class="text"
								style="width: 50%; margin: 10px; text-align: left;"
							>
								<strong>Create a live match!</strong>
								<hr />
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
							style="width: 50%; display: inline-block"
						>
							<div
								class="text"
								style="width: 50%; margin: 10px; text-align: left"
							>
								<strong>Join a match!</strong>
								<hr />
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
			loading: null,
			readyToWatch: false,
		}
	},
	watch: {
		getReady: {
			handler: function(val, oldVal) {
				if (oldVal == 1 && val == 0 && this.readyToWatch) {
					this.$router.push({name: 'SetWaiting'})
				}
			},
		},
		getSessionID: {
			handler: function(val) {
				this.code = val
			},
		},
	},
	methods: {
		...mapActions(['createSession', 'joinSession', 'readyUp', 'wipeState']),
		async submitCode() {
			let ref = db.collection('sessions').doc(this.code)
			ref.get().then(doc => {
				if (!doc.exists) {
					alert('Incorrect Code')
					return
				}
			})
			if (this.getWhichPlayer == 2) {
                this.readyToWatch = true
                await this.joinSession(this.code)
                await this.readyUp()
			}
		},
		async generateCode() {
			this.readyToWatch = true
            this.showCode = true
            await this.createSession()
			await this.$copyText(this.getSessionID)
			this.loading = this.$loading({
				lock: true,
				text: `Waiting for opponent to join...\n${this.getSessionID}`,
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)',
			})
			this.$message({
                showClose: true,
                spinner: "el-icon-loading",
                target: "button-container",
				message: 'Code copied to clipboard!',
				type: 'success',
			})
		},
	},
	mounted() {
		this.code = ''
		sessionStorage.clear()
		this.wipeState()
	},
	beforeRouteLeave(to, from, next) {
		if (this.loading) {
			this.loading.close()
		}
		this.readyToWatch = false
		next()
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
	margin: 10px;
}
.spinner {
    background-color: white !important;
}
</style>
