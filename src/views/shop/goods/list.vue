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
			</el-tab-pane>
		</el-tabs>
		<button-search
			ref="buttonSearch"
			placeholder="要搜索的商品名称"
			@search="searchEvent"
		>
			<template #left>
				<router-link :to="{ name: 'shop_goods_create' }" class="mr-2">
					<el-button type="success" size="mini">发布商品</el-button>
				</router-link>

				<el-button
					type="warning"
					size="mini"
					v-if="tab === 'delete'"
					@click="doEvent('restore')"
					>恢复商品</el-button
				>
				<el-button
					type="danger"
					size="mini"
					v-if="tab === 'delete'"
					@click="doEvent('destroy')"
					>彻底删除</el-button
				>
				<el-button
					type="danger"
					size="mini"
					v-if="tab !== 'delete'"
					@click="deleteAll"
					>批量删除</el-button
				>
				<el-button
					size="mini"
					v-if="tab === 'all' || tab === 'off'"
					@click="changeStatus(1)"
					>上架</el-button
				>
				<el-button
					size="mini"
					v-if="tab === 'all' || tab === 'saling'"
					@click="changeStatus(0)"
					>下架</el-button
				>
			</template>
			<template #form>
				<el-form inline ref="form" :model="form" label-width="80px">
					<el-form-item label="商品名称" class="mb-0">
						<el-input
							v-model="form.title"
							size="mini"
							placeholder="商品名称"
						></el-input>
					</el-form-item>
					<el-form-item label="商品分类" class="mb-0">
						<el-select
							v-model="form.category_id"
							placeholder="请选择商品分类"
							size="mini"
						>
							<el-option
								v-for="(item, index) in cateOptions"
								:key="index"
								:label="item | tree"
								:value="item.id"
							></el-option>
						</el-select>
					</el-form-item>
					<el-form-item class="mb-0">
						<el-button type="info" size="mini" @click="searchEvent"
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
			:data="tableData"
			style="width: 100%"
			@selection-change="handleSelectionChange"
		>
			<el-table-column
				type="selection"
				width="45"
				align="center"
			></el-table-column>
			<el-table-column label="商品" width="300">
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
								分类: {{ scope.row.category.name }}
							</p>
							<p class="mb-0">
								时间: {{ scope.row.create_time }}
							</p>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column
				prop="sale_count"
				label="实际销量"
				align="center"
				width="80"
			>
			</el-table-column>
			<el-table-column label="商品状态" align="center" width="80">
				<template slot-scope="scope">
					<span
						class="badge"
						:class="
							scope.row.status ? 'badge-success' : 'badge-danger'
						"
						>{{ scope.row.status ? '上架' : '仓库' }}</span
					>
				</template>
			</el-table-column>
			<el-table-column label="审核状态" align="center" width="120">
				<template slot-scope="scope">
					<div class="d-flex flex-column" v-if="!scope.row.ischeck">
						<el-button
							type="success"
							size="mini"
							plain
							@click="checkGoods(scope.row, 1)"
							>审核通过</el-button
						>
						<el-button
							class="ml-0 mt-2"
							type="danger"
							size="mini"
							plain
							@click="checkGoods(scope.row, 2)"
							>审核拒绝</el-button
						>
					</div>
					<span v-else>
						{{ scope.row.ischeck === 1 ? '通过' : '拒绝' }}</span
					>
				</template>
			</el-table-column>
			<el-table-column
				prop="stock"
				label="总库存"
				align="center"
				width="90"
			>
			</el-table-column>
			<el-table-column label="价格(元)" align="center" width="120">
				<template slot-scope="scope">
					<span class="text-danger">￥{{ scope.row.min_price }}</span>
					<span>/</span>
					<span class="text-muted">￥{{ scope.row.min_oprice }}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button
						type="text"
						size="mini"
						@click="navigate('shop_goods_create', scope.row.id)"
						>基础设置</el-button
					>
					<el-button
						type="text"
						size="mini"
						@click="navigate('shop_goods_sku', scope.row.id)"
						:class="
							(scope.row.sku_type === 0 &&
								!scope.row.sku_value) ||
							(scope.row.sku_type === 1 &&
								!scope.row.goods_skus.length)
								? 'text-danger'
								: ''
						"
						>商品规格</el-button
					>
					<el-button
						type="text"
						size="mini"
						@click="navigate('shop_goods_attr', scope.row.id)"
						:class="
							!scope.row.goods_attrs.length ? 'text-danger' : ''
						"
						>商品属性</el-button
					>
					<el-button
						type="text"
						size="mini"
						@click="navigate('shop_goods_banner', scope.row.id)"
						:class="
							!scope.row.goods_banner.length ? 'text-danger' : ''
						"
						>媒体设置</el-button
					>
					<el-button
						type="text"
						size="mini"
						@click="navigate('shop_goods_content', scope.row.id)"
						:class="!scope.row.content ? 'text-danger' : ''"
						>商品详情</el-button
					>
					<el-button
						type="text"
						size="mini"
						@click="deleteItem(scope.row)"
						>删除商品</el-button
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
					:current-page="page.current"
					:page-sizes="page.sizes"
					:page-size="page.size"
					:total="page.total"
					layout="total, sizes, prev, pager, next, jumper"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
				>
				</el-pagination>
			</div>
		</el-footer>
	</div>
