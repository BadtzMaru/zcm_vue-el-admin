module.exports = {
	lintOnSave: false,
	devServer: {
		host: 'localhost',
		port: 8080,
		https: false,
		open: false, // 是否自动打开浏览器
		proxy: {
			'/admin': {
				target: 'http://shop.cwj.gold/admin',
				ws: true,
				changeOrigin: true,
				pathRewrite: {
					'^/admin': '',
				},
			},
		},
	},
};
