import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { login, logout, getUserInfo, loginlocal, getUserInfoloacl, logoutloacl } from '@/api/users'
import { getToken, setToken, removeToken } from '@/utils/cookies'
import router, { resetRouter } from '@/router'
import { PermissionModule } from './permission'
import { TagsViewModule } from './tags-view'
import store from '@/store'

export interface IPlatform {
  platform: string
}

@Module({ dynamic: true, store, name: 'platform' })
class Platform extends VuexModule implements IPlatform {
  public PLATFORM_MABU = 'mabu'
  public PLATFORM_OSPORT = 'osport'
  public platform = `${process.env.VUE_APP_PLATFORM}` || this.PLATFORM_MABU
}

export const PlatformModule = getModule(Platform)
