import request from '@/utils/request'

export const forceBingo = (data: any) => {
  let gameUrl = ''
  let hostDomain = location.hostname.split('admin')[1]
  if (hostDomain) {
    gameUrl = `${location.protocol}//game${hostDomain}`
  } else {
    gameUrl = `${process.env.VUE_APP_GAME_URL}`
  }

  const baseURL = `${gameUrl}/${data.gameID}`
  return request({
    baseURL,
    url: '/api/forceBingo',
    method: 'post',
    data
  })
}

export const getConfigSetting = (url: string, baseURL:string) => {
  const connectionUrl = baseURL
  return request({
    baseURL: connectionUrl,
    url: `/${url}/api/getConfigSetting`,
    method: 'post',
    data: {
      userID: '9999',
      items: ['rtp', 'ngLimitedWin', 'maxFGRounds', 'fgLimitedTotalWin']
    }
  })
}

export const getConfigItem = (url: string, item: string, baseURL: string) => {
  return request({
    baseURL,
    url: `/${url}/api/getConfigItem`,
    method: 'post',
    data: {
      userID: '9999',
      item
    }
  })
}

export const setConfigSetting = (url: string, changeData: string[], baseURL: string) => {
  return request({
    baseURL,
    url: `/${url}/api/setConfigSetting`,
    method: 'post',
    data: {
      userID: '9999',
      items: ['rtp', 'ngLimitedWin', 'maxFGRounds', 'fgLimitedTotalWin'],
      data: changeData
    }
  })
}
