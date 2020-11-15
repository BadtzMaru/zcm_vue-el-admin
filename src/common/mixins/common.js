export default {
	filters: {
		numToString(value) {
			return value.toString();
		},
	},
	data() {
		return {
			preUrl: '',
			multipleSelection: [],
			page: {
				current: 1,
				sizes: [10, 20, 50, 100],
				size: 10,
				total: 0,
			},
			loading: true,
		};
	},
	created() {
		this.getList();
	},
	computed: {
		// 选中记录的id组成的数组
		ids() {
			return this.multipleSelection.map((item) => {
				return item.id;
			});
		},
	},
	methods: {
		showLoading() {
			if (this.loading) {
				this.layout.showLoading();
			}
		},
		hideLoading() {
			if (this.loading) {
				this.layout.hideLoading();
			}
		},
		// 处理列表结果
		getListResult() {},
		// 获取请求列表分页url
		getListUrl() {
			return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}`;
		},
		// 获取列表
		getList() {
			if (this.preUrl === '') return;
			this.showLoading();
			let url = this.getListUrl();
			this.axios
				.get(url, { token: true })
				.then((res) => {
					this.hideLoading();
					let data = res.data.data;
					this.page.total = data.totalCount;
					this.getListResult(data);
				})
				.catch(() => {
					this.hideLoading();
				});
		},
		// 添加或者编辑
		addOrEdit(data, id = 0) {
			this.showLoading();
			let msg = id > 0 ? '修改' : '添加';
			let url =
				id > 0
					? `/admin/${this.preUrl}/` + id
					: `/admin/${this.preUrl}`;
			this.axios
				.post(url, data, {
					token: true,
				})
				.then(() => {
					this.hideLoading();
					this.createModel = false;
					this.$message({
						message: msg + '成功',
						type: 'success',
					});
					this.getList();
				})
				.catch(() => {
					this.hideLoading();
				});
		},
		// 表格选中
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		handleSizeChange(val) {
			this.page.size = val;
			this.getList();
		},
		handleCurrentChange(val) {
			this.page.current = val;
			this.getList();
		},
		// 批量删除url
		deleteAllUrl() {
			return `/admin/${this.preUrl}/delete_all`;
		},
		// 批量删除
		deleteAll() {
			this.$confirm('是否要删除选中规格?', '提示', {
				confirmButtonText: '删除',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					if (this.ids.length === 0) {
						return this.$message({
							message: '请先选中需要删除的规格',
							type: 'warning',
						});
					}
					this.showLoading();
					this.axios
						.post(
							this.deleteAllUrl(),
							{ ids: this.ids },
							{ token: true }
						)
						.then(() => {
							this.hideLoading();
							this.multipleSelection = [];
							this.$message({
								message: '删除成功',
								type: 'success',
							});
						})
						.catch(() => {
							this.hideLoading();
						});
				})
				.catch(() => {});
		},
		// 修改状态
		changeStatus(item) {
			this.showLoading();
			let status = item.status === 1 ? 0 : 1;
			let msg = status === 1 ? '启用' : '禁用';
			this.axios
				.post(
					`/admin/${this.preUrl}/${item.id}/update_status`,
					{ status },
					{ token: true }
				)
				.then(() => {
					this.hideLoading();
					this.$message({
						message: msg + '成功',
						type: 'success',
					});
					item.status = status;
				})
				.catch(() => {
					this.hideLoading();
				});
		},
		// 删除单个
		deleteItem(item) {
			this.$confirm('是否要删除?', '提示', {
				confirmButtonText: '删除',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.showLoading();
					this.axios
						.post(
							`/admin/${this.preUrl}/${item.id}/delete`,
							{},
							{ token: true }
						)
						.then(() => {
							this.hideLoading();
							this.$message({
								message: '删除成功',
								type: 'success',
							});
							this.getList();
						})
						.catch(() => {
							this.hideLoading();
						});
				})
				.catch(() => {});
		},
	},
};
