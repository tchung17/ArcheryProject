<template>
	<div class="container">
		<div class="code" v-if="showCode">
			{{ code }}
		</div>
		<div class="button-container" v-else>
			<el-popover
				placement="top-start"
				title="Create a session"
				trigger="hover"
				content="Share this code with a friend to start your match!"
			>
				<el-button
					class="button"
					style="width: 100%;"
					type="primary"
					slot="reference"
					@click="generateCode()"
				>
					Generate a New Code
				</el-button>
			</el-popover>
			<el-input
				style="margin-top: 10px;"
				placeholder="Enter your code"
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
            }, 500)
			setTimeout(() => {
				this.readyUp(this.code)
			}, 500)
		},
	},
	mounted() {
		sessionStorage.clear()
		this.code = ''
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
