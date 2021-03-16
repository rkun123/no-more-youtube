<template>
  <div class="root">
    <div>
      <h1 class="title">
        brachio-cup-youtube
      </h1>
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
.title {
  display: block;
  font-weight: 300;
  color: #35495e;
  letter-spacing: 1px;
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
