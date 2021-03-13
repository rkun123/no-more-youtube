<template>
    <div class="container">
        <div class="bar-outer">
            <div class="played-bar" :style="playedBarWidth">
            </div>
            <div class="played-time-label">
                <span class="played-time-title">本日の残り時間: </span>
                <span class="played-time-main">{{ this.currentPlayTime}}</span>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: 'PlayTimeBar',
    props: {
        currentPlaySeconds: {
            type: Number,
            default: 0,
            required: true
        },
        maxPlaySeconds: {
            type: Number,
            default: 60 * 30,
            required: true
        }
    },
    computed: {
        playedBarWidth(): string {
            if( this.currentPlaySeconds > this.maxPlaySeconds) return '100%'
            return `width: ${this.currentPlaySeconds / this.maxPlaySeconds * 100}%;`
        },
        currentPlayTime(): string {
            const restSeconds = this.maxPlaySeconds - this.currentPlaySeconds
            if( restSeconds < 0 ) return '00:00'
            const minutes = Math.floor(restSeconds / 60)
            const seconds = Math.floor(restSeconds % 60) 
            return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
        }
    },
})
</script>
<style scoped>
.container {
    width: 100%;
    height: 50px;
}
.bar-outer {
    position: relative;
    top: 10px;
    margin: 0 10px;
}
.played-bar {
    display: block;
    position: relative;
    background-color: #cf9494;
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