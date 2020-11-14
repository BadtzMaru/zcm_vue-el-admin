import Vue from 'vue';
import Router from 'vue-router';

import routes from './common/config/router.js';

const originalPush = Router.prototype.push;

Router.prototype.push = function push(location) {
	return originalPush.call(this, location).catch((err) => err);
};

Vue.use(Router);

let router = new Router({
	routes,
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
	let token = window.sessionStorage.getItem('token');
	if (token) {
		// 防止重复登录
		if (to.path === '/login') {
			Vue.prototype.$message.warning('请不要重复登录');
			return next({ name: from.name ? from.name : 'index' });
		}
		if (to.name !== 'error_404') {
			// 其他验证...
			let rules = window.sessionStorage.getItem('rules');
			rules = rules ? JSON.parse(rules) : [];
			let index = rules.findIndex((item) => {
				return item.rule_id > 0 && item.desc === to.name;
			});
			if (index === -1) {
				Vue.prototype.$message.error('你没有权限');
				return next({ name: from.name ? from.name : 'error_404' });
			}
		}
		next();
	} else {
		if (to.path === '/login') {
			return next();
		}
		Vue.prototype.$message.error('请先登录');
		next({ path: '/login' });
	}
});

export default router;
