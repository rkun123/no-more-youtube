import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import firebase from 'firebase'
import { UserStore } from '../store'
import { fetchVideosByChannelFromAPI, postVideosByChannel } from './videos'
import { $axios } from '~/utils/api'
import { db } from '~/plugins/Auth/firebase'

export type Video = {
  videoId: string,
  videoTitle: string,
  videoThumbnail: string,
}

export type Channel = {
  youtubeChannelId: string,
  name: string,
  avatar: string,
  favorite: boolean,
  videos?: Video[]
}

export type favoPayload = {
  youtubeChannelId : string,
  favorite: boolean
}

export async function getSubscriptionCollection (): Promise<firebase.firestore.CollectionReference<firebase.firestore.DocumentData>> {
  console.info('getSubscriptionCollection')
  const me = UserStore.getuser
  const collection = db
    .collection('users')
    .doc(me.uid!)
    .collection('subscriptions')
  console.info(collection)
  console.info(await collection.get())
  return collection
}

async function fetchSubscriptionsFromFS () {
  console.info('fetchSubscriptionsFromFS')
  const collection = await getSubscriptionCollection()
  const snapshot = await collection.get()
  const channelsWithoutVideos = snapshot.docs.map((item: any) => ({
    youtubeChannelId: item.youtubeChannelId,
    name: item.name,
    avatar: item.avatar,
    favorite: item.favorite
  } as Channel))

  // fetch Videos for all channels from FS
  const channels = Promise.all(channelsWithoutVideos.map(async (channel) => {
    const snapshot = await collection
      .doc(channel.youtubeChannelId)
      .collection('videos')
      .get()
    const videos = snapshot.docs.map((item: any) => ({
      videoId: item.videoId,
      videoTitle: item.videoTitle,
      videoThumbnail: item.videoThumbnail
    } as Video))
    return ({
      ...channel,
      videos
    } as Channel)
  }))

  return channels
}

async function fetchSubscriptionsFromAPI () {
  console.info('fetchSubscriptionsFromAPI')
  await $axios.setHeader(
    'Authorization',
    'Bearer ' + UserStore.getuser.accessToken
  )
  const params = {
    part: 'snippet',
    mine: true,
    maxResults: 2, // 本番環境では50にする。
    key: String(process.env.YOUTUBE_API_KEY)
  }
  const result = await $axios
    .get('https://www.googleapis.com/youtube/v3/subscriptions', { params })
  const items = result.data.items as any[]
  const channelsWithoutVideos = items.map((item: any): Channel => {
    const data = item.snippet
    return ({
      youtubeChannelId: data.resourceId.channelId,
      name: data.title,
      avatar: data.thumbnails.medium.url,
      favorite: false
    } as Channel)
  })

  // 各Channelの動画を取得
  const channels = await Promise.all(channelsWithoutVideos.map(async (channel: Channel) => {
    const videos = await fetchVideosByChannelFromAPI(channel.youtubeChannelId)
    return {
      ...channel,
      videos
    }
  }))

  return channels
}

// 指定されたチャンネルのFavoriteをFSから取得
async function fetchFavByChannel (youtubeChannelId: string) {
  console.info('fetchFavByChannel')
  const collection = await getSubscriptionCollection()
  const doc = await collection.doc(youtubeChannelId)
  const channel = (await doc.get()).data()

  if (channel) {
    return channel.favorite as boolean
  }
  return false
}

// 渡されたチャンネルの情報をFSへ送信
async function postSubscriptions (channels: Channel[]) {
  console.info('postSubscriptions')
  const subscriptionCollections = await getSubscriptionCollection()
  channels.forEach((channel) => {
    const channelWithoutVideos = {
      ...channel,
      videos: []
    } as Channel
    console.info('channelWithoutVideos', channelWithoutVideos)
    subscriptionCollections.doc(channel.youtubeChannelId).set(channelWithoutVideos)
    postVideosByChannel(channel.videos!, channel.youtubeChannelId)
  })
}

// --- StoreModule ---

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

  public get getChannelsSortedByFav () {
    const favChannels = this.channels.filter(channel => (channel.favorite === true))
    const notFavChannels = this.channels.filter(channel => (channel.favorite === false))
    return favChannels.concat(notFavChannels)
  }

  @Mutation
  private setChannels (channels: Channel[]) {
    this.channels = channels
  }

  @Mutation
  private _setFavorite (state: boolean, youtubeChannelId: string) {
    const target = this.channels.find((search) => {
      return search.youtubeChannelId === youtubeChannelId
    })
    if (target === undefined) { return }
    target.favorite = state
  }

  // 常に取得に利用するアクション
  @Action({ rawError: true })
  async fetchSubscriptions () {
    const collections = await getSubscriptionCollection()
    const snapshot = await collections.get()
    let channels: Channel[] = []
    if (!snapshot.empty) {
      // FirestoreにSubscriptionsが存在する．
      channels = await fetchSubscriptionsFromFS()
    } else {
      console.warn('fetch API')
      // FirestoreにSubscriptionsが存在しない．
      channels = await fetchSubscriptionsFromAPI()
    }
    this.setChannels(channels)
    await postSubscriptions(this.channels)
  }

  // FirestoreにSubscriptionsがある状態で強制的に更新するアクション`
  @Action({ rawError: true })
  async updateSubscriptions () {
    const _channels: Channel[] = await fetchSubscriptionsFromAPI()

    // Favorite情報をFirestoreから取得し適用
    const channels = await Promise.all(_channels.map(async (channel) => {
      const favorite = await fetchFavByChannel(channel.youtubeChannelId!)
      return {
        ...channel,
        favorite
      } as Channel
    }))

    this.setChannels(channels)
  }

  @Action({ rawError: true })
  async setFavorite (state: boolean, youtubeChannelId: string) {
    this._setFavorite(state, youtubeChannelId)
    await postSubscriptions(this.channels)
  }
}
