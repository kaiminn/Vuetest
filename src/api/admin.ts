import request from '@/utils/request'

import { IAdminAccount, IResponse, IResponseData } from './types'

export const getAdminAccount = async(data: {
  page: number,
  limit: number,
  filter: {
    account: string,
    isEnabled?: boolean,
    startDate?: Date,
    dueDate?: Date
  }
}): Promise<IResponseData> => {
  if (data.filter.dueDate) {
    data.filter.dueDate.setHours(23, 59, 59, 999)
  }

  return request({
    url: '/AdminSystem/api/getAdminAccount',
    method: 'post',
    data
  }).then(result => {
    const { code, message, data } = result
    return {
      data,
      message,
      code
    }
  }).catch(error => {
    throw new Error(error)
  })
}

export const updateAdminAccountPassword = async(data: IAdminAccount): Promise<IResponse> => {
  return request({
    url: '/AdminSystem/api/changeAdminAccountPassword',
    method: 'post',
    data: {
      account: data.account,
      password: data.password
    }
  }).then(result => {
    return {
      code: Number.parseInt(result.code, 10),
      message: result.message
    }
  }).catch(error => {
    throw new Error(error)
  })
}

export const createAdminAccount = async(data: IAdminAccount): Promise<IResponse> => {
  const { account, password, name, prefix, isEnabled, roles, website, hashKey, APIDomain, whiteIPList } = data
  return request({
    url: '/AdminSystem/api/createAdminAccount',
    method: 'post',
    data: {
      account,
      password,
      name,
      prefix,
      isEnabled,
      roles: roles.map(role => role.id),
      website,
      // hashKey,
      APIDomain,
      whiteIPList
    }
  }).then(result => {
    return {
      code: Number.parseInt(result.code, 10),
      message: result.message
    }
  }).catch(error => {
    throw new Error(error)
  })
}

export const updateAdminAccount = async(data: IAdminAccount): Promise<IResponse> => {
  const { id, account, name, prefix, isMaintained, password, isEnabled, roles, website, hashKey, APIDomain, whiteIPList } = data
  return request({
    url: '/AdminSystem/api/updateAdminAccount',
    method: 'post',
    data: {
      id,
      account,
      name,
      prefix,
      isEnabled,
      isMaintained,
      password,
      roles: roles.map(role => role.id),
      website,
      hashKey,
      APIDomain,
      whiteIPList
    }
  }).then(result => {
    return {
      code: Number.parseInt(result.code, 10),
      message: result.message
    }
  }).catch(error => {
    throw new Error(error)
  })
}

// getAgentList
export const getAgentList = async(): Promise<IResponseData> => {
  return request({
    url: '/AdminSystem/api/getAgentList',
    method: 'post',
    data: {
    }
  }).then(result => {
    const { code, message, data } = result
    return {
      data,
      message,
      code
    }
  }).catch(error => {
    throw new Error(error)
  })
}
