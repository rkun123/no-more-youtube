import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import { db } from '~/plugins/Auth/firebase'
import { UserStore } from '../store'

export type Channel = {
  youtubeChannelId?: string | null,
  name?: string | null,
  avatar?: string | null,
  favorite: boolean,
  videos: any
}

type Video = {
  videoId?: string | null,
  videoTitle?: string | null,
  videoThumbnail?: string | null,
}

type favoPayload = {
  // eslint-disable-next-line camelcase
  youtubeChannelId : string,
  favorite: boolean
}

@Module({
  name: 'channels',
  stateFactory: true,
  namespaced: true
})
export default class Channels extends VuexModule {
  private channels: Channel[] = [];

  public get getchannels () {
    return this.channels
  }

  @Mutation
  private setChannels( channels: Channel[]) {
    this.channels = channels
  }

  @Mutation
  private setList (items: any) {
    for (let i = 0; i < items.length; i++) {
      const data = items[i].snippet
      const chan: Channel = {
        youtubeChannelId: data.resourceId.channelId,
        name: data.title,
        avatar: data.thumbnails.medium.url,
        favorite: false,
        videos: []
      }
      const some = this.channels.some(
        b => b.youtubeChannelId === chan.youtubeChannelId
      )
      if (!some) {
        this.channels.push(chan)
      }
    }
  }

  @Mutation
  private changeFavo (key: favoPayload) {
    const target = this.channels.find((search) => {
      return search.youtubeChannelId === key.youtubeChannelId
    })
    if(target === undefined) return
    target.favorite = key.favorite
    // ここにfavoriteのデータベース通信を記述
  }

  @Mutation
  private pushVideo (items: any) {
    const target = this.channels.find((search) => {
      return search.youtubeChannelId === items[0].snippet.channelId
    })
    if (target) {
      for (let i = 0; i < items.length; i++) {
        const data = items[i].snippet
        const chan: Video = {
          videoId: items[i].id.videoId,
          videoTitle: data.title,
          videoThumbnail: data.thumbnails.medium.url
        }
        const some = (target.videos as Video[]).some(
          b => b.videoId === chan.videoId
        )
        if (!some) {
          target.videos.push(chan)
        }
      }
    }
  }

  @Action
  // eslint-disable-next-line camelcase
  async setVideo (youtubeChannelId: string) {
    const params = {
      part: 'snippet',
      channelId: youtubeChannelId,
      maxResults: 2, // 本番環境では50にする。
      order: 'date'
    }
    await $axios
      .get('https://www.googleapis.com/youtube/v3/search', { params })
      .then((result) => {
        const items = result.data.items
        this.pushVideo(items)
      })
  }

  @Action({ rawError: true})
  async fetchAndApplyFavoToAllChannels() {
    const me = UserStore.getuser
    if(!me.uid) return
    const subscriptionCollections = await db
      .collection('users')
      .doc(me.uid!)
      .collection('subscriptions')

    const newChannels = await Promise.all(this.channels.map(async channel => {
      console.info(channel)
      const subscriptionDoc = await subscriptionCollections.doc(channel.youtubeChannelId!).get()
      if(!subscriptionDoc.exists) return
      return {
        ...channel,
        favorite: subscriptionDoc.data()!.favorite
      }
    }))
    console.info('Channels', newChannels)
    this.setChannels(newChannels)
  }
  @Action({ rawError: true})
  async postSubscribeChannels() {
    const me = UserStore.getuser
    if(!me.uid) return
    const subscriptionCollections = await db
      .collection('users')
      .doc(me.uid!)
      .collection('subscriptions')

    await this.channels.forEach(async (channel) => {
      subscriptionCollections.doc(channel.youtubeChannelId!).set( channel)
    })
  }

  @Action({ rawError: true })
  setFavo (payload: favoPayload) {
    this.changeFavo(payload)
  }

  @Action({ rawError: true })
  async fetchSubscriptions () {
    console.info(UserStore.getuser.accessToken)
    await $axios.setHeader(
      'Authorization',
      'Bearer ' +
        //'ya29.a0AfH6SMCSgchlgNftjerF56U0LfvBXuhrUqcjIY--MNdLCkD_dF4D0hT-_c6i4cXD0T-3IEaDIqV_brh50uwk7ks_OMHDNHatsfgSllX0Rbm4o7oKRgNIPQs7L_JGQ6epvu-929EZRIHviLtRKzBJIJWqSeVHSw'
        UserStore.getuser.accessToken
    )
    const params = {
      part: 'snippet',
      mine: true,
      maxResults: 2, // 本番環境では50にする。
      key: String(process.env.YOUTUBE_API_KEY)
    }
    $axios
      .get('https://www.googleapis.com/youtube/v3/subscriptions', { params })
      .then((result) => {
        const items = result.data.items
        this.setList(items)
      })
      .then(() => {
        this.fetchAndApplyFavoToAllChannels()
        this.postSubscribeChannels()
      })
  }
}
