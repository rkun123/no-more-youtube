<template>
  <div>
    <video-player :videoId="$route.params.id" :thumbnailUrl="video.thumbnail" />
    <div class="title">
      <h2>{{ video.title }}</h2>
    </div>
    <div class="description">
      <p v-html="textLink(this.video.description)" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import VideoPlayer from '~/components/Video/VideoPlayer.vue'

export default Vue.extend({
  components: { VideoPlayer },
  data () {
    return {
      params: {
        id: '',
        part: 'snippet',
        key: ''
      },
      video: {
        title: '',
        description: '',
        thumbnail: ''
      }
    }
  },
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
        this.video.thumbnail = data.thumbnails.maxres.url
        console.log(result)
      })
  },
  methods: {
    textLink (text: string) {
      // eslint-disable-next-line camelcase
      const regexp_url = /((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g
      // eslint-disable-next-line camelcase
      const regexp_makeLink = function (url: string, href: string) {
        return '<a href="' + href + '">' + url + '</a>'
      }
      return text.replace(regexp_url, regexp_makeLink)
    }
  }
})
</script>

<style scoped>
.title {
  margin-left: 10px;
}
.description {
  margin-top: 20px;
  margin-left: 20px;
  white-space: pre-wrap;
  word-wrap:break-word;
  color: #030303;
}
</style>
