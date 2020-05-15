import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const adminRouter: RouteConfig = {
  path: '/adminAccount',
  component: Layout,
  redirect: '/adminAccount/index',
  meta: {
    title: 'adminAccount',
    icon: 'user'
  },
  children: [
    {
      path: 'adminaccount',
      component: () =>
        import('@/views/adminAccount/index.vue'),
      name: 'AdminAccount',
      meta: {
        title: 'accountManagement',
        noCache: true
      }
    },
    {
      path: '103adjustRole',
      component: () =>
        import(
          /* webpackChunkName: "permission-role" */ '@/views/permission/adjustRole.vue'
        ),
      name: 'adjustRole',
      meta: {
        title: 'adjustRole'
      }
    }
  ]
}

export default adminRouter
