import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const tableRoutes: RouteConfig = {
  path: '/200table',
  component: Layout,
  redirect: '/200table/201cashRecord-table',
  name: 'Table',
  meta: {
    title: 'table',
    icon: 'table'
  },
  children: [
    // {
    //   path: 'dynamic-table',
    //   component: () =>
    //     import(
    //       /* webpackChunkName: "dynamic-table" */ '@/views/table/dynamic-table/index.vue'
    //     ),
    //   name: 'DynamicTable',
    //   meta: { title: 'dynamicTable' }
    // },
    // {
    //   path: 'draggable-table',
    //   component: () =>
    //     import(
    //       /* webpackChunkName: "draggable-table" */ '@/views/table/draggable-table.vue'
    //     ),
    //   name: 'DraggableTable',
    //   meta: { title: 'draggableTable' }
    // },
    // {
    //   path: 'inline-edit-table',
    //   component: () =>
    //     import(
    //       /* webpackChunkName: "inline-edit-table" */ '@/views/table/inline-edit-table.vue'
    //     ),
    //   name: 'InlineEditTable',
    //   meta: { title: 'inlineEditTable' }
    // },
    // {
    //   path: 'complex-table',
    //   component: () =>
    //     import(
    //       /* webpackChunkName: "complex-table" */ '@/views/table/complex-table.vue'
    //     ),
    //   name: 'ComplexTable',
    //   meta: { title: 'complexTable' }
    // },
    {
      path: '201cashRecord-table',
      component: () =>
        import(
          /* webpackChunkName: "gameRecord-table" */ '@/views/table/cashRecord-table.vue'
        ),
      name: 'CashRecordTable',
      meta: { title: 'CashRecordTable' }
    },
    {
      path: '202gameRecord-table',
      component: () =>
        import(
          /* webpackChunkName: "gameRecord-table" */ '@/views/table/gameRecord-table.vue'
        ),
      name: 'GameRecordTable',
      meta: { title: 'GameRecordTable' }
    },
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

export default tableRoutes
