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

type Video = {
  videoId?: string | null,
  videoTitle?: string | null,
  videoThumbnail?: string | null,
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

  @Mutation
  private pushVideo (items: any) {
    const target = this.channel.find((search) => {
      return search.youtube_channel_id === items[0].snippet.channelId
    })
    if (target) {
      for (let i = 0; i < items.length; i++) {
        const data = items[i].snippet
        const chan: Video = {
          videoId: items[i].id.videoId,
          videoTitle: data.title,
          videoThumbnail: data.thumbnails.medium.url
        }
        const some = target.videos.some(
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
  async setVideo (youtube_channel_id: string) {
    const params = {
      part: 'snippet',
      channelId: youtube_channel_id,
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

  @Action({ rawError: true })
  setFavo (payload: favoPayload) {
    this.changeFavo(payload)
  }

  @Action({ rawError: true })
  async setChannels () {
    await $axios.setHeader(
      'Authorization',
      'Bearer ' +
        'ya29.a0AfH6SMCSgchlgNftjerF56U0LfvBXuhrUqcjIY--MNdLCkD_dF4D0hT-_c6i4cXD0T-3IEaDIqV_brh50uwk7ks_OMHDNHatsfgSllX0Rbm4o7oKRgNIPQs7L_JGQ6epvu-929EZRIHviLtRKzBJIJWqSeVHSw'
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
