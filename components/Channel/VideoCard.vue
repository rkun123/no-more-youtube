<template>
  <div class="video-card" @click="watch(videos.videoId)">
    <img :src="videos.videoThumbnail">
    <p>{{ videos.videoTitle }}</p>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

interface Video {
  videoId?: string | null,
  videoTitle?: string | null,
  videoThumbnail?: string | null,
}

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
  margin: 5px;
  cursor: pointer;
}
.video-card img {
  height: 118px;
  width: 210px;
}
.video-card p {
  width: 210px;
  white-space:normal;
}
</style>
