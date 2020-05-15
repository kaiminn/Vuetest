
import request from '@/utils/request'

export const getStatistics = (data: any) => {
  return request({
    // baseURL: 'http://api.dev.mabu777.com',
    // baseURL: `${process.env.VUE_APP_URL}/CashServer`,
    url: 'GameStatistics/api/gameStaticsGetData',
    method: 'post',
    data
  })
}

export const searchStatisticsDistinctPeople = (data: any) => {
  return request({
    // baseURL: 'http://api.dev.mabu777.com',
    // baseURL: `${process.env.VUE_APP_URL}/CashServer`,
    url: 'GameStatistics/api/searchStatisticsDistinctPeople',
    method: 'post',
    data
  })
}
