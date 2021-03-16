/* eslint-disable nuxt/no-globals-in-created */
<template>
  <div class="player">
    <youtube
      ref="yt"
      :video-id="videoId"
      width="100%"
      :height="height"
      :player-vars="playerVars"
      @ready="ready"
      @playing="play"
      @paused="paused"
      @ended="ended"
    />
    <div v-show="wrap" class="wrap" :style="heightSet">
      <img class="wrap-background" :src="thumbnailUrl">
      <fa class="play-button" :icon="['fab', 'youtube']" @click="playing" />
    </div>
    <input
      v-model="range"
      type="range"
      class="seekbar"
      @mouseup="setTime"
      @mousedown="setDrag"
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { UserStore } from '~/store'
import Users from '~/store/user'

interface videoInfo {
  height: number
  wrap: boolean
  range: number
  length: number
  drag: boolean
  playerVars:{
    fs: number
    rel: number
    controls: number
  }
  playTimeInfo: {
    playTimeoutId: number,
    playStartedAt: number
  }
}

export default Vue.extend({
  props: {
    videoId: {
      type: String,
      default: '7O1WGScOKe4'
    },
    thumbnailUrl: {
      type: String,
      default: 'https://picsum.photos/1280/720'
    }
  },
  data (): videoInfo {
    return {
      height: 400,
      wrap: true,
      range: 0,
      length: 0,
      drag: false,
      playerVars: {
        fs: 0, // フルスクリーンの禁止
        rel: 0, // 関連動画を投稿者のものだけにする
        controls: 0
      },
      playTimeInfo: {
        playTimeoutId: 0,
        playStartedAt: Date.now(),
      }

    }
  },
  computed: {
    player () {
      // @ts-ignore
      return this.$refs.yt.player
    },
    heightSet () {
      return {
        // @ts-ignore
        '--height': String(this.height) + 'px'
      }
    },
    canPlay() {
      return UserStore.getIsRemainPlayTime
    }
  },
  mounted () {
    // @ts-ignore
    this.handleResize()
    // @ts-ignore
    window.addEventListener('resize', this.handleResize)
    // eslint-disable-next-line no-implied-eval
    setInterval(() => {
      // @ts-ignore
      this.seek()

    }, 500)
  },
  async beforeDestroy(){
    await this.stopMeasurement()
  },
  methods: {
    ready () {
      // @ts-ignore
      this.player.getDuration().then((result) => {
        // @ts-ignore
        this.length = result
      })
    },
    async newPlayeMinutes(minutes: number) {
      await UserStore.postPlayedMinutes(minutes)
    },
    seek () {
      // @ts-ignore
      if (!this.drag) {
        // @ts-ignore
        this.player.getCurrentTime().then((result) => {
          // @ts-ignore
          this.range = result / this.length * 100.0
        })
      }
    },
    startMeasurement() {
      console.info('startMeasurement')
      // @ts-ignore
      this.playTimeInfo.playStartedAt = Date.now()
      this.playTimeInfo.playTimeoutId = window.setInterval(() => {
        this.postPlayedTime()
      }, 1000 * 10)
    },
    async postPlayedTime() {
      console.info('postPlayedTime')
      const playedSeconds = (Date.now() - this.playTimeInfo.playStartedAt) / 1000
      console.info('played:', playedSeconds, 's')
      await UserStore.postPlayedMinutes(playedSeconds / 60)
      this.playTimeInfo.playStartedAt = Date.now()
    },
    stopMeasurement() {
      console.info('stopMeasurement')
      clearInterval(this.playTimeInfo.playTimeoutId)
      this.postPlayedTime()
    },
    play () {
      // @ts-ignore
      this.wrap = false
      this.startMeasurement()
    },
    paused () {
      // @ts-ignore
      this.wrap = true
      this.stopMeasurement()
    },
    ended () {
      // @ts-ignore
      this.wrap = true
    },
    pause () {
      // @ts-ignore
      this.wrap = true
      // @ts-ignore
      this.player.pauseVideo()
    },
    playing () {
      // @ts-ignore
      if(this.canPlay) {
        // @ts-ignore
        this.player.playVideo()
        // @ts-ignore
        this.wrap = false
      }
    },
    handleResize () {
      // resizeのたびにこいつが発火するので、ここでやりたいことをやる
      if (window.innerWidth * (9 / 16) < 650) {
        // @ts-ignore
        this.height = window.innerWidth * (9 / 16)
      } else {
        // @ts-ignore
        this.height = 650
      }
    },
    setTime () {
      // @ts-ignore
      const now = (this.range * this.length) / 100.0
      // @ts-ignore
      this.player.seekTo(now, true)
      // @ts-ignore
      this.drag = false
    },
    setDrag () {
      // @ts-ignore
      this.drag = true
    }
  },
  watch: {
    canPlay(newState, oldState) {
      if(!newState) {
        // 超過すれば再生を停止
        this.pause()
      }
    }
  }
})
</script>

<style scoped>
.player {
  position: relative;
  text-align: center;
}
.wrap{
  position: absolute;
  top: 0px;
  width: 100%;
  height: var(--height);
  background-color: #050000;
  overflow: hidden;
}
.wrap-background {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
}
.play-button{
  position: absolute;
  top: 50%;
  left: 50%;
  transform : translate(-50%,-50%);
  color: #DA1725;
  font-size: 100px;
  cursor: pointer;
}
.play-button:hover {
  font-size: 110px;
}
.seekbar{
  width: 100%;
  max-width: 1156px;
}
</style>
