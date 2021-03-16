<template>
  <div class="navbar-container">
    <play-time-bar class="bar" />
    <fa class="cog" :icon="['fas', 'cog']" @click="open=!open" />
    <setting :is-open="open" class="bar" @input="open = $event"/>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import PlayTimeBar from './PlayTimeBar.vue'
import Setting from './Setting/setting.vue'

export default Vue.extend({
  name: 'Navbar',
  components: {
    PlayTimeBar,
    Setting
  },
  data () {
    return {
      open: false
    }
  }
})
</script>
<style scoped>
.navbar-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
}
.bar {
  flex-grow: 3;
}
.cog {
  font-size: 30px;
  transition: transform 0.2s ease-out;
  color: #000000;
  cursor: pointer;
}
.cog:hover {
  transform: rotate(30deg) scale(1.2);
}
</style>