</template>

<script>
import buttonSearch from '@/components/common/button-search.vue';
import common from '@/common/mixins/common.js';
export default {
	inject: ['layout'],
	mixins: [common],
	components: { buttonSearch },
	data() {
		return {
			preUrl: 'goods',
			tabIndex: '0',
			tabbars: [
				{ name: '全部', key: 'all' },
				{ name: '审核中', key: 'checking' },
				{ name: '出售中', key: 'saling' },
				{ name: '已下架', key: 'off' },
				{ name: '库存预警', key: 'min_stock' },
				{ name: '回收站', key: 'delete' },
			],
			form: {
				title: '',
				category_id: '',
			},
			tableData: [],
			cateOptions: [],
		};
	},
	computed: {
		tab() {
			return this.tabbars[this.tabIndex].key;
		},
		params() {
			let str = '';
			for (let key in this.form) {
				let val = this.form[key];
				if (val) {
					str += `&${key}=${val}`;
				}
			}
			return str;
		},
	},
	filters: {
		tree(item) {
			if (item.level == 0) {
				return item.name;
			}
			let str = '';
			for (let i = 0; i < item.level; i++) {
				str += i == 0 ? '|--' : '--';
			}
			return str + ' ' + item.name;
		},
	},

	methods: {
		navigate(name, id) {
			this.$router.push({
				name,
				params: { id },
			});
		},
		// 上下架
		changeStatus(status) {
			if (this.ids.length === 0) {
				return this.$message({
					message: '请选择要操作的商品',
					type: 'warning',
				});
			}
			this.layout.showLoading();
			this.axios
				.post(
					`/admin/goods/changestatus`,
					{ ids: this.ids, status },
					{ token: true }
				)
				.then(() => {
					this.layout.hideLoading();
					this.getList();
					this.$message({
						message: '操作成功',
						type: 'success',
					});
				})
				.catch(() => {
					this.layout.hideLoading();
				});
		},
		doEvent(key) {
			if (this.ids.length === 0) {
				return this.$message({
					message: '请选择要操作的商品',
					type: 'warning',
				});
			}
			this.layout.showLoading();
			this.axios
				.post(`/admin/goods/${key}`, { ids: this.ids }, { token: true })
				.then(() => {
					this.layout.hideLoading();
					this.$message({
						message: '恢复成功',
						type: 'success',
					});
					this.getList();
				})
				.catch(() => {
					this.layout.hideLoading();
				});
		},
		getListUrl() {
			return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}&tab=${this.tab}${this.params}`;
		},
		getListResult(e) {
			this.tableData = e.list;
			this.cateOptions = e.cates;
		},
		// 加载数据
		handleClick(tab) {
			this.tabIndex = tab.index;
			this.getList();
		},
		// 清空筛选条件
		clearSearch() {
			this.form = {
				title: '',
				category_id: '',
			};
		},
		// 搜索事件
		searchEvent(e = false) {
			if (typeof e === 'string') {
				this.form.title = e;
			}
			this.getList();
		},
		checkGoods(item, ischeck) {
			this.layout.showLoading();
			this.axios
				.post(
					`/admin/goods/${item.id}/check`,
					{ ischeck },
					{ token: true }
				)
				.then(() => {
					this.layout.hideLoading();
					this.$message({
						message: '操作成功',
						type: 'success',
					});
					this.getList();
				})
				.catch(() => {
					this.layout.hideLoading();
				});
		},
	},
};
</script>

<style></style>
