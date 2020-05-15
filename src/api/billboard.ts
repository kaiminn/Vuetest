import request from '@/utils/request'

import { IBillboardInfo, IHistoryBillboardInfo } from './types'
import data from '@/views/pdf/content'

interface IActivationTime {
  startTime?: Date;
  dueTime?: Date;
}

// 新增公告
export const addBillboard = async(data: {
  agentID: string;
  messageType: string;
  message: string;
  activationTime: IActivationTime;
}): Promise<{ code: number; message: string }> => {
  return request({
    url: '/BillBoardSystem/api/addBillboardAction',
    method: 'post',
    data
  })
    .then(result => {
      const { code, message } = result
      return {
        code,
        message
      }
    })
    .catch(error => {
      throw new Error(error)
    })
}

// 修改公告
export const editBillboard = async(data: {
  ID: string;
  newMessage?: string;
  newActivationTime?: IActivationTime;
}): Promise<boolean> => {
  return request({
    url: '/BillBoardSystem/api/editBillboardAction',
    method: 'post',
    data
  })
    .then(result => {
      return result.result
    })
    .catch(error => {
      throw new Error(error)
    })
}

// 依條件取得公告
export const queryBillboard = async(data: {
  agentID: string;
  messageType?: string;
  status?: string;
}): Promise<Array<IBillboardInfo>> => {
  return request({
    url: '/BillBoardSystem/api/queryBillboardAction',
    method: 'post',
    data
  })
    .then(result => {
      return result.result
    })
    .catch(error => {
      throw new Error(error)
    })
}

// 依ID刪除公告
export const removeBillboard = async(data: {
  ID: string;
}): Promise<boolean> => {
  return request({
    url: '/BillBoardSystem/api/removeBillboardAction',
    method: 'post',
    data
  })
    .then(result => {
      return result.result
    })
    .catch(error => {
      throw new Error(error)
    })
}

// 取得公告刪除/過期公告
export const queryBillboardRecord = async(data: {
  agentID: string;
  searchTime?: {
    startTime?: Date;
    dueTime?: Date;
  };
  limit?: number;
  page?: number;
}): Promise<{data: Array<IHistoryBillboardInfo>, count: number}> => {
  if (data.searchTime && data.searchTime.dueTime) {
    data.searchTime.dueTime.setHours(23, 59, 59, 999)
  }

  return request({
    url: '/BillBoardSystem/api/queryBillboardRecordAction',
    method: 'post',
    data
  })
    .then(result => {
      return result.result
    })
    .catch(error => {
      throw new Error(error)
    })
}
