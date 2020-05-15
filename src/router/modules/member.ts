import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const memberRouter: RouteConfig = {
  path: '/member',
  component: Layout,
  redirect: '/member/index',
  meta: {
    title: 'member',
    icon: 'user'
  },
  children: [
    {
      path: 'member',
      component: () =>
        import('@/views/member/index.vue'),
      name: 'member',
      meta: {
        title: 'member',
        noCache: true,
        icon: 'user'
      }
    }
  ]
}

export default memberRouter
