import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import firebase from '~/plugins/Auth/firebase.ts'

type User = {
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
        const credential = result.credential as firebase.auth.OAuthCredential
        const user = result.user
        const userdata: User = {
          uid: user?.uid,
          userName: user?.displayName,
          userIcon: user?.photoURL,
          userEmail: user?.email,
          idToken: credential.idToken,
          accessToken: credential.accessToken
        }
        this.set(userdata)
        this.postUser()
      })
      .catch(function (error) {
        const errorCode = error.code
        // eslint-disable-next-line no-console
        console.log('error : ' + errorCode)
      })
  }

  @Action({ rawError: true })
  async postUser () {
    $axios.setHeader('Authorization', 'Bearer ' + this.user.idToken)
    const payload: PostData = {
      uid: this.user.uid,
      google_access_token: this.user.accessToken,
    }
    await $axios.post(baseUrl + '/api/v1/credentials', payload).then((response) => {
      console.log(response)
    }).catch(() => {
      alert('エラーが発生しました。')
    })
  }

  // eslint-disable-next-line require-await
  @Action({ rawError: true })
  async auth () {
    return new Promise(() => {
      firebase.auth().onIdTokenChanged((result) => {
        if(result === null) this.login()
        else result?.getIdToken(true).then((token) => {
          const user = result
          const userdata: User = {
            userName: user?.displayName,
            userIcon: user?.photoURL,
            userEmail: user?.email,
            idToken: token,
            accessToken: ''
          }
          this.set(userdata)
        })
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
