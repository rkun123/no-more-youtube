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
    />
    <div class="wrap" v-show="wrap">
      <fa :icon="['fab', 'youtube']" @click="playing" class="play-button" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

interface videoInfo {
  height: number
  wrap: boolean
  playerVars:{
    fs: number
    rel: number
  }
}

export default Vue.extend({
  props: {
    videoId: {
      type: String,
      default: '3Isbd9b7tvg'
    }
  },
  data (): videoInfo {
    return {
      height: 400,
      wrap: true,
      playerVars: {
        fs: 0, // フルスクリーンの禁止
        rel: 0 // 関連動画を投稿者のものだけにする
      }
    }
  },
  computed: {
    player () {
      // @ts-ignore
      return this.$refs.yt.player
    }
  },
  mounted () {
    // @ts-ignore
    this.handleResize()
    // @ts-ignore
    window.addEventListener('resize', this.handleResize)
  },
  methods: {
    ready () {
      // @ts-ignore
      console.log(this.player)
    },
    play () {
      // @ts-ignore
      this.wrap = false
      console.log('play')
    },
    paused () {
      // @ts-ignore
      this.wrap = true
      console.log('pause')
    },
    pause () {
      // @ts-ignore
      this.wrap = true
      // @ts-ignore
      this.player.pauseVideo()
    },
    playing () {
      // @ts-ignore
      this.wrap = false
      // @ts-ignore
      this.player.playVideo()
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
    }
  }
})
</script>

<style scoped>
.player {
  position: relative;
}
.wrap{
  position: absolute;
  top: 0px;
  width:100%;
  height: 100%;
  background-color: #050000;
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
</style>
