import request from '@/utils/request'

export const getGameRecord = (params: any) => {
  return request({
    // baseURL: 'http://api.dev.mabu777.com',
    url: '/GameRecorder/api/queryGameRecord',
    method: 'get',
    params
  })
}
