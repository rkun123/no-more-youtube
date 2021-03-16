<template>
  <div class="controller-setting">
    <h3>コントローラーのIPアドレスを入力ください．</h3>
    <div>
      <input type="text" class="ip-box" @change="setControllerUrl">
      <button class="button" @click="connect">Connect</button>
      <div v-if="isConnected">
        <h3>Connected!!</h3>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { ControllerStore } from '~/store'
export default Vue.extend({
  name: 'ControllerSetting',
  computed: {
    isConnected() {
      return ControllerStore.getConnected
    }
  },
  methods: {
    setControllerUrl(e: InputEvent) {
      // @ts-ignore
      ControllerStore.setControllerUrl(`ws://${e.target.value}:81`)
    },
    connect() {
      ControllerStore.subscribe()
    }
  },
  watch: {
    isConnected(_new, old) {
      if(_new === true){
        console.info('Connected controller!!')
        setTimeout(() => {
          this.$router.push('/user/main')
        }, 1000)
      }
    }
  }
})
</script>
<style scoped>
.controller-setting {
  margin-top: 1rem;
}
.ip-box {
}
.button {
  height: 2rem;
}
</style>