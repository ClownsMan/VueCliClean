const permission = {
  state: {
    routers: [],
    addRouters: [],
    menuList: [],
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
    },
    SET_MENULIST: (state, menuList) => {
      state.menuList = menuList
    },
  },
  actions: {

  }
}

export default permission