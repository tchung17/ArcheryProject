<template>
    <div class="container">
        <score-header/>
        <div class="message-container">
            <div class="message" style="">
                <h1>
                    {{ msg }}
                </h1>
            </div>
            <el-button class="button" type="primary"  @click="startSet" :loading="loading">
                Ready
            </el-button>
        </div>
    </div>
</template>

<script>
import ScoreHeader from "../components/ScoreHeader.vue";
import db from "../firebase/init";
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
export default {
    name: "SetWaiting",
    components: {
        ScoreHeader,
    },
    data() {
        return {
            msg: "",
            loading: false,
            unsubscribe: null,
        };
    },
    computed: {
        ...mapGetters(["getSessionID", "getWhichPlayer", "getReady", "getMeta", "getListener"]),
    },
    watch: {
        getReady: function (newVal, oldVal) {
            if (oldVal == 1 && newVal == 0) {
                this.$router.push("/game");
            }
        },
        getListener: {
			handler: function() {
				if (!this.getListener) {
					this.startListener()
				}
			},
			immediate: true,
		},
    },
    methods: {
        ...mapActions(["readyUp", "setWinner", "startListener"]),
        startSet() {
            // let ref = db.collection("sessions").doc(this.getSessionID);
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
    mounted () {
        this.msg = `Set ${this.getMeta.setNumber}`;
    },
};
</script>

<style scoped>
.button {
    width: 30%;
}
</style>
