export default {
	state: {
		user: {},
		token: false,
	},
	getters: {},
	mutations: {
		// 登陆
		login(state, user) {
			// 保存登陆状态
			state.user = user;
			state.token = user.token;
			// 存储到本地存储
			window.sessionStorage.setItem('user', JSON.stringify(state.user));
			window.sessionStorage.setItem('token', JSON.stringify(state.token));
		},
	},
	actions: {},
};
