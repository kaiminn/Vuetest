import request from '@/utils/request'
import { devServer } from '../../vue.config'

export const gameList = (data: any) => {
  return request({
    url: '/GameManager/api/gameList',
    method: 'post',
    data
  })
}

export const getGamePlayer = () => {
  return request({
    url: '/GameManager/api/getGamePlayer',
    method: 'post'
  })
}
