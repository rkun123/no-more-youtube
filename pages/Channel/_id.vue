<template>
  <div>
    <div class="channel-header">
      <img :src="get_channels.avatar">
      <div class="name">{{ get_channels.name }}</div>
      <div class="favo">
        <fa v-if="!get_channels.favorite" class="heart not-fav" :icon="['far', 'heart']" />
        <fa v-if="get_channels.favorite" class="heart fav" :icon="['far', 'heart']" />
      </div>
    </div>
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
import { ChannelsStore } from '~/store'
export default Vue.extend({
  components: { VideoCard },
  computed: {
    get_channels () {
      const channeis = ChannelsStore.getchannels
      const target = channeis.find((search) => {
        return search.youtubeChannelId === this.$route.params.id
      })
      if (target === undefined) { return }
      return target
    },
    get_videos () {
      const channeis = ChannelsStore.getchannels
      const target = channeis.find((search) => {
        return search.youtubeChannelId === this.$route.params.id
      })
      if (target === undefined) { return }
      return target.videos
    }
  }
})
</script>

<style scoped>
.channel-header{
  margin-top: 20px;
  display: flex;
  width: 100%;
}
.channel-header img {
  border-radius: 50%;
  height: 70px;
}
.channel-header .name {
  line-height: 70px;
  font-size: 25px;
  font-weight: 500;
  margin-left: 20px;
}
.favo {
  margin-left: 10px;
  margin-top: 20px;
  font-size: 25px;
}
.fav {
  color: #DA1725;
}
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
