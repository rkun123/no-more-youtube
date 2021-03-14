<template>
  <div>
    <!-- <div class="channel-header">
    </div> -->
    <div class="videos">
      <div v-for="video in get_videos" :key="video.num">
        <div class="card">
          <video-card :videos="video" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import VideoCard from '@/components/Channel/VideoCard.vue'
import { VideosStore } from '~/store'

export default Vue.extend({
  components: { VideoCard },
  computed: {
    get_videos () {
      return VideosStore.getVideos
    }
  },
  created () {
    VideosStore.setVideos(this.$route.params.id)
  }
})
</script>

<style scoped>
.videos {
  margin: auto;
  padding: 5px;
  display: flex;
  width: 100%;
  max-width: 1200px;
  flex-wrap: wrap;
  justify-content:center
}
.videos .card{
  margin: 5px;
}
</style>
