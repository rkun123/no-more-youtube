<template>
    <div class="root">
        <div class="bar-outer has-background-grey-lighter">
            <div class="played-bar has-background-primary" :style="playedBarWidth">
            </div>
            <div class="played-time-label">
                <span class="played-time-title">本日の残り時間: </span>
                <span class="played-time-main" :style="isTimeExceeded ? 'color: red;' : ''">{{ this.currentPlayTime}}</span>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { UserStore } from '~/store'
import Users from '~/store/user'

export default Vue.extend({
    name: 'PlayTimeBar',
    computed: {
        playedBarWidth() {
            return `width: ${UserStore.getPlayedTimePercent}%`
        },
        currentPlayTime() {
            return UserStore.getPlayedTimeString
        },
        isTimeExceeded() {
            return !UserStore.getIsRemainPlayTime
        }
    },
})
</script>
<style scoped>
.root {
    width: 100%;
    margin-right: 10px;
}
.bar-outer {
    position: relative;
    width: 100%;
    background-color: #cccccc;
    border-radius: 15px;
}
.played-bar {
    display: block;
    position: relative;
    height: 30px;
    border-radius: 15px;
}
.played-time-label {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
.played-time-title {
    font-size: 0.8rem;
}
.played-time-main {
    font-size: 1.2rem;
    font-weight: bold;
}
</style>