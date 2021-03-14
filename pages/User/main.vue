<template>
  <div>
    <div v-for="channel in getChannels" :key="channel.youtubeChannelId">
      <main-page :list="channel" @input="check(channel.youtubeChannelId,$event)" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import MainPage from '~/components/Channel/MainPage.vue'
import { ChannelsStore } from '~/store'

export default Vue.extend({
  components: { MainPage },
  data () {
    return {
      params: {
        part: 'snippet',
        mine: true,
        maxResults: 50,
        key: ''
      }
    }
  },
  computed: {
    getChannels () {
      return ChannelsStore.getchannels
    }
  },
  methods: {
    check (id: string, event: boolean) {
      const payload = {
        youtubeChannelId: id,
        favorite: event
      }
      ChannelsStore.setFavo(payload)
    }
  }
})
</script>

<style scoped>

</style>
