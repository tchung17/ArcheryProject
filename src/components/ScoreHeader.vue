<template>
    <div class="container">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <div class="">{{ p1Name }}</div>
                <div class="">{{ p1Score }}</div>
            </div>
            <div v-for="arrow in p1Arrows" :key="arrow" class="text item">
                {{ arrow }}
            </div>
        </el-card>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <div class="">{{ p2Name }}</div>
                <div class="">{{ p2Score }}</div>
            </div>
            <div v-for="arrow in p2Arrows" :key="arrow" class="text item">
                {{ arrow }}
            </div>
        </el-card>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import db from "../firebase/init";
export default {
    name: "ScoreHeader",
    data() {
        return {
            p1Name: "",
            p2Name: "",
            p1Arrows: [123],
            p2Arrows: [],
            p1Score: 0,
            p2Score: 0,
        };
    },
    computed: {
        ...mapGetters(["getSessionID", "getSetNumber", "getMeta"]),
    },
    watch: {
        getMeta: {
            handler: function (val) {
                let indices = (this.getSetNumber - 1) * 3;
                this.p1Arrows = this.getMeta.p1arrows.slice(
                    indices,
                    indices + 3
                ).filter(arrow => {
                    return arrow != -1;
                })
                
                this.p2Arrows = val.p2arrows.slice(
                    indices,
                    indices + 3
                ).filter(arrow => {
                    return arrow != -2;
                })
                this.p1Score = val.p1score
                this.p2Score = val.p2score
            },
            immediate: true,
        },
    },
    mounted() {
        db.collection("sessions")
            .doc(this.getSessionID)
            .get()
            .then((doc) => {
                this.p1Name = doc.data().p1ID; //temporary
                this.p2Name = doc.data().p2ID;
            });
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
};
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
