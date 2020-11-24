<template>
  <a-menu :theme="theme" :mode="mode" :default-selected-keys="['1']">
    <a-sub-menu :key="item.name" v-for="item in menuList">
      <span slot="title"><span>{{item.name}}</span></span>
      <a-menu-item :key="list.name" v-for="list in item.children">
        <router-link :to="list.path">
          {{list.name}}
        </router-link>
      </a-menu-item>
    </a-sub-menu>
  </a-menu>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: [ 'theme', 'mode' ],
  data() {
    return {
      menuList: [],
    }
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: state => state.permission.menuList
    }),
  },
  created() {
    // 处理菜单
    this.menuList = this.getMenuList();
  },
  methods: {
    getMenuList() {
      return [
        {
          name: '一级菜单',
          children: [
            {
              name: '二级菜单1',
              path: '/show/first'
            },
            {
              name: '二级菜单2',
              path: '/show/second'
            },
          ]
        }
      ]
    }
  }
}
</script>
