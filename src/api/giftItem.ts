import request from '@/utils/request'
import { IGiftItem, IGiftType } from './types'

export const defaultGiftItemData: IGiftItem = {
  id: 0,
  name: '',
  typeId: 0,
  currency: 0,
  orderId: 0,
  imageUrl: '',
  animeUrl: '',
  isEnabled: true,
  agentId: '',
  createDatetime: ''
}

export const defaultGiftTypeData: IGiftType = {
  id: 0,
  typeName: '',
  agentId: '',
  createDatetime: '',
  isEnabled: true
}

// 取得禮物項目列表
export const getGiftItemList = (params: any) =>
  request({
    url: '/GiftSystem/api/getGiftItemList',
    method: 'get',
    params
  })

// 增加禮物項目
export const addGiftItem = (data: any) =>
  request({
    url: '/GiftSystem/api/addGiftItem',
    method: 'post',
    data
  })

// 更新禮物項目
export const updateGiftItem = (data: any) =>
  request({
    url: `/GiftSystem/api/updateGiftItem`,
    method: 'put',
    data
  })

// 刪除禮物類型
export const deleteGiftItem = (data: any) =>
  request({
    url: '/GiftSystem/api/deleteGiftItem',
    method: 'post',
    data
  })

// 取得禮物類型列表
export const getGiftTypeList = (params: any) =>
  request({
    url: '/GiftSystem/api/getGiftTypeList',
    method: 'get',
    params
  })

// 更新禮物類型
export const updateGiftType = (data: any) =>
  request({
    url: `/GiftSystem/api/updateGiftType`,
    method: 'put',
    data
  })

// 增加禮物類型
export const addGiftType = (data: any) =>
  request({
    url: '/GiftSystem/api/addGiftType',
    method: 'post',
    data
  })

// 取得送禮紀錄列表
export const getGiftRecord = (params: any) =>
  request({
    url: '/GiftSystem/api/getGiftRecord',
    method: 'get',
    params
  })
