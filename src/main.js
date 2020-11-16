import Vue from 'vue';
import './plugins/axios';
import App from './App.vue';
import './plugins/element.js';
import router from './router.js';
import store from './store/index.js';

// 引入拖拽排序
import VueDND from 'awe-dnd';
Vue.use(VueDND);

// 引入全局配置文件
import $conf from './common/config/config.js';
Vue.prototype.$conf = $conf;

// 全局注册自定义指令
Vue.directive('auth', {
	inserted(el, binding) {
		let user = sessionStorage.getItem('user');
		user = user ? JSON.parse(user) : {};
		if (!user.super) {
			let rules = user.ruleNames ? user.ruleNames : [];
			let v = rules.find((item) => item === binding.value);
			if (!v) {
				// 移除节点
				el.parentNode.removeChild(el);
			}
		}
	},
});

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount('#app');
