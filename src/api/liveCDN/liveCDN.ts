
import request from '@/utils/request'

export const getCDNs = () =>
  request({
    baseURL: process.env.VUE_APP_LIVE_CDN_API,
    url: '/LiveCDNSystem/api/getCDNs',
    method: 'get'
  })
