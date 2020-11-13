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
					placeholder="要搜索的订单编号"
					@search="searchEvent"
				>
					<template #left>
						<el-button type="warning" size="mini"
							>导出数据</el-button
						>
						<el-button type="danger" size="mini"
							>批量删除</el-button
						>
					</template>
					<template #form>
						<el-form
							inline
							ref="form"
							:model="form"
							label-width="80px"
						>
							<el-form-item label="订单编号" class="mb-0">
								<el-input
									v-model="form.code"
									size="mini"
									placeholder="商品名称"
								></el-input>
							</el-form-item>
							<el-form-item label="订单状态" class="mb-0">
								<el-select
									v-model="form.type"
									size="mini"
									placeholder="请选择订单状态"
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
							<el-form-item label="下单时间" class="mb-0">
								<el-date-picker
									v-model="form.time"
									type="daterange"
									range-separator="至"
									start-placeholde="开始日期"
									end-placeholde="结束日期"
									size="mini"
								></el-date-picker>
							</el-form-item>
							<el-form-item label="收货人" class="mb-0">
								<el-input
									v-model="form.username"
									size="mini"
									placeholder="收货人"
								></el-input>
							</el-form-item>
							<el-form-item label="手机号" class="mb-0">
								<el-input
									v-model="form.phone"
									size="mini"
									placeholder="手机号"
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
					<el-table-column label="商品" width="350">
						<template slot-scope="scope">
							<div class="d-flex">
								<div style="flex:1;">
									<p class="mb-1">订单编号:</p>
									<p class="mb-1">
										<small>123456789</small>
									</p>
								</div>
								<div style="flex:1;">
									<p class="mb-1">下单时间:</p>
									<p class="mb-1">
										<small>2020-02-11</small>
									</p>
								</div>
							</div>
							<div class="media">
								<img
									:src="scope.row.cover"
									alt="cover"
									class="mr-3"
									style="width:60px;height:60px;"
								/>
								<div class="media-body">
									<p class="mt-0">
										<span
											class="text-primary"
											style="cursor:pointer;"
										>
											{{ scope.row.title }}
										</span>
									</p>
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="实付款" align="center" width="120">
						<template>
							<span>￥20</span>
							<p>
								<small>(含运费: ￥20)</small>
							</p>
						</template>
					</el-table-column>
					<el-table-column label="买家" align="center" width="120">
						<template>
							<span>用户名</span>
							<p>
								<small>(用户ID: 123456)</small>
							</p>
						</template>
					</el-table-column>
					<el-table-column label="支付方式" align="center">
						<template>
							<span class="badge badge-success">微信支付</span>
						</template>
					</el-table-column>
					<el-table-column
						prop="stock"
						label="配送方式"
						align="center"
					>
					</el-table-column>
					<el-table-column
						label="交易状态"
						align="center"
						width="170"
					>
						<template>
							<div>
								付款状态:
								<span class="badge badge-success">已付款</span>
							</div>
							<div>
								发货状态:
								<span class="badge badge-success">待发货</span>
							</div>
							<div>
								收货状态:
								<span class="badge badge-success">已付款</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="150" align="center">
						<template>
							<el-button type="primary" size="mini" plain
								>订单详情</el-button
							>
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
				{ name: '全部' },
				{ name: '待付款' },
				{ name: '待发货' },
				{ name: '已发货' },
				{ name: '已收货' },
				{ name: '已完成' },
				{ name: '已关闭' },
				{ name: '退款中' },
			],
			form: {
				code: '',
				type: '',
				time: '',
				username: '',
				phone: '',
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
						ischeck: 1, // 0未审核,1通过,2不通过
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
				code: '',
				type: '',
				time: '',
				username: '',
				phone: '',
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
