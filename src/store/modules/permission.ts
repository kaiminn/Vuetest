import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { RouteConfig } from 'vue-router'
import { asyncRoutes, constantRoutes } from '@/router'
import * as _ from 'lodash'
import store from '@/store'
import { getRouteRoles } from '@/api/roles'
// 比對是否有符合的權限
/**
 *
 * @param roles path: "/permission"
                component: ƒ VueComponent(options)
                redirect: "/permission/directive"
                meta: Object
                children: Array(3)
 * @param route
                0: "editor"
 */
export const hasPermission = (roles: string[], route: RouteConfig) => {
  if (route.meta && route.meta.roles) {
    if (route.path === '*') { return true } // for 404 error page
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

export const filterAsyncRoutes = (routes: RouteConfig[], roles: string[]) => {
  const res: RouteConfig[] = []
  routes.forEach(route => {
    const r = { ...route }
    if (hasPermission(roles, r)) {
      if (r.children) {
        r.children = filterAsyncRoutes(r.children, roles)
      }
      res.push(r)
    }
  })

  return res
}

export const setRole = (routes: RouteConfig[], role: any): RouteConfig[] => {
  let res: RouteConfig[] = []
  routes.forEach(route => {
    const _route = _.cloneDeep(route)

    if (_route.meta) {
      // TODO: 要修改
      // _route.meta.roles = ['super']
      if (role[_route.path]) {
        _route.meta.roles = [...role[_route.path]]
      } else {
        _route.meta.roles = []
      }
      if (_route.children) {
        _route.children = setRole(_route.children, role)
      }
    } else {
      _route.meta = {}
      _route.meta.roles = role[_route.path]
    }
    res.push(_route)
  })
  return res
}

export interface IPermissionState {
  routes: RouteConfig[]
  dynamicRoutes: RouteConfig[]
}

@Module({ dynamic: true, store, name: 'permission' })
class Permission extends VuexModule implements IPermissionState {
  public routes: RouteConfig[] = []
  public dynamicRoutes: RouteConfig[] = []
  public allRoutes: RouteConfig[] = []

  @Mutation
  private SET_ROUTES([routes, newRoutes]:any) {
    this.routes = constantRoutes.concat(routes)
    this.dynamicRoutes = routes
    this.allRoutes = constantRoutes.concat(newRoutes)
  }

  @Action
  public async GenerateRoutes(roles: string[]) {
    let accessedRoutes
    // const aa = {
    //   '404': ['editor', 'mabu'],
    //   '401': ['editor']
    // }
    const RoutesRole = await getRouteRoles()
    const newRoutes = setRole(asyncRoutes, RoutesRole.data.roles)
    // const newRoutes = setRole(asyncRoutes, aa)
    // 角色為 super 的帳號，允許訪問所有的 routes
    if (roles.includes('5478c9d5-1078-4607-9624-4a6dbcae92e7')) {
      accessedRoutes = newRoutes
    } else {
      accessedRoutes = filterAsyncRoutes(newRoutes, roles)
    }
    this.SET_ROUTES([accessedRoutes, newRoutes])
  }
}

export const PermissionModule = getModule(Permission)
