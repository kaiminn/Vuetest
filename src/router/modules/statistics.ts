import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const statisticsRouter: RouteConfig = {
  path: '/statistics',
  component: Layout,
  redirect: 'noredirect',
  name: 'Statistics',
  meta: {
    title: 'Statistics',
    icon: 'table'
  },
  children: [
    {
      path: 'mixed-chart',
      component: () => import('@/views/statistics/gameMonitoring.vue'),
      name: 'GameMonitoring',
      meta: {
        title: 'GameMonitoring',
        icon: 'table'
      }
    }
  ]
}

export default statisticsRouter
