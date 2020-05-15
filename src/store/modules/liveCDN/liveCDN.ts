import {
  VuexModule,
  Module,
  Action,
  Mutation,
  getModule
} from 'vuex-module-decorators'
import { getCDNs } from '@/api/liveCDN/liveCDN'
import store from '@/store'

export interface ICDNConfigs {
  // [index:number]: CDNConfig;
  cdnConfigs: CDNConfig[]
}
export class CDNConfig {
  public id: number = -1;
  public name: string = '';
  public authKey: string = '';
  public authTimeout: number | null = null;
  public pushUrl: string = '';
  public playUrl: string = '';
  public appName: string = '';
  public appid: string = '';
  public bizid: string = '';
}

@Module({ dynamic: true, store, name: 'liveCDN' })
class LiveCDN extends VuexModule implements ICDNConfigs {
  public cdnConfigs: CDNConfig[] = []

  @Mutation
  private SET_CONFIG(configs: CDNConfig[]) {
    this.cdnConfigs = configs
  }

  @Action
  public async GetCDNs() {
    const { data } = await getCDNs()
    if (!data) {
      throw Error('get private config error!!!')
    }

    this.SET_CONFIG(data)
  }
}

export const LiveCDNModule = getModule(LiveCDN)
