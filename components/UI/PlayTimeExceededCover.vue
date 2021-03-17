<template>
  <div class="modal is-active is-clipped">
    <div class="modal-background" />
    <div class="modal-content">
      <img :src="require('~/assets/thinking.png')" class="thinking-face">
      <h1 class="title has-text-danger">
        本日の再生時間を超過しました．
      </h1>
      <p class="has-text-light">
        もうYouTubeを見ずに，今日やることに取り組みましょう！！
      </p>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({})
</script>
<style scoped>
.root {
  position: absolute;
  width: 100%;
  height: 100%;
}
.thinking-face {
  margin-bottom: 1em;
}
.modal-content {
  text-align: center;
  overflow: hidden;
}
</style>