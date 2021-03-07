import Vue from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { config, library } from '@fortawesome/fontawesome-svg-core'
import { faShareSquare } from '@fortawesome/free-solid-svg-icons'
import { faHandPointRight } from '@fortawesome/free-regular-svg-icons'
import { faYoutube } from '@fortawesome/free-brands-svg-icons'

// nuxt.config.tsでCSSファイルを追加
config.autoAddCss = false

// 利用するアイコンを配列に追加
const solidIcons = [faShareSquare]
const regularIcons = [faHandPointRight]
const bransIcons = [faYoutube]

// 利用するアイコンをlibraryに追加
solidIcons.forEach(icon => library.add(icon))
regularIcons.forEach(icon => library.add(icon))
bransIcons.forEach(icon => library.add(icon))

// グローバルコンポーネントに登録
Vue.component('fa', FontAwesomeIcon)
