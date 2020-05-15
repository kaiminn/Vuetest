import request from '@/utils/request'

import { IRegistLiveMaster, IResponse } from './types'

export const registLiveMaster = async(data: IRegistLiveMaster): Promise<IResponse> => {
  const result = await request({
    url: '/LiveGameServer/api/registLiveMaster',
    method: 'post',
    data
  })

  return result
}
