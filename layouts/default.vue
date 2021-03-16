<template>
  <div class="main-container-outer">
    <div class="main-container">
      <navbar />
      <Nuxt />
    </div>
    <transition name="fade">
      <authentication-pending-cover v-if="isAuthPending" class="pending-cover has-background-dark" />
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { UserStore, UIStore } from '~/store'
import Navbar from '~/components/Navbar.vue'
import AuthenticationPendingCover from '~/components/UI/AuthenticationPendingCover.vue'

export default Vue.extend({
  components: {
    Navbar,
    AuthenticationPendingCover
  },
  computed: {
    isAuthPending () {
      return UIStore.getAuthPending
    }
  },
  async created () {
    await UserStore.auth()
  }
})
</script>
<style scoped>
.main-container-outer {
  display: flex;
  justify-content: center;
}
.main-container {
  font-family:
    'Quicksand',
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
}

@media screen and (min-width: 1280px) {
  .main-container {
    width: 1280px;
  }
}

@media screen and (max-width: 1280px) {
  .main-container {
    width: 100%;
  }
}

html {
  font-family:
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
.pending-cover {
  position: fixed;
  width: 100%;
  height: 100%;
}
.fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
