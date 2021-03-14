import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import firebase, { db } from '~/plugins/Auth/firebase.ts'
import { ChannelsStore } from '../store'
import Channels from './channels'

export type User = {
  uid?: string | null,
  userName?: string | null,
  userIcon?: string | null,
  userEmail?: string | null,
  idToken?: string,
  accessToken?: string
}
type PostData = {
  uid?: String | null,
  // eslint-disable-next-line camelcase
  google_access_token?: String | null,
}

const baseUrl = process.env.BASE_URL

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

  @Mutation set (data: User) {
    this.user = data
  }

  @Action({ rawError: true })
  login () {
    // eslint-disable-next-line no-console
    console.log('login action')
    const provider = new firebase.auth.GoogleAuthProvider()
    provider.addScope('https://www.googleapis.com/auth/youtube.readonly')
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        firebase.auth().currentUser?.getIdToken(true).then((token) => {
          const credential = result.credential as firebase.auth.OAuthCredential
          const user = result.user
          const userdata: User = {
            uid: user?.uid,
            userName: user?.displayName,
            userIcon: user?.photoURL,
            userEmail: user?.email,
            idToken: token,
            accessToken: credential.accessToken
          }
          this.set(userdata)
          this.postUser()
        })
      })
      .catch(function (error) {
        const errorCode = error.code
        // eslint-disable-next-line no-console
        console.log('error : ' + errorCode)
      })
  }

  @Action({ rawError: true })
  async postUser () {
    await db.collection('users').doc(this.user.uid!).set(this.user)
  }

  @Action({ rawError: true})
  async fetchUser(uid: string) {
    const userDoc = await db.collection('users').doc(uid).get()
    if(userDoc.exists) {
      console.info(userDoc.data())
      console.info(userDoc.data() as User)
      this.set(userDoc.data() as User)
    }
  }

  // eslint-disable-next-line require-await
  @Action({ rawError: true })
  async auth () {
    return new Promise(() => {
      firebase.auth().onIdTokenChanged((result) => {
        if (result === null) {
          this.login()
        } else {
          result?.getIdToken(true).then((token) => {
            const user = result
            const userdata: User = {
              uid: user?.uid,
              userName: user?.displayName,
              userIcon: user?.photoURL,
              userEmail: user?.email,
              idToken: token,
              accessToken: ''
            }
            this.fetchUser(user?.uid)
            ChannelsStore.fetchSubscriptions()
          })
        }
      })
    })
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
