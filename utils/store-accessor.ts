/* eslint-disable import/no-mutable-exports */
import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import User from '~/store/user'
import Channels from '~/store/channels'

let UserStore: User
let ChannelsStore: Channels
function initialiseStores (store: Store<any>): void {
  UserStore = getModule(User, store)
  ChannelsStore = getModule(Channels, store)
}

export { initialiseStores, UserStore, ChannelsStore }
