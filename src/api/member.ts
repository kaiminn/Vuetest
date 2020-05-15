import request from '@/utils/request'

import { IResponse, IResponseData, IAccount, IQueryAccount, IEditAccount, ICreateAccount } from './types'

export const getMemberAccount = async(data: IQueryAccount): Promise<IAccount> => {
  if (data.searchTime.dueTime) {
    data.searchTime.dueTime.setHours(23, 59, 59, 999)
  }

  return request({
    url: '/AccountSystem/api/queryAccountAction',
    method: 'post',
    data
  }).then(result => {
    return {
      data: result.result.data,
      count: result.result.count
    }
  }).catch(error => {
    throw new Error(error)
  })
}

export const updateMemberAccount = async(data: IEditAccount): Promise<IResponse> => {
  return request({
    url: '/AccountSystem/api/editAccountAction',
    method: 'post',
    data
  }).then(result => {
    return {
      code: result.code,
      message: result.result.message
    }
  }).catch(error => {
    throw new Error(error)
  })
}

export const createMemberAccount = async(data: ICreateAccount): Promise<IResponse> => {
  return request({
    url: '/AccountSystem/api/registerAccountAction',
    method: 'post',
    data
  }).then(result => {
    return {
      code: result.code,
      message: result.result.message
    }
  }).catch(error => {
    throw new Error(error)
  })
}
