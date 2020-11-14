'use strict';

import Vue from 'vue';
import axios from 'axios';

import { Message } from 'element-ui';

let loading = null;
let requestCount = 0;
// 显示loading
function showLoading() {
	if (requestCount === 0) {
		loading = Message({
			message: '加载中...',
			duration: 0,
		});
	}
	requestCount++;
}
// 隐藏Loading
function hideLoading() {
	if (requestCount > 0) requestCount--;
	if (loading && requestCount === 0) {
		loading.close();
	}
}

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
	// baseURL: process.env.baseURL || process.env.apiUrl || ""
	// timeout: 60 * 1000, // Timeout
	// withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

// 添加请求拦截器
_axios.interceptors.request.use(
	(config) => {
		// 添加header头的token
		let token = window.sessionStorage.getItem('token');
		if (config.token === true) {
			config.headers.token = token;
		}
		// 显示loading
		if (config.loading === true) showLoading();
		return config;
	},
	(err) => {
		// 隐藏loading
		hideLoading();
		return Promise.reject(err);
	}
);

// 添加响应拦截器
_axios.interceptors.response.use(
	(res) => {
		// 隐藏loading
		hideLoading();
		return res;
	},
	(err) => {
		// 隐藏loading
		hideLoading();
		// 全局错误提示
		if (err.response && err.response.data && err.response.data.errorCode) {
			Message.error(err.response.data.msg);
		}
		return Promise.reject(err);
	}
);

Plugin.install = function(Vue) {
	Vue.axios = _axios;
	window.axios = _axios;
	Object.defineProperties(Vue.prototype, {
		axios: {
			get() {
				return _axios;
			},
		},
		$axios: {
			get() {
				return _axios;
			},
		},
	});
};

Vue.use(Plugin);

export default Plugin;
