<template>
	<div
		class="bg-white px-3"
		style="margin:-20px;margin-top:-1rem;margin-bottom:0!important;"
	>
		<el-tabs v-model="tabIndex" @tab-click="handleClick">
			<el-tab-pane
				v-for="(tab, tabI) in tabbars"
				:key="tabI"
				:label="tab.name"
			>
				<button-search
					ref="buttonSearch"
					placeholder="要搜索的商品名称"
					@search="searchEvent"
				>
					<template #left>
						<el-button type="success" size="mini"
							>发布商品</el-button
						>
						<el-button type="warning" size="mini"
							>恢复商品</el-button
						>
						<el-button type="danger" size="mini"
							>批量删除</el-button
						>
						<el-button size="mini">上架</el-button>
						<el-button size="mini">下架</el-button>
						<el-button size="mini">推荐</el-button>
					</template>
					<template #form>
						<el-form
							inline
							ref="form"
							:model="form"
							label-width="80px"
						>
							<el-form-item label="商品名称" class="mb-0">
								<el-input
									v-model="form.name"
									size="mini"
									placeholder="商品名称"
								></el-input>
							</el-form-item>
							<el-form-item label="商品编码" class="mb-0">
								<el-input
									v-model="form.code"
									size="mini"
									placeholder="商品编码"
								></el-input>
							</el-form-item>
							<el-form-item label="商品类型" class="mb-0">
								<el-select
									v-model="form.type"
									size="mini"
									placeholder="请选择商品类型"
								>
									<el-option
										label="区域一"
										value="shanghai"
									></el-option>
									<el-option
										label="区域二"
										value="beijing"
									></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="商品分类" class="mb-0">
								<el-input
									v-model="form.category"
									size="mini"
									placeholder="商品分类"
								></el-input>
							</el-form-item>
							<el-form-item class="mb-0">
								<el-button
									type="info"
									size="mini"
									@click="searchEvent"
									>搜索</el-button
								>
								<el-button size="mini" @click="clearSearch"
									>清空筛选条件</el-button
								>
							</el-form-item>
						</el-form>
					</template>
				</button-search>
				<!-- 商品列表 -->
				<el-table
					border
					class="mt-3 mb-3"
					:data="tableData[tabI].list"
					style="width: 100%"
					@selection-change="handleSelectionChange"
				>
					<el-table-column
						type="selection"
						width="45"
						align="center"
					></el-table-column>
					<el-table-column label="商品" width="380">
						<template slot-scope="scope">
							<div class="media">
								<img
									:src="scope.row.cover"
									alt="cover"
									class="mr-3"
									style="width:60px;height:60px;"
								/>
								<div class="media-body">
									<p class="mt-0">
										{{ scope.row.title }}
									</p>
									<p class="mb-1">
										分类: {{ scope.row.category }}
									</p>
									<p class="mb-0">
										时间: {{ scope.row.create_time }}
									</p>
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column
						prop="type"
						label="商品类型"
						align="center"
					>
					</el-table-column>
					<el-table-column
						prop="sale_count"
						label="实际销量"
						align="center"
					>
					</el-table-column>
					<el-table-column
						prop="order"
						label="商品排序"
						align="center"
					>
					</el-table-column>
					<el-table-column label="商品状态" align="center">
						<template slot-scope="scope">
							<el-button
								type="success"
								size="mini"
								plain
								@click="scope.row.ischeck = 1"
								>审核通过</el-button
							>
							<el-button
								class="ml-0 mt-2"
								type="danger"
								size="mini"
								plain
								@click="scope.row.ischeck = 2"
								>审核通过</el-button
							>
						</template>
					</el-table-column>
					<el-table-column prop="stock" label="总库存" align="center">
					</el-table-column>
					<el-table-column
						prop="pprice"
						label="价格(元)"
						align="center"
					>
					</el-table-column>
					<el-table-column label="操作" width="150">
						<template slot-scope="scope">
							<el-button-group>
								<el-button type="primary" size="mini" plain
									>修改</el-button
								>
								<el-button
									type="danger"
									size="mini"
									plain
									@click="deleteItem(scope.$index)"
									>删除</el-button
								>
							</el-button-group>
						</template>
					</el-table-column>
				</el-table>
				<div style="height:60px;"></div>
				<el-footer
					class="border-top d-flex align-items-center px-0 position-fixed bg-white"
					style="bottom:0;left:200px;right:0;z-index:100;"
				>
					<div style="flex:1;" class="px-2">
						<el-pagination
							:current-page="tableData[tabI].currentPage"
							:page-sizes="[100, 200, 300, 400]"
							:page-size="100"
							layout="total, sizes, prev, pager, next, jumper"
							:total="400"
						>
						</el-pagination>
					</div>
				</el-footer>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
import buttonSearch from '@/components/common/button-search.vue';
export default {
	components: { buttonSearch },
	data() {
		return {
			tabIndex: '0',
			tabbars: [
				{ name: '审核中' },
				{ name: '出售中' },
				{ name: '已下架' },
				{ name: '库存预警' },
				{ name: '回收站' },
			],
			form: {
				name: '',
				code: '',
				type: '',
				category: '',
			},
			tableData: [],
			multipleSelection: [],
		};
	},
	created() {
		this.__getData();
	},
	methods: {
		// 上下架
		changeStatus(item) {
			item.status = item.status === 1 ? 0 : 1;
		},
		// 删除当前商品
		deleteItem(index) {
			this.$confirm('您确定要删除当前商品吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.tableData[this.tabIndex].list.splice(index, 1);
				})
				.catch(() => {});
		},
		// 生成数据
		__getData() {
			for (let i = 0; i < this.tabbars.length; i++) {
				this.tableData.push({
					currentPage: 1,
					list: [],
				});
				for (let j = 0; j < 20; j++) {
					this.tableData[i].list.push({
						id: j,
						title: '荣耀 V10全网通 标配版' + i + '-' + j,
						cover:
							'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=180920816,2890274133&fm=26&gp=0.jpg',
						create_time: '2019-07-17 18:34:14',
						category: '手机',
						type: '普通商品',
						sale_count: 20,
						order: 100,
						status: 1,
						stock: 200,
						pprice: 1000,
						ischeck: 1,
						// 0未审核,1通过,2不通过
					});
				}
			}
		},
		// 表格选中
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		// 加载数据
		handleClick(tab) {
			this.tabIndex = tab.index;
		},
		// 清空筛选条件
		clearSearch() {
			this.form = {
				name: '',
				code: '',
				type: '',
				category: '',
			};
			this.$refs.buttonSearch[this.tabIndex].closeSuperSearch();
		},
		// 搜索事件
		searchEvent(e = false) {
			// 简单搜索
			if (typeof e === 'string') {
				return console.log('简单搜索');
			}
			// 高级搜索
			console.log('搜索事件');
		},
	},
};
</script>

<style></style>
