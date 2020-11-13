<template>
	<div
		class="bg-white px-3"
		style="margin:-20px;margin-top:-1rem;margin-bottom:0!important;"
	>
		<button-search
			class="pt-3"
			ref="buttonSearch"
			placeholder="要搜索的商品名称"
			@search="searchEvent"
		>
			<template #left>
				<el-button size="mini" type="danger" @click="deleteAll"
					>批量删除</el-button
				>
			</template>
			<template #form>
				<el-form inline ref="form" :model="form" label-width="80px">
					<el-form-item label="评价用户" class="mb-0">
						<el-input
							v-model="form.username"
							size="mini"
							placeholder="评价用户"
						></el-input>
					</el-form-item>
					<el-form-item label="评价类型" class="mb-0">
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
					<el-form-item label="发布时间" class="mb-0">
						<el-date-picker
							v-model="form.time"
							type="daterange"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							size="mini"
						>
						</el-date-picker>
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
			<el-table-column type="expand">
				<template>
					<div class="media">
						<img
							src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1605247649015&di=e61f30fd8b50386d78906feaefe0f438&imgtype=0&src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202008%2F08%2F20200808135140_THdwT.thumb.400_0.jpeg"
							class="mr-3 rounded-circle"
							alt="avatar"
							style="height:70px;width:70px;"
						/>
						<div class="media-body">
							<h6 class="mt-0 d-flex">
								用户名2
								<small>2019-12-12 12:15:32</small>
								<el-button
									type="danger"
									size="mini"
									class="ml-auto"
									>删除</el-button
								>
							</h6>
							评论类容
							<div class="media mt-3">
								<a class="mr-3" href="#">
									<img
										src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1605247649015&di=e61f30fd8b50386d78906feaefe0f438&imgtype=0&src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202008%2F08%2F20200808135140_THdwT.thumb.400_0.jpeg"
										class="mr-3 rounded-circle"
										alt="avatar"
										style="height:70px;width:70px;"
									/>
								</a>
								<div class="media-body">
									<h6 class="mt-0 d-flex">
										客服一
										<small>2019-12-12 12:15:32</small>
										<el-button
											type="danger"
											size="mini"
											class="ml-auto"
											>删除</el-button
										>
									</h6>
									客服回复内容
								</div>
							</div>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column
				label="ID"
				align="center"
				prop="id"
				width="70"
			></el-table-column>
			<el-table-column label="商品" width="380">
				<template slot-scope="scope">
					<div class="media">
						<img
							:src="scope.row.goods.cover"
							alt="cover"
							class="mr-3"
							style="width:60px;height:60px;"
						/>
						<div class="media-body">
							<p class="mt-0">
								{{ scope.row.goods.title }}
							</p>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="评价信息" width="250">
				<template slot-scope="scope">
					<div class="d-flex flex-column">
						<p>用户名: {{ scope.row.username }}</p>
						<p>
							评分:
							<el-rate
								v-model="scope.row.star"
								disabled
								show-score
								text-color="#ff9900"
								score-template="{value}"
							></el-rate>
						</p>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="评价时间" align="center" prop="create_time">
			</el-table-column>
			<el-table-column label="是否显示" width="150" align="center">
				<template slot-scope="scope">
					<el-switch v-model="scope.row.status"></el-switch>
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
			tableData: [
				{
					id: 1,
					goods: {
						title: '商品标题',
						cover:
							'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1605247649015&di=e61f30fd8b50386d78906feaefe0f438&imgtype=0&src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202008%2F08%2F20200808135140_THdwT.thumb.400_0.jpeg',
					},
					username: '用户名',
					star: 5,
					create_time: '2019-12-12 14:15:33',
					status: 1,
				},
			],
			currentPage: 1,
			multipleSelection: [],
			form: {
				username: '',
				type: '',
				time: '',
			},
		};
	},
	methods: {
		// 清空筛选条件
		clearSearch() {},
		// 搜索事件
		searchEvent() {},
		// 批量删除
		deleteAll() {
			this.$confirm('是否要删除选中规格?', '提示', {
				confirmButtonText: '删除',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.multipleSelection.forEach((item) => {
						let index = this.tableData.findIndex(
							(v) => v.id === item.id
						);
						if (index !== -1) {
							this.tableData.splice(index, 1);
						}
					});
					this.multipleSelection = [];
					this.$message({
						message: '删除成功',
						type: 'success',
					});
				})
				.catch(() => {});
		},
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
