<template>
  <div class="video-card" @click="watch(videos.videoId)">
    <img :src="videos.videoThumbnail">
    <div class="video-title">
      {{ videos.videoTitle }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Video } from '~/store/channels'

export default Vue.extend({
  props: {
    // eslint-disable-next-line vue/require-default-prop
    videos: {
      type: Object as PropType<Video>
    }
  },
  methods: {
    watch (videoId:string) {
      this.$router.push({ path: '/video/' + videoId })
    }
  }
})
</script>

<style scoped>
.video-card {
  display: inline;
  cursor: pointer;
}
.video-card img {
  height: 118px;
  width: 210px;
}
.video-card .video-title {
  width: 210px;
  white-space:normal;
  margin: 0px;
  padding: 0;
}
</style>
