<template>
  <div class="root">
    <h1 class="title has-text-light">認証中...</h1>
    <div class="spin sk-bounce">
      <div class="sk-bounce-dot" />
      <div class="sk-bounce-dot" />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import 'spinkit/spinkit.css'

export default Vue.extend({})
</script>
<style scoped>
.root {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  --sk-color: #00d1b2;
}
</style>
