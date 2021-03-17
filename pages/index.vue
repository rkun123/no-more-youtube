<template>
  <div class="root">
    <div>
      <div class="title-container">
        <img :src="require('~/assets/m5stack.png')" class="logo">
        <h1 class="title">
        no-more-youtube
        </h1>
      </div>
      <p class="msg">
        あなたの時間を溶かさないYouTubeプレイヤー
      </p>
      <controller-setting class="setting"/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ControllerSetting from '~/components/ControllerSetting.vue'

export default Vue.extend({
  name: 'index',
  components: {
    ControllerSetting
  }
})
</script>
<style scoped>
.title-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 4em;
  margin-top: 2em;
  margin-bottom: .5em;
}
.msg {
  text-align: center;
  margin-bottom: 2em;
  background-color: none;
}
.logo {
  width: 1em;
  height: auto;
  margin-right: .5em;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}

.root{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
