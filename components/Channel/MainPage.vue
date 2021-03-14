<template>
  <div>
    <div class="channel">
      <img class="icon" :src="list.avatar">
      <p>{{ list.name }}</p>
      <fa v-if="!list.favorite" class="heart not-fav" :icon="['far', 'heart']" @click="Favo" />
      <fa v-if="list.favorite" class="heart fav" :icon="['far', 'heart']" @click="disFavo" />
    </div>
    <div class="videos">
      <div v-for="video in list.videos" :key="video.num">
        <div class="card">
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

interface Channel {
  // eslint-disable-next-line camelcase
  youtube_channel_id?: string | null,
  name?: string | null,
  avatar?: string | null,
  favorite: boolean,
  videos: any
}

export default Vue.extend({
  components: { VideoCard },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    list: {
      type: Object as PropType<Channel>
    }
  },
  created () {
    console.log('videoset')
    ChannelsStore.setVideo(String(this.list.youtube_channel_id))
  },
  methods: {
    Favo () {
      // eslint-disable-next-line vue/no-mutating-props
      this.$emit('input', true)
    },
    disFavo () {
      // eslint-disable-next-line vue/no-mutating-props
      this.$emit('input', false)
    }
  }
})
</script>

<style scoped>
.channel{
  display: flex;
  justify-items: center;
}
.channel p {
  line-height: 50px;
  padding-left: 5px;
}
.channel .icon {
  height: 50px;
  border-radius: 50%;
}
.channel .heart {
  margin-left: 10px;
  margin-top: 15px;
  font-size: 20px;
}
.channel .not-fav:hover {
  cursor: pointer;
}
.channel .fav {
  color: #DA1725;
}
.channel .fav:hover{
  margin-left: 7.5px;
  margin-top: 12.5px;
  font-size: 25px;
}
.videos {
  overflow-x: auto;
  white-space: nowrap;
  padding: 5px;
  display: flex;
}
.videos .card{
  margin: 5px;
}
</style>
