import Layout from '@/layout/index.vue'
import tableRouter from './modules/table'
import adminRouter from './modules/admin'
import memberRouter from './modules/member'

export const asyncRoutesMabu =
[
  adminRouter,
  memberRouter,
  {
    path: '/gamesetting',
    component: Layout,
    redirect: '/gamesetting/giveAway',
    meta: {
      title: 'gamesetting',
      icon: 'icon'
    },
    children: [
      {
        path: 'giveAway',
        component: () =>
          import(/* webpackChunkName: "profile" */ '@/views/gamesetting/giveAway.vue'),
        name: 'GiveAway',
        meta: {
          title: 'GiveAway',
          icon: 'donate'
        }
      },
      {
        path: 'gameRestrictions',
        component: () =>
          import(/* webpackChunkName: "profile" */ '@/views/gamesetting/gameRestrictions.vue'),
        name: 'GameRestrictions',
        meta: {
          title: 'GameRestrictions',
          icon: 'lock'
        }
      },
      {
        path: 'gameRestrictionsSetting',
        component: () =>
          import(/* webpackChunkName: "profile" */ '@/views/gamesetting/gameRestrictionsSetting.vue'),
        name: 'GameRestrictionsSetting',
        meta: {
          title: 'GameRestrictionsSetting',
          icon: 'lock'
        }
      },
      {
        path: 'gamePlayer',
        component: () =>
          import(/* webpackChunkName: "profile" */ '@/views/gamesetting/gamePlayer.vue'),
        name: 'GamePlayer',
        meta: {
          title: 'GamePlayer',
          icon: 'user',
          noCache: true
        }
      },
      {
        path: 'JPSetting',
        component: () =>
          import(/* webpackChunkName: "profile" */ '@/views/gamesetting/JPSetting.vue'),
        name: 'JPSetting',
        meta: {
          title: 'JPSetting',
          icon: 'user'
        }
      }
    ]
  },
  {
    path: '/billboard',
    component: Layout,
    redirect: '/billboard/bulletinBoard',
    meta: {
      title: 'bulletinBoard',
      icon: 'list'
    },
    children: [
      {
        path: 'bulletinBoard',
        component: () =>
          import(/* webpackChunkName: "profile" */ '@/views/billboard/index.vue'),
        name: 'bulletinBoard',
        meta: {
          title: 'bulletinBoard',
          icon: 'list'
          // noCache: true
        }
      },
      {
        path: 'historyBulletinBoard',
        component: () =>
          import(/* webpackChunkName: "profile" */ '@/views/billboard/history.vue'),
        name: 'historyBulletinBoard',
        meta: {
          title: 'historyBulletinBoard',
          icon: 'list'
          // noCache: true
        }
      }

    ]
  },
  tableRouter,
  {
    path: '*',
    redirect: '/404',
    meta: { hidden: true }
  }
]
