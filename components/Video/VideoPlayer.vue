/* eslint-disable nuxt/no-globals-in-created */
<template>
  <div>
    <youtube
      ref="yt"
      video-id="3Isbd9b7tvg"
      width="100%"
      @ready="ready"
      @playing="play"
      @paused="paused"
    />
    <button @click="pause">
      pause
    </button>
    <button @click="playing">
      playing
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
    }
  },
  computed: {
    player () {
      // eslint-disable-next-line no-console
      console.log(this.$refs.yt)
      return this.$refs.yt.player
    }
  },
  methods: {
    ready () {
      // eslint-disable-next-line no-console
      console.log(this.player)
    },
    play () {
      // eslint-disable-next-line no-console
      console.log('play')
    },
    paused () {
      // eslint-disable-next-line no-console
      console.log('pause')
    },
    pause () {
      this.player.pauseVideo()
    },
    playing () {
      this.player.playVideo()
    }
  }
})
</script>
