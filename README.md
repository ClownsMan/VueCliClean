<h1 align="center">公众版（纯净版）</h1>


## 简介
后台管理系统，纯净版，用于脚手架的模板下载

### 文件夹介绍
![avatar](/public/folder.jpg)

项目
|____ config  项目打包后文件上传cdn文件
|____ node_modules  项目依赖包
|____ public  静态资源(不会改变的，如第三方资源)
|____ .eslintrc.js  eslit标准
|____ .gitignore  git上传忽略文件
|____ babel.config.js babel配置文件
|____ package.json  项目基础信息、依赖信息
|____ package-lock.json 项目本地依赖的详细信息，包括版本
|____ project.md  项目文档
|____ vue.config.js vue cli项目的配置文件
|____ yarn.lock yarn下载依赖
|____ yarn-error.log  yarn错误日志


src
|____ api  不同模块接口封装
|____ assets  静态资源(会改变的，自己的)
|____ components  公共组件文件
|____ config  项目相关配置
      |____ project.config.js 项目配置
      |____ request.config.js 请求配置
      |____ router.config.js  流程配置
|____ core  公共组件注册、第三方依赖注册、自己封装插件的注册
      |____ components.js 公共组件注册
      |____ index.js 第三方依赖注册
      |____ use.js  自己封装插件的注册
|____ layouts 公共样式文件
|____ mock  模拟数据
|____ router  路由信息
      |____ model 各路由模块
      |____ index.js 路由实例
|____ store vuex实例
|____ utils 工具类
|____ view  各模块页面
|____ App.vue 最基础页面
|____ main.js 入口文件
|____ permission.js 项目权限控制
