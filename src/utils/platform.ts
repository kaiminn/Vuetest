import { PlatformModule } from '@/store/modules/platform'

export const isMabuPlatform = (): boolean => {
  if (PlatformModule.platform === PlatformModule.PLATFORM_MABU) {
    return true
  }

  return false
}

export const isOsportPlatform = (): boolean => {
  if (PlatformModule.platform === PlatformModule.PLATFORM_OSPORT) {
    return true
  }

  return false
}
