<template>
	<div
		class="bg-white px-3"
		style="margin:-20px;margin-top:-1rem;margin-bottom:0!important;"
	>
		<button-search class="pt-3">
			<template #right>
				<div class="d-flex align-items-center ml-auto">
					<el-date-picker
						v-model="search.time"
						type="daterange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						size="medium"
					>
					</el-date-picker>
					<el-input
						style="width:200px;"
						class="mx-2"
						v-model="search.keyword"
						size="medium"
						placeholder="请输入订单号"
					></el-input>
					<el-button type="info" size="medium">搜索</el-button>
				</div>
			</template>
		</button-search>
		<!-- 发票列表 -->
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
			<el-table-column
				label="订单编号"
				align="center"
				prop="name"
			></el-table-column>
			<el-table-column
				label="用户名"
				align="center"
				prop="username"
			></el-table-column>
			<el-table-column
				label="开票金额"
				align="center"
				prop="price"
			></el-table-column>
			<el-table-column label="抬头" align="center"></el-table-column>
			<el-table-column
				label="发票内容"
				align="center"
				prop="content"
			></el-table-column>
			<el-table-column
				label="纳税人识别号"
				align="center"
				prop="code"
			></el-table-column>
			<el-table-column
				label="创建时间"
				align="center"
				prop="create_time"
			></el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button
						type="danger"
						size="mini"
						plain
						@click="deleteItem(scope)"
						>删除</el-button
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
					:current-page="currentPage"
					:page-sizes="[100, 200, 300, 400]"
					:page-size="100"
					layout="total, sizes, prev, pager, next, jumper"
					:total="400"
				>
				</el-pagination>
			</div>
		</el-footer>
	</div>
</template>

<script>
import buttonSearch from '@/components/common/button-search.vue';
export default {
	components: { buttonSearch },
	data() {
		return {
			tableData: [],
			currentPage: 1,
			multipleSelection: [],
			search: {
				time: '',
				keyword: '',
			},
		};
	},
	methods: {
		// 表格选中
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},

		// 删除单个
		deleteItem(scope) {
			this.$confirm('是否要删除该规格?', '提示', {
				confirmButtonText: '删除',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.tableData.splice(scope.$index, 1);
					this.$message({
						message: '删除成功',
						type: 'success',
					});
				})
				.catch(() => {});
		},
	},
};
</script>

<style></style>
