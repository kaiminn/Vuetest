import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const giftRouter: RouteConfig = {
  path: '/gift',
  component: Layout,
  redirect: '/gift/giftItemTable',
  meta: {
    title: 'GiftItem',
    icon: 'gift'
  },
  children: [
    {
      path: 'giftRecordTable',
      component: () =>
          import('@/views/gift/giftRecord-table.vue'),
      name: 'GiftRecordTable',
      meta: {
        title: 'GiftRecord'
      }
    },
    {
      path: 'giftItemTable',
      component: () =>
          import('@/views/gift/giftItemTable.vue'),
      name: 'GiftItemTable',
      meta: {
        title: 'GiftTable',
        noCache: true
      }
    },
    {
      path: 'giftTypeTable',
      component: () =>
          import('@/views/gift/giftTypeTable.vue'),
      name: 'GiftTypeTable',
      meta: {
        title: 'GiftTypeTable'
      }
    }
  ]
}

export default giftRouter
