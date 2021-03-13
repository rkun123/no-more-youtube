<template>
  <div>
    <div class="channel">
      <img class="icon" :src="list.channelThumbnail">
      <p>{{ list.title }}</p>
      <fa v-if="!list.favorite" class="heart not-fav" :icon="['far', 'heart']" @click="Favo" />
      <fa v-if="list.favorite" class="heart fav" :icon="['far', 'heart']" @click="disFavo" />
    </div>
    <div class="videos">
      <div v-for="video in list.videos" :key="video.num">
        <video-card :videos="video" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import VideoCard from './VideoCard.vue'

interface Channel {
  channelId?: string | null,
  title?: string | null,
  channelThumbnail?: string | null,
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
  color: #DA1725;
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
</style>
