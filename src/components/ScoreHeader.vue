<template>
	<el-container style="display: flex; justify-content: center">
		<el-card
			class="box-card"
			style="width: 500px; height: 35vh; "
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
export default {
	name: 'ScoreHeader',
	data() {
		return {
			p1Name: '',
			p2Name: '',
			p1Arrows: [],
			p2Arrows: [],
			p1Score: 0,
			p2Score: 0,
			p1Average: 0,
			p2Average: 0,
		}
	},
	computed: {
		...mapGetters(['getSessionID', 'getSetNumber', 'getMeta']),
    },
    methods: {
        format(percentage) {
            return percentage > 0 ? `${percentage / 10}` : '0'
        },
        color(player) {
            let higherAvg = this.p1Average > this.p2Average ? 1 : 2
            let color =  player === higherAvg ? '#67c23a' : '#e6a23c'
            return color
        }
    },
	watch: {
		getMeta: {
			handler: function(meta) {
				let index1 = meta.p1arrows.indexOf(-1) //index 3, 4th arrow
                let index2 = meta.p2arrows.indexOf(-2)
    
                let p1avg = meta.p1arrows.slice(0, index1).reduce((score, arrow) => 
                    score + (arrow / index1)
                , 0).toFixed(2)
                this.p1Average = p1avg > 0 ? p1avg : 0

                let p2avg = meta.p2arrows.slice(0, index2).reduce((score, arrow) => 
                    score + (arrow / index2)
                , 0).toFixed(2)
                this.p2Average = p2avg > 0 ? p2avg : 0

				let indices = (this.getSetNumber - 1) * 3
				this.p1Arrows = meta.p1arrows
					.slice(indices, indices + 3)
					.filter(arrow => {
						if (arrow == -1) {
							arrow = null
						}
						return arrow
					})
				this.p2Arrows = meta.p2arrows
					.slice(indices, indices + 3)
					.filter(arrow => {
						if (arrow == -2) {
							arrow = null
						}
						return arrow
					})
				this.p1Score = meta.p1score
				this.p2Score = meta.p2score
			},
			immediate: true,
		},
	},
	mounted() {
		db.collection('sessions')
			.doc(this.getSessionID)
			.get()
			.then(doc => {
				this.p1Name = doc.data().p1ID //temporary
				this.p2Name = doc.data().p2ID
			})
		// let ref = db.collection("sessions").doc(this.getSessionID);
		// let indices = (this.getSetNumber - 1) * 3
		// this.p1Arrows = this.getP1Arrows.slice(indices, indices + 3)
		// this.p2Arrows = this.getP2Arrows.slice(indices, indices + 3)
		// ref
		//   .get()
		//   .then((doc) => {
		//     let p1ID = doc.data().p1ID;
		//     let p2ID = doc.data().p2ID;
		//     let p1Ref = db.collection("players").doc(p1ID);
		//     let p2Ref = db.collection("players").doc(p2ID);
		//     p1Ref
		//       .get()
		//       .then((doc) => {
		//         this.p1Name = doc.data().name;
		//       })
		//       .catch((err) => {
		//         console.log(err);
		//       });
		//     p2Ref
		//       .get()
		//       .then((doc) => {
		//         this.p2Name = doc.data().name;
		//       })
		//       .catch((err) => {
		//         console.log(err);
		//       });
		//   })
		//   .catch((err) => {
		//     console.log(err);
		//   });
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
