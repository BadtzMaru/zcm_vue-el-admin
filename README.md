# 安装项目

`npm install -g @vue/cli`
`yarn global add @vue/cli`
`vue create 项目名称`

# 配置 vue.config.js (关闭 eslint)

1. 根目录创建 vue.config.js
2. 添加`module.exports={lintOnSave: false}`

# vue 图形化管理界面

`vue ui`

# 安装 element-ui

`vue add element`

# 安装 vue-router 和使用

1. `npm install vue-router --save`
2. src 下创建 router.js
   `import Vue from 'vue';`
   `import Router from 'vue-router';`
   `Vue.use(Router);`
   `export default new Router({ routes: [] });`
3. 在 main.js 中引入 router.js
   `import router from './router.js';`
   `new Vue({router,render:h=>h(App)}).$mount('#app');`

# 防止点击重复路由报错

在 router.js 中添加
`const originalPush = Router.prototype.push;`
`Router.prototype.push = function push(location) {return originalPush.call(this, location).catch((err) => err);};`

# 安装 ECharts

`npm install echarts`

# 修改 data 中的数组的方法

`@click.stop.native="事件名"`

# 安装 vuex

`npm install vuex --save`

# 拖拽插件

`npm install awe-dnd --save`

# 依赖注入

1. `provide() {return {app:this}}`
2. `inject: ['app']`
3. 注入的组件中
   `this.app.show((res)=>{console.log(res)})`
4. 依赖的组件中
   `show(callback){ callback('hello')}`
