<template>
    <div>
        <div class="win" v-if="winner">
            You won!
        </div>
        <div class="lose" v-if="(!winner)">
            You lost.
        </div>
        <div class="score">
            The score was {{ getMeta.p1score }} to {{ getMeta.p2score }}
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    data() {
        return {
            isWinner: null,
        };
    },
    computed: {
        ...mapGetters(["getWhichPlayer", "getMeta", "getWinner"]),
        winner: function () {
            return this.isWinner;
        },
    },
    mounted() {
        if (this.getWinner == this.getWhichPlayer) {
            this.isWinner = true;
        } else {
            this.isWinner = false;
        }
    },
};
</script>

<style scoped></style>
