import { faTheRedYeti } from '@fortawesome/free-brands-svg-icons';
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import firebase, { db } from '~/plugins/Auth/firebase'
import { ChannelsStore } from '../store'

export type User = {
  uid?: string | null,
  userName?: string | null,
  userIcon?: string | null,
  userEmail?: string | null,
  accessToken?: string,
  limitPlayMinutes?: number,
  currentPlayedMinutes?: number
  latestPlayedMinutesUpdatedAt?: number,
  latestlimitPlayMinutesUpdatedAt?: boolean,
}

@Module({
  name: 'user',
  stateFactory: true,
  namespaced: true
})
export default class Users extends VuexModule {
  private user: User ={};

  public get getuser () {
    return this.user
  }

  public get getMyUID() {
    return this.user.uid!
  }

  public get getPlayedTimePercent() {
    return this.user.currentPlayedMinutes! / this.user.limitPlayMinutes! * 100
  }

  public get getPlayedTimeString() {
    const restMinutes = this.user.limitPlayMinutes! - this.user.currentPlayedMinutes!
    if( restMinutes < 0 ) return '00:00'
    const hours = Math.floor(restMinutes / 60)
    const minutes = Math.floor(restMinutes % 60) 
    return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`
  }

  public get getIsRemainPlayTime() {
    console.info('check getIsRemainPlayTime')
    if(this.user.latestPlayedMinutesUpdatedAt === undefined) return false
    if(this.getPlayedTimePercent > 100) {
    // 前回の更新が今日の場合，視聴可能時間を超過していたらfalseを返す．
      console.info('Play minutes exceeded!!!')
      return false
    }
    return true
  }

  public get getLimitPlayMinutes () {
    return this.user.limitPlayMinutes
  }

  public get ableChange () {
    return this.user.latestlimitPlayMinutesUpdatedAt
  }

  @Mutation set (data: User) {
    this.user = data
  }

  @Mutation addCurrentPlayedMinutes(minutes: number) {
    this.user.currentPlayedMinutes! += minutes
    this.user.latestPlayedMinutesUpdatedAt = Date.now()
  }

  @Mutation
  resetPlayedMinutes () {
    this.user.currentPlayedMinutes = 0
    this.user.latestPlayedMinutesUpdatedAt = Date.now()
  }

  @Mutation
  resetLimitTimes () {
    this.user.latestlimitPlayMinutesUpdatedAt = false
  }

  @Mutation
  setLimitTime (num:Number) {
    this.user.limitPlayMinutes! = Number(num)
    this.user.latestlimitPlayMinutesUpdatedAt = true
  }

  @Action({ rawError: true })
  async changeLimit (num:Number) {
    if (!this.user.latestlimitPlayMinutesUpdatedAt) {
      if (confirm('一日に一度しか変更できませんがよろしいですか？')) {
        await this.setLimitTime(num)
        await this.postUser()
      }
    }
  }

  @Action({ rawError: true })
  async postUser () {
    console.info('postUser', this.user)
    const doc = db.collection('users').doc(this.user.uid!)
    const snapshot = await doc.get()
    if(snapshot.exists) {
      doc.update(this.user)
    } else {
      doc.set(this.user)
    }
  }

  @Action({ rawError: true })
  async fetchUser(uid: string) {
    console.info('fetchUser')
    const userDoc = await db.collection('users').doc(uid).get()
    if(userDoc.exists) {
      this.set(userDoc.data() as User)
    }
  }

  @Action({ rawError: true})
  async postPlayedMinutes(minutes: number) {
    console.info('getIsRemainPlayTime', this.getIsRemainPlayTime)
    console.info(this.getPlayedTimePercent, '%')

    // すでに本日分の再生時間が終了している場合は時間追加しない
    if(!this.getIsRemainPlayTime) return

    this.addCurrentPlayedMinutes(minutes)
    await this.postUser()
  }

  @Action({ rawError: true })
  async fetchUserTimeLimitations(uid: string) {
    console.info('fetchUserTimeLimitations')
    const userDoc = await db.collection('users').doc(uid).get()
    if( userDoc.exists
        && userDoc.data()!.limitPlayMinutes !== undefined
        && userDoc.data()!.currentPlayedMinutes !== undefined
        && userDoc.data()!.latestPlayedMinutesUpdatedAt !== undefined
    ) {
      this.set({
        ...this.user,
        limitPlayMinutes: userDoc.data()!.limitPlayMinutes,
        currentPlayedMinutes: userDoc.data()!.currentPlayedMinutes,
        latestPlayedMinutesUpdatedAt: userDoc.data()!.latestPlayedMinutesUpdatedAt,
        latestlimitPlayMinutesUpdatedAt: userDoc.data()!.latestlimitPlayMinutesUpdatedAt
      })

      // 前回の更新が昨日以前であれば再生時間のリセット
      const now = new Date()
      const todayMidnight = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0).getTime()
      if (this.user.latestPlayedMinutesUpdatedAt! < todayMidnight) {
        // 前回の更新が昨日以前の場合，リセットしてtrueを返す．
        console.info('latest update at before yesterday -> reset playMinutes.')
        this.resetPlayedMinutes()
        this.resetLimitTimes()
      }
    } else {
      // Firestoreに制限時間のデータが存在しないため，デフォルト値でStoreに格納．
      console.info('use default limitation')
      this.set({
        ...this.user,
        limitPlayMinutes: 60,
        currentPlayedMinutes: 0,
        latestPlayedMinutesUpdatedAt: Date.now(),
        latestlimitPlayMinutesUpdatedAt: false
      })
    }
  }

  // Firestoreからアクセストークンを取得する．
  @Action({ rawError: true })
  async fetchAccessToken (uid: string) {
    const userDoc = await db.collection('users').doc(uid).get()
    if (userDoc.exists) {
      this.set({
        ...this.user,
        accessToken: userDoc.data()!.accessToken
      })
    }
  }

  @Action({ rawError: true })
  async login () {
    // eslint-disable-next-line no-console
    console.log('login action')
    console.log(document.location.protocol)
    const provider = new firebase.auth.GoogleAuthProvider()
    provider.addScope('https://www.googleapis.com/auth/youtube.readonly')
    try {
      const result = await firebase
        .auth()
        .signInWithPopup(provider)
      const credential = result.credential as firebase.auth.OAuthCredential
      const currentUser = result.user!
      const userdata: User = {
        uid: currentUser.uid,
        userName: currentUser.displayName,
        userIcon: currentUser.photoURL,
        userEmail: currentUser.email,
        accessToken: credential.accessToken
      }
      this.set(userdata)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('error : ' + e.code)
    }
  }

  // eslint-disable-next-line require-await
  @Action({ rawError: true })
  auth () {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (currentUser) => {
      if (currentUser === null) {
        console.info('ReLogging in...')
        unsubscribe()
        await this.login()
      } else {
        console.info('Already logged in...')
        const user: User = {
          uid: currentUser.uid,
          userName: currentUser.displayName,
          userIcon: currentUser.photoURL,
          userEmail: currentUser.email,
          accessToken: ''
        }
        this.set(user)
        await this.fetchAccessToken(user.uid!)
      }
      console.info('Auth completed')
      // Firestoreの制限時間，現在の再生時間を取得する．
      await this.fetchUserTimeLimitations(this.user.uid!)

      await this.postUser()

      // 認証完了

      await this.initAfterAuth()
    })
  }

  // 認証完了時(this.user格納完了後)に呼び出されるアクション
  @Action({ rawError: true })
  async initAfterAuth () {
    console.info('init...')
    // 自分の登録チャンネルを取得
    await ChannelsStore.fetchSubscriptions()
  }
}
// コンポーネントでの使い方
// import { UserStore } from '~/store'
// export default Vue.extend({
//   methods: {
//     login () {
//       UserStore.login()
//     },
//     getData () {
//       const user = UserStore.getuser
//       console.log(user)
//     }
//   }
// })
