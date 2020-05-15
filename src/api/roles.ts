import request from '@/utils/request'

export const getRouteRoles = () =>
  request({
    url: '/AdminSystem/api/permissionList',
    method: 'post'
  })

export const getlocalRoles = (data: any) =>
  request({
    url: '/AdminSystem/api/rolesList',
    method: 'post',
    data
  })

export const deletelocalRoles = (data: any) =>
  request({
    url: '/AdminSystem/api/deleteRole',
    method: 'post',
    data
  })

export const createlocalRole = (data: any) =>
  request({
    url: '/AdminSystem/api/createRoles',
    method: 'post',
    data
  })

export const updatelocalRole = (data: any) =>
  request({
    url: '/AdminSystem/api/updateRoles',
    method: 'post',
    data
  })
