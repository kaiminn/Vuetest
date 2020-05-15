import Layout from '@/layout/index.vue'
import adminRouter from './modules/admin'
import memberRouter from './modules/member'
import giftRouter from './modules/gift'
import liveCDNRouter from './modules/liveCDN'

export const asyncRoutesOsport =
[
  adminRouter,
  memberRouter,
  giftRouter,
  liveCDNRouter,
  {
    path: '*',
    redirect: '/404',
    meta: { hidden: true }
  }
]
