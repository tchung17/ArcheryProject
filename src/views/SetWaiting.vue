<template>
    <div class="container">
        <br />
        <br />
        <br />
        <div class="button-container" @click="startSet">
            <el-button class="button" type="primary" :loading="loading">
                {{ msg }}
            </el-button>
        </div>
    </div>
</template>

<script>
//import ScoreHeader from "../components/ScoreHeader.vue";
import db from "../firebase/init";
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
export default {
    name: "SetWaiting",
    data() {
        return {
            msg: "Start Set",
            loading: false,
            unsubscribe: null,
        };
    },
    computed: {
        ...mapGetters(["getSessionID", "getWhichPlayer", "getReady", "getMeta"]),
    },
    watch: {
        getReady: function (newVal, oldVal) {
            if (oldVal == 1 && newVal == 0) {
                this.$router.push("/game");
            }
        },
    },
    methods: {
        ...mapActions(["readyUp", "setWinner"]),
        startSet() {
            let ref = db.collection("sessions").doc(this.getSessionID);
            if (this.loading == false) {
                this.loading = true;
                this.msg = "Waiting";
                this.readyUp();
            } else {
                this.loading = false;
                this.msg = "Start Set";
            }
        },
    },
};
</script>

<style scoped>
.button {
    width: 30%;
}
</style>
