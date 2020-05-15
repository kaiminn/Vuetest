
import request from '@/utils/request'

export const getCashRecord = (params: any) => {
  return request({
    // baseURL: 'http://api.dev.mabu777.com',
    url: '/CashServer/api/queryCashRecord',
    method: 'post',
    params
  })
}
