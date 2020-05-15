import request from '@/utils/request'

export const getPrivateConfig = () =>
  request({
    baseURL: process.env.VUE_APP_LIVE_CDN_API,
    url: '/LiveCDNSystem/api/getPrivateConfig',
    method: 'post'
  })

export const updatePrivateConfig = (data: any) =>
  request({
    baseURL: process.env.VUE_APP_LIVE_CDN_API,
    url: '/LiveCDNSystem/api/updatePrivateConfig',
    method: 'post',
    data
  })
