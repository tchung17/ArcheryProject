<template>
	<el-container style="display: flex; justify-content: center">
		<el-card
			class="box-card"
			style="width: 500px; height: 340px; "
			body-style="display: flex; align-items: center; justify-content: space-around; height: 100%; padding: 0px;"
		>
			<div
				class="player1"
				style="width: 50%; border-right: 1px solid Gainsboro; height: 90%"
			>
				<div
					class="header"
					style="text-align: left; padding-left:25px;"
				>
					<h2 style="font-weight: bold;">
						{{ p1Name }}
					</h2>
					<h1>{{ p1Score }}</h1>
				</div>
				<div class="">
					<div
						style="display:flex; justify-content: space-around; padding:10px 20px;"
					>
						<div class="">{{ p1Arrows[0] }}</div>
						<el-divider direction="vertical"></el-divider>
						<div class="">{{ p1Arrows[1] }}</div>
						<el-divider direction="vertical"></el-divider>
						<div class="">{{ p1Arrows[2] }}</div>
					</div>
					<el-progress
						style="margin: 10px;"
						type="circle"
						:percentage="p1Average * 10"
                        :format="format"
                        :color="color(1)"
					></el-progress>
				</div>
			</div>
			<div class="player2" style="width: 50%; height: 90%;">
				<div
					class="header"
					style="padding-right:20px; text-align: right;"
				>
					<h2 style="font-weight: bold;">
						{{ p2Name }}
					</h2>
					<h1>{{ p2Score }}</h1>
				</div>
				<div class="">
					<div
						style="display:flex; justify-content: space-around; padding:10px 20px;"
					>
						<div class="">{{ p2Arrows[0] }}</div>
						<el-divider direction="vertical"></el-divider>
						<div class="">{{ p2Arrows[1] }}</div>
						<el-divider direction="vertical"></el-divider>
						<div class="">{{ p2Arrows[2] }}</div>
					</div>
					<el-progress
						style="margin: 10px;"
						type="circle"
						:percentage="p2Average * 10"
                        :format="format"
                        :color="color(2)"
					></el-progress>
				</div>
			</div>
		</el-card>
	</el-container>
</template>

<script>
import {mapGetters} from 'vuex'
import db from '../firebase/init'
import MathService from '../services/MathService'
export default {
	name: 'ScoreHeader',
	data() {
		return {
			p1Name: '',
			p2Name: '',
		}
	},
	computed: {
        ...mapGetters(['getSessionID', 'getSetNumber', 'getMeta']),
        p1Arrows: function () {
            return MathService.getSetArrowsFilled(this.getMeta.p1arrows, this.getSetNumber)
        },
        p2Arrows: function() {
            return MathService.getSetArrowsFilled(this.getMeta.p2arrows, this.getSetNumber)
        },
        p1Score : function() {
            return this.getMeta.p1score
        },
        p2Score : function() {
            return this.getMeta.p2score
        },
        p1Average: function() {
            return MathService.getArrowsAverage(this.getMeta.p1arrows)
        },
        p2Average: function() {
            return MathService.getArrowsAverage(this.getMeta.p2arrows)
        }
    },
    methods: {
        format(percentage) {
            return percentage > 0 ? `${percentage / 10}` : '0'
        },
        color(player) {
            let higherAvg = 0
            if (this.p1Average > this.p2Average) {
                higherAvg = 1
            } else if (this.p2Average > this.p1Average) {
                higherAvg = 2
            }
            let color = player === higherAvg ? '#A8D0E6': '#F76C6C'
            if (higherAvg == 0) {
                color = '#F8E9A1'
            }
            return color
        }
    },
	mounted() {
		db.collection('sessions')
			.doc(this.getSessionID)
			.get()
			.then(doc => {
				this.p1Name = doc.data().p1ID //temporary
				this.p2Name = doc.data().p2ID
			})
		
	},
}
</script>

<style scoped>
.container {
	display: flex;
	justify-content: space-between;
}
.box-card {
	margin: 20px;
	width: 200px;
}
</style>
