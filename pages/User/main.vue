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
      return ChannelsStore.getChannelsSortedByFav
    }
  },
  methods: {
    check (id: string, event: boolean) {
      ChannelsStore.setFavorite(event, id)
    }
  }
})
</script>

<style scoped>

</style>
