<template>
  <div class="navbar-container">
    <play-time-bar class="bar"/>
    <nuxt-link to="/settings">
      <fa class="cog" :icon="['fas', 'cog']" />
    </nuxt-link>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import PlayTimeBar from './PlayTimeBar.vue'

export default Vue.extend({
  name: 'Navbar',
  components: {
    PlayTimeBar
  },

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