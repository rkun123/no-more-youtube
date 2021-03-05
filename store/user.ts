import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import firebase from '~/plugins/Auth/firebase.ts'

type User = {
  userName?: string,
  userIcon?: string,
  idToken?: string,
  acceccToken?: string
}

@Module({
  name: 'user',
  stateFactory: true,
  namespaced: true
})
export default class Users extends VuexModule {
  private users: User[] = [];

  public get getusers () {
    return this.users
  }

  // public get getuser () {
  //   return (id: Number) => this.users.find((user) => user.id === id)
  // }

  public get getuserCount () {
    return this.users.length
  }

  @Mutation
  private add (user: User) {
    this.users.push(user)
  }

  // @Mutation
  // private remove (id: Number) {
  //   this.users = this.users.filter((user) => user.id !== id)
  // }

  @Mutation set (users: User[]) {
    this.users = users
  }

  @Action({ rawError: true })
  public async fetchusers () {
    const { data } = await $axios.get<User[]>("/api/users");
    this.set(data)
  }

  @Action({ rawError: true })
  public async createuser (payload: User) {
    const { data } = await $axios.post<User>('/api/user', payload)
    this.add(data)
  }

  @Action({ rawError: true })
  login () {
    console.log('login action')
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        const credential = result.credential
        console.log(credential)
        console.log(result.user)
      })
      .catch(function (error) {
        const errorCode = error.code
        console.log('error : ' + errorCode)
      })
  }

  // @Action({ rawError: true })
  // async deleteuser (id: Number) {
  //   await $axios.delete(`/api/user/${id}`)
  //   this.remove(id)
  // }
}
