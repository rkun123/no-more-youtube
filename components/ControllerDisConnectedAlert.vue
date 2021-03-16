<template>
  <div class="controller-alert">
    <h1>コントローラーが切断されました．</h1>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'ControllerDisConnectedAlert'
})
</script>
<style scoped>
.controller-alert {
  position: fixed;
  padding: 20px;
  box-shadow: 5px 5px black;
}
</style>