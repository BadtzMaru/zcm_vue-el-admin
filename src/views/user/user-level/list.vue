<template>
	<div
		class="bg-white px-3"
		style="margin:-20px;margin-top:-1rem;margin-bottom:0!important;"
	>
		<button-search class="pt-3" ref="buttonSearch">
			<template #left>
				<el-button size="mini" type="success" @click="openModel(false)"
					>添加等级</el-button
				>
			</template>
			<template #right>
				<div class="ml-auto">
					<small class="mr-2">请选择升级标准: </small>
					<el-radio-group v-model="level" size="mini">
						<el-radio-button :label="0">累计消费</el-radio-button>
						<el-radio-button :label="1">累计次数</el-radio-button>
					</el-radio-group>
				</div>
			</template>
		</button-search>
		<!-- 会员等级表格 -->
		<el-table
			border
			class="mt-3 mb-3"
			:data="tableData"
			style="width: 100%"
		>
			<el-table-column label="会员等级" align="center" prop="name">
			</el-table-column>
			<el-table-column label="升级条件" align="center" width="250">
				<template slot-scope="scope">
					{{ getLevel.name + ':' + scope.row[getLevel.value] }}
				</template>
			</el-table-column>
			<el-table-column label="折扣率(%)" align="center" prop="discount">
			</el-table-column>
			<el-table-column label="等级序号" align="center" prop="level">
			</el-table-column>
			<el-table-column label="状态" align="center">
				<template slot-scope="scope">
					<el-switch
						v-model="scope.row.status"
						:active-value="1"
						:inactive-value="0"
					></el-switch>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button type="text" size="mini" @click="openModel(scope)"
						>修改</el-button
					>
					<el-button
						type="text"
						size="mini"
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
		<!-- 新增/修改模态框 -->
		<el-dialog title="添加等级" :visible.sync="createModel" width="700px">
			<!-- 表单内容 -->
			<el-form ref="form" :model="form" label-width="80px">
				<el-form-item label="等级名称" prop="name">
					<el-input
						class="w-25"
						v-model="form.name"
						placeholder="等级名称"
						size="mini"
					></el-input>
					<small class="text-secondary d-block">
						设置会员等级名称
					</small>
				</el-form-item>
				<el-form-item label="等级权重">
					<el-input
						class="w-25"
						v-model="form.level"
						placeholder="等级权重"
						type="number"
						size="mini"
					></el-input>
					<small class="text-secondary d-block">
						设置会员等级排序(此参数决定等级的高低,排序越大等级越高,轻慎重选择)
					</small>
				</el-form-item>
				<el-form-item label="是否启用">
					<el-radio-group v-model="form.status" size="mini">
						<el-radio :label="1" border>启用</el-radio>
						<el-radio :label="0" border>禁用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="升级条件">
					<div>
						<small class="mr-2">累计消费满</small>
						<el-input
							v-model="form.consume"
							size="mini"
							placeholder="累计消费"
							style="width:35%;"
							type="number"
						>
							<template slot="append">元</template>
						</el-input>
						<small class="text-secondary d-block">
							设置会员等级所需要的累计消费必须大于0,单位: 元
						</small>
					</div>
					<div>
						<small class="mr-2">累计次数满</small>
						<el-input
							v-model="form.times"
							size="mini"
							placeholder="累计次数"
							style="width:35%;"
							type="number"
						>
							<template slot="append">次</template>
						</el-input>
						<small class="text-secondary d-block">
							设置会员等级所需要的购买数量必须大于0,单位: 笔
						</small>
					</div>
				</el-form-item>
				<el-form-item label="折扣率(%)">
					<el-input
						class="w-25"
						v-model="form.discount"
						placeholder="折扣率"
						size="mini"
						type="number"
					>
						<template slot="append">%</template>
					</el-input>
					<small class="text-secondary ml-2">
						折扣率单位为百分比,如输入99,则表示该会员等级的用户可以以商品原价的90%购买
					</small>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button @click="createModel = false">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import buttonSearch from '@/components/common/button-search.vue';
export default {
	inject: ['app'],
	components: { buttonSearch },
	data() {
		return {
			level: 0,
			tableData: [
				{
					name: '普通会员',
					consume: 100,
					times: 10,
					discount: 10,
					level: 1,
					status: 1,
					create_time: '2020-01-25',
				},
			],
			currentPage: 1,
			createModel: false,
			editIndex: -1,
			search: {
				keyword: '',
				group_id: 0,
				time: '',
			},
			form: {
				name: '',
				consume: 0,
				times: 0,
				discount: 0,
				level: 0,
				status: 1,
			},
		};
	},
	computed: {
		getLevel() {
			let arr = [
				{
					name: '累计消费',
					value: 'consume',
				},
				{
					name: '累计次数',
					value: 'times',
				},
			];
			return arr[this.level];
		},
	},
	methods: {
		// 打开模态框
		openModel(e = false) {
			// 增加
			if (!e) {
				// 初始化表单
				this.form = {
					name: '',
					consume: 0,
					times: 0,
					discount: 0,
					level: 0,
					status: 1,
				};
				this.editIndex = -1;
			} else {
				// 修改
				this.form = {
					name: e.row.name,
					consume: e.row.consume,
					times: e.row.times,
					discount: e.row.discount,
					level: e.row.level,
					status: e.row.status,
				};
				this.editIndex = e.$index;
			}
			// 打开dialog
			this.createModel = true;
		},
		// 修改状态
		changeStatus(item) {
			// 请求服务端修改状态
			item.status = item.status === 0 ? 1 : 0;
			this.$message({
				message: item.status ? '启用' : '禁用',
				type: 'success',
			});
		},
		// 添加规格
		submit() {
			let msg = '添加';
			if (this.editIndex === -1) {
				this.tableData.unshift(this.form);
			} else {
				this.$set(this.tableData, this.editIndex, this.form);
				msg = '修改';
			}
			// 关闭模态框
			this.createModel = false;
			this.$message({
				message: msg + '成功',
				type: 'success',
			});
		},
		// 删除单个
		deleteItem(scope) {
			this.$confirm('是否要删除该等级?', '提示', {
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
		// 清空筛选条件
		clearSearch() {
			this.search = {
				keyword: '',
				group_id: 0,
				time: '',
			};
			this.$refs.buttonSearch.closeSuperSearch();
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
		// 选择头像
		chooseImage() {
			this.app.chooseImage((res) => {
				this.form.avatar = res[0].url;
			}, 1);
		},
	},
};
</script>

<style></style>
