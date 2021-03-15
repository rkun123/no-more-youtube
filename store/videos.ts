import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import { Video, getSubscriptionCollection } from './channels'
import { UserStore } from '../store'

// 指定されたチャンネルの動画をAPIから取得する。
export async function fetchVideosByChannelFromAPI(channelId: string): Promise<Video[]> {
  const params = {
    part: 'snippet',
    channelId: channelId,
    maxResults: 11, // 本番環境では50にする。
    order: 'date',
    key: String(process.env.YOUTUBE_API_KEY)
  }
  const result = await $axios
    .get('https://www.googleapis.com/youtube/v3/search', { params })

  if(result.status === 401) {
    await UserStore.login()
    return fetchVideosByChannelFromAPI(channelId)
  }

  const videos: Video[] = result.data.items.map((item: any): Video => ({
    videoId: item.id.videoId,
    videoTitle: item.snippet.title,
    videoThumbnail: item.snippet.thumbnails.medium.url
  } as Video))

  await postVideosByChannel(videos, channelId)

  return videos
}

// 指定されたチャンネルの動画をFirestoreから取得する。
export async function fetchVideosByChannel(channelId: string): Promise<Video[]> {
  const subscriptionCollection = await getSubscriptionCollection()
  const videosCollection = await subscriptionCollection!
    .doc(channelId)
    .collection('videos')
  const videoSnapshots = await videosCollection.get()
  console.debug('videosCollection', videoSnapshots.empty)
  if(videoSnapshots.empty) {
    // FirestoreにVideosCollectionがないためAPIで取得。
    console.debug('video is not on Firestore')
    return await fetchVideosByChannelFromAPI(channelId)
  }
  const videos: Video[] = [];
  videoSnapshots.forEach((video) => {
    videos.push(video.data() as Video)
  })
  console.debug(videos)
  return videos
}

// 動画をFirestoreの指定されたチャンネルに送り、更新する。
export async function postVideosByChannel(videos: Video[], channelId: string) {
  console.info('Post videos to firestore')
  const subscriptionCollection = await getSubscriptionCollection()
  const videosCollection = await subscriptionCollection!
    .doc(channelId)
    .collection('videos')

  await videos.forEach(async (video) => {
    console.debug('upload video', video.videoTitle!)
    await videosCollection.doc(video.videoId!).set(video)
  })
}


@Module({
  name: 'videos',
  stateFactory: true,
  namespaced: true
})
export default class Videos extends VuexModule {
  private videos: Video[] = [];

  public get getVideos () {
    return this.videos
  }

  @Mutation
  private pushVideos(items: any) {
    items.map((item: any) => {
      const video: Video = {
        videoId: item.id.videoId,
        videoTitle: item.snippet.title,
        videoThumbnail: item.snippet.thumbnails.medium.url
      }

      const index = this.videos.findIndex((_video) => (
        _video.videoId === video.videoId
      ))

      if(index === -1) this.videos.push(video)
      else this.videos[index] = video
    })
    for (let i = 0; i < items.length; i++) {
      const data = items[i].snippet
      const chan: Video = {
        videoId: items[i].id.videoId,
        videoTitle: data.title,
        videoThumbnail: data.thumbnails.medium.url
      }
      const some = this.videos.some(
        b => b.videoId === chan.videoId
      )
      if (!some) {
        this.videos.push(chan)
      }
    }
    console.log(this.videos)
  }

}