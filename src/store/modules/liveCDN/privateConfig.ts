import {
  VuexModule,
  Module,
  Action,
  Mutation,
  getModule
} from 'vuex-module-decorators'
import { getPrivateConfig, updatePrivateConfig } from '@/api/liveCDN/privateConfig'
import store from '@/store'

export interface IPrivateConfigState {
  liveCDNId: number;
  name: string;
  authKey: string;
  authTimeout: number | null;
  pushUrl: string;
  playUrl: string;
  appName: string;
  appid: string;
  bizid: string;
}

@Module({ dynamic: true, store, name: 'privateConfig' })
class PrivateConfig extends VuexModule implements IPrivateConfigState {
  public liveCDNId: number = 0;
  public name: string = '';
  public authKey: string = '';
  public authTimeout: number = 0;
  public pushUrl: string = '';
  public playUrl: string = '';
  public appName: string = '';
  public appid: string = '';
  public bizid: string = '';

  @Mutation
  private SET_LIVE_CDN_ID(liveCDNId: number) {
    this.liveCDNId = liveCDNId
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  private SET_AUTH_KEY(authKey: string) {
    this.authKey = authKey
  }

  @Mutation
  private SET_AUTH_TIME_OUT(authTimeout: number) {
    this.authTimeout = authTimeout
  }

  @Mutation
  private SET_PUSH_URL(pushUrl: string) {
    this.pushUrl = pushUrl
  }

  @Mutation
  private SET_PLAY_URL(playUrl: string) {
    this.playUrl = playUrl
  }

  @Mutation
  private SET_APP_NAME(appName: string) {
    this.appName = appName
  }

  @Mutation
  private SET_APP_ID(appid: string) {
    this.appid = appid
  }

  @Mutation
  private SET_BIZID(bizid: string) {
    this.bizid = bizid
  }

  @Action
  public async GetPrivateConfig() {
    const { data } = await getPrivateConfig()
    if (!data) {
      throw Error('get private config error!!!')
    }

    const {
      id,
      name,
      authKey,
      authTimeout,
      pushUrl,
      playUrl,
      appName,
      appid,
      bizid
    } = data.liveCDNData

    this.SET_LIVE_CDN_ID(id)
    this.SET_NAME(name)
    this.SET_AUTH_KEY(authKey)
    this.SET_AUTH_TIME_OUT(authTimeout)
    this.SET_PUSH_URL(pushUrl)
    this.SET_PLAY_URL(playUrl)
    this.SET_APP_NAME(appName)
    this.SET_APP_ID(appid)
    this.SET_BIZID(bizid)
  }

  @Action
  public async UpdatePrivateConfig(config: {
    liveCDNId: number;
    authKey: string;
    authTimeout?: number | null;
    pushUrl: string;
    playUrl: string;
    appName: string;
    appid: string;
    bizid: string;
  }) {
    updatePrivateConfig(config)
  }
}

export const PrivateConfigModule = getModule(PrivateConfig)
