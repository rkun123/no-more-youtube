import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
// import { $axios } from '~/utils/api'
import firebase from '~/plugins/Auth/firebase.ts'

type User = {
  userName?: string | null,
  userIcon?: string | null,
  idToken?: string,
  acceccToken?: string
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

  @Mutation set (data: User) {
    this.user = data
  }

  @Action({ rawError: true })
  login () {
    // eslint-disable-next-line no-console
    console.log('login action')
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        const credential = result.credential as firebase.auth.OAuthCredential
        const user = result.user
        const userdata: User = {
          userName: user?.displayName,
          userIcon: user?.photoURL,
          idToken: credential.idToken,
          acceccToken: credential.accessToken
        }
        this.set(userdata)
      })
      .catch(function (error) {
        const errorCode = error.code
        console.log('error : ' + errorCode)
      })
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
}
