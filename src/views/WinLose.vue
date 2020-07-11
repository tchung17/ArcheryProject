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
		<el-table
			class="table"
			:data="data"
			style="width: 600px;"
			align="center"
		>
			<el-table-column prop="playerID" label="Player" width="200">
			</el-table-column>
			<el-table-column
				prop="arrowAverage"
				label="Arrow Average"
				width="200"
			>
			</el-table-column>
			<el-table-column prop="date" label="Date" width="200">
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
	data() {
		return {
			isWinner: null,
			data: [
				{playerID: 'tim', arrowAverage: 9.31, date: '7/10'},
				{playerID: 'tim', arrowAverage: 9.31, date: '7/10'},
				{playerID: 'tim', arrowAverage: 9.31, date: '7/10'},
				{playerID: 'tim', arrowAverage: 9.31, date: '7/10'},
			],
		}
	},
	computed: {
		...mapGetters(['getWhichPlayer', 'getMeta', 'getWinner']),
		winner: function() {
			return this.isWinner
		},
	},
	mounted() {
		if (this.getWinner == this.getWhichPlayer) {
			this.isWinner = true
		} else {
			this.isWinner = false
		}
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
