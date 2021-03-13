<template>
  <div>
    <video-player :video-id="$route.params.id" />
    <div class="title">
      <h1>{{ video.title }}</h1>
    </div>
    <div class="description">
      <div v-html="video.description"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import VideoPlayer from '~/components/Video/VideoPlayer.vue'

export default Vue.extend({
  data () {
    return {
      params: {
        id: '',
        part: 'snippet',
        key: ''
      },
      video: {
        title: '',
        description: ''
      }
    }
  },
  components: { VideoPlayer },
  created () {
    this.params.id = this.$route.params.id
    this.params.key = String(process.env.YOUTUBE_API_KEY)
    this.$axios
      .get('https://www.googleapis.com/youtube/v3/videos', {
        params: this.params
      })
      .then((result) => {
        const data = result.data.items[0].snippet
        this.video.title = data.title
        this.video.description = data.description
        console.log(this.video)
      })
  }
})
</script>
