<template>
  <div :class="IsOpen">
    <div class="contents">
      <fa class="forward minus pict" :icon="['fas', 'forward']" @click="changeLimit(-60)" />
      <fa class="play minus pict" :icon="['fas', 'play']" @click="changeLimit(-30)" />
      <span class="times">
        <fa class="watch pict" :icon="['fas', 'stopwatch']" />
        <div>{{ display_minutes }}</div>
      </span>
      <fa class="play plus pict" :icon="['fas', 'play']" @click="changeLimit(30)" />
      <fa class="forward plus pict" :icon="['fas', 'forward']" @click="changeLimit(60)" />
      <fa class="check pict" :icon="['far', 'check-circle']" @click="setLimit" />
    </div>
    <div v-if="isOpen" class="wrap" @click="$emit('input', false)"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { UserStore } from '~/store'
export default Vue.extend({
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      min: 0
    }
  },
  computed: {
    IsOpen () {
      let re = 'root'
      if (this.isOpen) {
        re += ' isopen'
      }
      return re
    },
    get_limitTime () {
      return UserStore.getLimitPlayMinutes
    },
    display_minutes () {
      const hours = Math.floor(this.min / 60)
      const minutes = Math.floor(this.min % 60)
      return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`
    },
    check_able () {
      return UserStore.disableChange
    }
  },
  watch: {
    get_limitTime (newState, oldState) {
      this.min = newState
      console.log(oldState)
    },
    isOpen () {
      this.min = Number(UserStore.getLimitPlayMinutes)
    }
  },
  methods: {
    changeLimit (value: Number) {
      this.min += Number(value)
    },
    setLimit () {
      if (!this.check_able) {
        if (Number(this.get_limitTime) === this.min) {
          alert('値が変更されていません。')
        } else if (Number(this.get_limitTime) >= this.min) {
          if (confirm('値が少なく設定されますがよろしいですか？')) {
            UserStore.changeLimit(this.min)
            this.$emit('input', false)
          }
        } else if (this.min <= 0) {
          alert('0または負の値は設定できません。')
        } else {
          UserStore.changeLimit(this.min)
          this.$emit('input', false)
        }
      } else {
        alert('1日の変更回数を超えています。')
      }
    }
  }
})
</script>

<style scoped>
.root {
  position: fixed;
  top: 10px;
  right: -20px;
  width: 0;
  border-radius: 22.5px;
  background-color:#fff;
  padding: 5px;
  transition: all 0.5s ease;
  /* border: 1px solid #35495e; */
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 10px;
}
.isopen {
  width: 400px;
}
.contents {
  z-index: 10;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 0px;
  margin-left: 20px;
  margin-right: 10px;
  margin-bottom: 0px;
}
.times {
  border: 1px solid #35495e;
  border-radius: 15px;
  height: 30px;
  width: 100px;
  display: flex;
}
.times div {
  line-height: 30px;
}
.pict {
  margin-left: 10px;
  margin-right: 10px;
  cursor: pointer;
}
.watch {
  font-size: 20px;
  margin-top: 5px;
  line-height: 30px;
}
.forward {
  font-size: 35px;
}
.play {
  font-size: 28px;
}
.minus {
  transform: rotate(180deg)
}
.check {
  font-size: 20px;
}
.wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9;
}
</style>
