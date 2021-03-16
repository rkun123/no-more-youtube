/* eslint-disable import/no-mutable-exports */
import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import User from '~/store/user'
import Channels from '~/store/channels'
import Videos from '~/store/videos'
import Controller from '~/store/controller'
import UI from '~/store/ui'

let UserStore: User
let ChannelsStore: Channels
let VideosStore: Videos
let ControllerStore: Controller
let UIStore: UI
function initialiseStores (store: Store<any>): void {
  UserStore = getModule(User, store)
  ChannelsStore = getModule(Channels, store)
  VideosStore = getModule(Videos, store)
  ControllerStore = getModule(Controller, store)
  UIStore = getModule(UI, store)
}

export { initialiseStores, UserStore, ChannelsStore, VideosStore, ControllerStore, UIStore }
