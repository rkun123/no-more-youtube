<template>
  <div>
    <play-time-bar :currentPlaySeconds="this.current" :maxPlaySeconds="this.max"/>
    <video-player />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import VideoPlayer from '~/components/Video/VideoPlayer.vue'
import PlayTimeBar from '~/components/PlayTimeBar.vue'

export default Vue.extend({
  components: {
    VideoPlayer,
    PlayTimeBar
  },
  data: () => ({
    max: 60 * 30,
    current: 0
  }),
  created() {
    setInterval(() => {
      this.current += 0.1
    }, 100)
  }
})
</script>
