import Vue from 'vue'

const user = {
  state: {
    token: '',
    name: '',  // 登陆人名字
    uuid: '', // 登录人uuid
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_UUID: (state, uuid) => {
      state.uuid = uuid
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
  },
  actions: {

  }
}

export default user;