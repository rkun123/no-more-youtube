<template>
  <div>
    <div class="channel">
      <img class="icon" :src="list.channelThumbnail">
      <p>{{ list.title }}</p>
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
  videos: any
}

export default Vue.extend({
  components: { VideoCard },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    list: {
      type: Object as PropType<Channel>
    }
  }
})
</script>

<style scoped>
.channel{
  display: flex;
}
.channel p {
  line-height: 50px;
  padding-left: 5px;
}
.icon {
  height: 50px;
  border-radius: 50%;
}
.videos {
  overflow-x: auto;
  white-space: nowrap;
  padding: 5px;
  display: flex;
}
</style>
