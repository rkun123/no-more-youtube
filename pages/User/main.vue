<template>
  <div>
    <div v-for="channel in setList" :key="channel.num">
      <main-page :list="channel" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import MainPage from '~/components/Channel/MainPage.vue'

interface Channel {
  channelId?: string | null,
  title?: string | null,
  channelThumbnail?: string | null,
  videos: any
}

interface Video {
  videoId?: string | null,
  videoTitle?: string | null,
  videoThumbnail?: string | null,
}

export default Vue.extend({
  components: { MainPage },
  computed: {
    setList () {
      const list = []
      const channel: Channel = {
        channelId: 'UCvzGlP9oQwU',
        title: 'Subaru Ch. 大空スバル',
        channelThumbnail: 'https://yt3.ggpht.com/ytc/AAUvwniCgko15I_x5bYWm0G2vnf5hZqD5hLOtLEDw0Na=s176-c-k-c0x00ffffff-no-rj',
        videos: []
      }
      const video: Video = {
        videoId: 'TxhywIY2QHw',
        videoTitle: '【#生スバル​】おはようスバル：FREE TALK【ホロライブ/大空スバル】',
        videoThumbnail: 'https://pbs.twimg.com/media/EwRZFX6UYAcpiuF?format=jpg'
      }
      channel.videos.push(video)
      channel.videos.push(video)
      channel.videos.push(video)
      channel.videos.push(video)
      channel.videos.push(video)
      list.push(channel)
      list.push(channel)
      list.push(channel)
      list.push(channel)
      list.push(channel)
      list.push(channel)
      return list
    }
  }
})
</script>

<style scoped>

</style>
