
import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const liveCDNRouter: RouteConfig = {
  path: '/liveCDN',
  component: Layout,
  children: [
    {
      path: 'index',
      component: () =>
            import(
              /* webpackChunkName: "form" */ '@/views/liveCDN/privateConfig.vue'
            ),
      meta: {
        title: 'privateConfig',
        icon: 'component'
      }
    }
  ]
}

export default liveCDNRouter
