<template>
  <div>
    <video-player :video-id="$route.params.id" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import VideoPlayer from '~/components/Video/VideoPlayer.vue'
export default Vue.extend({
  components: { VideoPlayer }
})
</script>
