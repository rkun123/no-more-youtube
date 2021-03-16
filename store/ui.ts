import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

@Module({
  name: 'ui',
  stateFactory: true,
  namespaced: true
})
export default class UI extends VuexModule {
  private authPending: boolean = false

  public get getAuthPending () {
    return this.authPending
  }

  @Mutation
  private _setAuthPending (state: boolean) {
    this.authPending = state
  }

  @Action({ rawError: true })
  setAuthPending (state: boolean) {
    this._setAuthPending(state)
  }
}
