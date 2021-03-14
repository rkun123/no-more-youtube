import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'

type Channel = {
  // eslint-disable-next-line camelcase
  youtube_channel_id?: string | null,
  name?: string | null,
  avatar?: string | null,
  favorite: boolean,
  videos: any
}

type favoPayload = {
  // eslint-disable-next-line camelcase
  youtube_channel_id : string,
  favorite: boolean
}

@Module({
  name: 'channels',
  stateFactory: true,
  namespaced: true
})
export default class Channels extends VuexModule {
  private channel: Channel[] = [];

  public get getchannels () {
    return this.channel
  }

  @Mutation
  private setList (items: any) {
    for (let i = 0; i < items.length; i++) {
      const data = items[i].snippet
      const chan: Channel = {
        youtube_channel_id: data.resourceId.channelId,
        name: data.title,
        avatar: data.thumbnails.medium.url,
        favorite: false,
        videos: []
      }
      const some = this.channel.some(
        b => b.youtube_channel_id === chan.youtube_channel_id
      )
      if (!some) {
        this.channel.push(chan)
      }
    }
  }

  @Mutation
  private changeFavo (key: favoPayload) {
    const target = this.channel.find((search) => {
      return search.youtube_channel_id === key.youtube_channel_id
    })
    target.favorite = key.favorite
    // ここにfavoriteのデータベース通信を記述
  }

  @Action({ rawError: true })
  setFavo (payload: favoPayload) {
    this.changeFavo(payload)
  }

  @Action({ rawError: true })
  async setChannels () {
    await $axios.setHeader(
      'Authorization',
      'Bearer ' +
        'ya29.a0AfH6SMAdcXfjG_qhDrEZwZranj2LdaZBJngjofSYABD5snXhvj9bk31XrSZtxCjY4bGAUmFBt_BC6IGfkF5g2FIUx7WAg9QZjc5VcQ1-gyA3UKLih3GjZTuoRhmrxTzErT0CU3AXmBCNwYFJNXqRQVDMoGS2eg'
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
  }
}
