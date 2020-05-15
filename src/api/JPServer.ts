import request from '@/utils/request'
export const getConfigItemAction = (data: any) => {
  return request({
    // baseURL: 'http://api.qc1.mabu777.com/JPServer001',
    url: '/JPServer001/api/getConfigItemAction',
    method: 'post',
    data
  })
}

export const getConfigSettingAction = (data: any) => {
  return request({
    // baseURL: 'http://api.qc1.mabu777.com/JPServer001',
    // baseURL: 'http://localhost:8903',
    url: '/JPServer001/api/getConfigSettingAction',
    method: 'post',
    data
  })
}

export const setConfigItemAction = (data: any) => {
  return request({
    // baseURL: 'http://api.qc1.mabu777.com/JPServer001',
    // baseURL: 'http://localhost:8903',
    url: '/JPServer001/api/setConfigItemAction',
    method: 'post',
    data
  })
}
