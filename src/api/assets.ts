import request from '@/utils/request'

// 增加圖片
export const addImage = (data: any) =>
  request({
    url: '/AssetsSystem/api/addImage',
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data
  })

// json檔
export const addJsonFile = (data: any) =>
  request({
    url: '/AssetsSystem/api/addJsonFile',
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' },
    data
  })
