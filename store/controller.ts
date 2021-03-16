import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

export type ControllerState = {
  speed: number,
  angle: number
}

@Module({
  name: 'controller',
  stateFactory: true,
  namespaced: true
})
export default class Controller extends VuexModule {
  private speed = 1
  private angle = 0
  private controllerUrl = ''
  private websocket?: WebSocket
  private connected: boolean = false
  private error?: string = undefined

  public get getSpeed () {
    return this.speed
  }

  public get getAngle () {
    return this.angle
  }

  public get getConnected () {
    return this.connected
  }

  public get getError () {
    console.info('getError', this.error)
    return this.error
  }

  @Mutation
  private setSpeed (speed: number) {
    if (speed > 2.0) {
      this.speed = 2.0
    } else if (speed < 0) {
      this.speed = 0.0
    } else if (speed >= 0.8 && speed <= 1.2) {
      this.speed = 1.0
    } else {
      this.speed = speed
    }
  }

  @Mutation
  private setAngle (angle: number) {
    this.angle = angle
  }

  @Mutation
  private _setControllerUrl (url: string) {
    this.controllerUrl = url
  }

  @Mutation
  private setWebsocket (websocket: WebSocket) {
    this.websocket = websocket
  }

  @Mutation
  private setConnected (state: boolean) {
    this.connected = state
  }

  @Mutation
  private setError (error?: string) {
    console.info('setError', error)
    this.error = error
  }

  @Action({ rawError: true })
  public setControllerUrl (url: string) {
    this._setControllerUrl(url)
  }

  @Action({ rawError: true })
  public subscribe () {
    if (this.controllerUrl === undefined) {
      console.error('Controller URL has not set')
    }
    try {
      const ws = new WebSocket(this.controllerUrl)
      this.setWebsocket(ws)

      ws.addEventListener('error', (e) => {
        console.error(e)
        this.setError('Couldn\'t connct to controller.')
      })

      ws.addEventListener('open', () => {
        this.setConnected(true)
        this.setError(undefined)
      })

      ws.addEventListener('close', () => {
        this.setConnected(false)
      })

      ws.addEventListener('message', (e) => {
        const str = e.data as string
        this.receiveControllerInfo(str)
      })
    } catch (e) {
      this.setError((e as Error).message)
      console.error(this.error)
    }
  }

  @Action({ rawError: true })
  public receiveControllerInfo (str: string) {
    const splitted = str.split(',')
    const speed = parseFloat(splitted[1])
    const angle = -parseInt(splitted[0])
    this.setSpeed(speed)
    this.setAngle(angle)
  }
}
