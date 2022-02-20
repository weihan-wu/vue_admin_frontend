import { getRequest } from "../api";

export const initMenu = (router, store) => {
  if (store.state.routes.length > 0) {
    return;
  }

  getRequest('menu/menu/index').then(res => {
    if (res) {
      // 格式化好的Router
      let fixedRoutes = [
        {
          name: "Login",
          path: "/login",
          component: () => import('../views/login'),
          hidden: true
        },
        {
          name: "仪表盘",
          path: "/",
          icon: "el-icon-pie-chart",
          component: () => import('../views/home'),
          children: [
            {
              name: "用户使用情况",
              path: "/controller",
              component: () => import('../views/chars')
            }
          ]
        },
      ]
      let fmtRoutes = formatRoutes(res.data);
      fmtRoutes = fixedRoutes.concat(fmtRoutes)
      // 添加到router
      router.addRoutes(fmtRoutes)
      // 将数据存入vuex
      store.commit('initRoutes', fmtRoutes)
    }
  })
}

export const formatRoutes = routes => {
  let fmtRoutes = []

  routes.forEach(router => {
    let { path, component, name, icon, children } = router
    if (children && children instanceof Array) {
      children = formatRoutes(children)
    }
    let fmRouter = {
      path,
      name,
      icon,
      children,
      component(resolve) {
        require(['../views/' + component], resolve)
      }
    }
    fmtRoutes.push(fmRouter)
  });
  return fmtRoutes;
}