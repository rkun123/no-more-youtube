<template>
  <div class="controller-container">
    <div class="m5stack" :style="getAngleStyle + getUnConnectedStyle">
      <div class="speed">
      {{ getSpeed }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { ControllerStore } from '~/store'
import Controller from '~/store/controller'
export default Vue.extend({
  name: 'ControllerStatus',
  computed: {
    getAngleStyle() {
      return `transform: rotateZ(${ControllerStore.getAngle}deg);`
    },
    getSpeed() {
      return ControllerStore.getSpeed
    },
    getIsConnected() {
      return ControllerStore.getConnected
    },
    getUnConnectedStyle() {
      if(this.getIsConnected) return ''
      return 'opacity: 0.3;'
    }
  },
})
</script>
<style scoped>
.controller-container {
}
.m5stack {
  font-size: 20px;
  color: white;
  width: 150px;
  height: 150px;
  background-image: url('~/assets/m5stack.png');
  background-size: cover;
}
.m5stack .speed {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 60px;
  transform: translate(-50%, -60%);
}
</style>