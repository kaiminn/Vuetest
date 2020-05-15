import * as axios from 'axios'

export interface IArticleData {
  id: number
  status: string
  title: string
  abstractContent: string
  fullContent: string
  sourceURL: string
  imageURL: string
  timestamp: string | number
  platforms: string[]
  disableComment: boolean
  importance: number
  author: string
  reviewer: string
  type: string
  pageviews: number
}

export interface IRoles {
  id: number
  key: string
  name: string
  description: string
  routes: any
}

export interface ITransactionData {
  orderId: string
  timestamp: string | number
  username: string
  price: number
  status: string
}

export interface IUserData {
  id: number
  username: string
  password: string
  name: string
  email: string
  phone: string
  avatar: string
  introduction: string
  roles: string[]
}

export interface IAdminAccount {
  id: number
  account: string
  password: string
  name: string
  prefix: string
  isMaintained: boolean
  isEnabled: boolean
  hierarchyLevel: number
  parentId: number
  lastLoginIP: string
  lastLoginDatetime: Date
  roles: IRoles[]
  website: string
  hashKey: string
  APIDomain: string
  whiteIPList: string
}

export interface IGiftItem {
  id: number;
  name: string;
  typeId: number;
  currency: number;
  orderId: number;
  imageUrl: string;
  animeUrl: string;
  isEnabled: boolean;
  agentId: string;
  createDatetime: string | number;
}

export interface IGiftType {
  id: number;
  typeName: string;
  agentId: string;
  createDatetime: string | number;
  isEnabled: boolean;
}

export interface IGiftRecord {
  id: number;
  memberID: string;
  gameID: string;
  giftID: number;
  giftCount: number;
  totalBet: number;
  totalWin: number;
  winLost: number;
  winType: string;
  gameType: string;
  currencyType: string;
  gameInfo: string;
  agentId: string;
  playDateTime: string | number;
}

export interface IResponse {
  code: number
  message: string
}

export interface IResponseData {
  code: number
  message: string
  data: any
}

// 跑馬燈系統公告格式
export interface IBillboardInfo{
  ID: string;
  messageType: string;
  message: string;
  status: string;
  startTime: Date | string;
  dueTime: Date | string;
}

// 跑馬燈系統公告歷史紀錄格式
export interface IHistoryBillboardInfo{
  ID: string,
  messageType: string,
  message: string,
  startTime: Date,
  dueTime: Date
}

export interface IAccountBase {
    account: string
    agentID: string
    prefix: string
    nickName: string
    password: string
    activationDate: {
      startTime?: Date
      dueTime?: Date
    }
    registerTime?: Date
    lastLoginTime?: Date
    lastLoginIP: string
    accountStatus: number
    tags: string
}

export interface IAccount {
  data: IAccountBase[],
  count: number
}

export interface IQueryAccount {
  agentID: string
  page: number
  limit: number
  account: string
  nickName: string
  tags: string
  searchTime: {
    startTime?: Date
    dueTime?: Date
  }
}

export interface IEditAccount {
  memberID: string // account@agentID
  newPassword?: string
  newNickname?: string
  newAccountStatus?: number,
  newActivationDate?: {
    startTime?: Date
    dueTime?: Date
  },
  newTags: string
}

export interface ICreateAccount {
  account: string
  nickName: string
  password: string
  agentID: string
  accountActivationDate?: {
    startTime?: Date
    dueTime?: Date
  }
  tags?: string
}

declare module 'axios' {
  interface AxiosInstance {
    (config: AxiosRequestConfig): Promise<any>
  }
}

export interface IRegistLiveMaster {
  account: string
  nickName: string
  agentID: string
  isEnabled: boolean
  accountActivationDate?: {
    startTime?: Date
    dueTime?: Date
  }
  tags: string
}
