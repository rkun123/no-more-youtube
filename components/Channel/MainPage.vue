<template>
  <div>
    <div class="channel">
      <div @click="moveChannel(list.youtubeChannelId)" class="channel-title">
        <img class="channel-icon" :src="list.avatar">
        <div>{{ list.name }}</div>
      </div>
      <fa v-if="!list.favorite" class="heart not-fav" :icon="['far', 'heart']" @click="Favo" />
      <fa v-if="list.favorite" class="heart fav" :icon="['far', 'heart']" @click="disFavo" />
    </div>
    <div class="videos">
      <div v-for="video in list.videos" :key="video.num">
        <div class="video-card">
          <video-card :videos="video" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import VideoCard from './VideoCard.vue'
import { ChannelsStore } from '~/store'
import { Channel, favoPayload } from '~/store/channels'

export default Vue.extend({
  components: { VideoCard },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    list: {
      type: Object as PropType<Channel>
    }
  },
  methods: {
    async Favo () {
      // eslint-disable-next-line vue/no-mutating-props
      this.$emit('input', true)
      console.info('Favo', this.list.youtubeChannelId)
      await ChannelsStore.setFavorite({
        youtubeChannelId: this.list.youtubeChannelId,
        favorite: true
      } as favoPayload)
    },
    async disFavo () {
      // eslint-disable-next-line vue/no-mutating-props
      this.$emit('input', false)
      await ChannelsStore.setFavorite({
        youtubeChannelId: this.list.youtubeChannelId,
        favorite: false
      } as favoPayload)
    },
    moveChannel (id: string) {
      this.$router.push({ path: '/channel/' + id })
    }
  }
})
</script>

<style scoped>
.channel{
  display: flex;
  justify-items: center;
  cursor: pointer;
  margin-top: 1rem;
}
.channel .channel-title {
  display: flex;
  align-items: center;
  font-size: 20px;
}
.channel div {
  margin-left: .5em;
  font-weight: 500;
}
.channel .channel-icon {
  height: 50px;
  border-radius: 50%;
}
.channel .heart {
  margin-left: 12px;
  margin-top: 15px;
  font-size: 20px;
  cursor: pointer;
}
.channel .fav {
  color: #DA1725;
}
.channel .fav:hover{
  margin-left: 9px;
  margin-top: 12.5px;
  font-size: 25px;
}
.videos {
  overflow-x: auto;
  white-space: nowrap;
  padding: 5px;
  display: flex;
  scrollbar-width: none;
}
.videos::-webkit-scrollbar {
  display: none;
}
.videos .video-card{
  margin: 5px;
}
</style>
