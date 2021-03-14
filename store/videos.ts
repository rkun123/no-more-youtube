import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'

type Video = {
  videoId?: string | null,
  videoTitle?: string | null,
  videoThumbnail?: string | null,
}

@Module({
  name: 'videos',
  stateFactory: true,
  namespaced: true
})
export default class Videos extends VuexModule {
  private video: Video[] = [];

  public get getVideos () {
    return this.video
  }

  @Mutation
  private pushVideo (items: any) {
    for (let i = 0; i < items.length; i++) {
      const data = items[i].snippet
      const chan: Video = {
        videoId: items[i].id.videoId,
        videoTitle: data.title,
        videoThumbnail: data.thumbnails.medium.url
      }
      const some = this.video.some(
        b => b.videoId === chan.videoId
      )
      if (!some) {
        this.video.push(chan)
      }
    }
    console.log(this.video)
  }

  @Action({ rawError: true })
  async setVideos (id: string) {
    const params = {
      part: 'snippet',
      channelId: id,
      maxResults: 11, // 本番環境では50にする。
      order: 'date',
      key: String(process.env.YOUTUBE_API_KEY)
    }
    await $axios
      .get('https://www.googleapis.com/youtube/v3/search', { params })
      .then((result) => {
        const items = result.data.items
        this.pushVideo(items)
        console.log(result)
      })
  }
}
