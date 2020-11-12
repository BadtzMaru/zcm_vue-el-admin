<template>
	<div
		class="bg-white px-3"
		style="margin:-20px;margin-top:-1rem;margin-bottom:0!important;"
	>
		<button-search class="pt-3" :showSearch="false">
			<template #left>
				<el-button size="mini" type="success" @click="openModel(false)"
					>添加规格</el-button
				>
				<el-button size="mini" type="danger" @click="deleteAll"
					>批量删除</el-button
				>
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
			<el-table-column
				label="类型名称"
				align="center"
				prop="name"
			></el-table-column>
			<el-table-column label="属性标签" align="center" width="380">
				<template slot-scope="scope">
					{{ scope.row.value_list | formatValue }}
				</template>
			</el-table-column>
			<el-table-column prop="order" label="排序" align="center">
			</el-table-column>
			<el-table-column label="状态" align="center">
				<template slot-scope="scope">
					<el-button
						@click="changeStatus(scope.row)"
						:type="scope.row.status ? 'success' : 'danger'"
						size="mini"
						plain
						>{{ scope.row.status ? '启用' : '禁用' }}</el-button
					>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button-group>
						<el-button
							type="primary"
							size="mini"
							plain
							@click="openModel(scope)"
							>修改</el-button
						>
						<el-button
							type="danger"
							size="mini"
							plain
							@click="deleteItem(scope)"
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
		<el-dialog
			width="80%"
			title="添加类型"
			:visible.sync="createModel"
			top="5vh"
		>
			<!-- 表单内容 -->
			<el-form ref="form" :model="form" :rules="rules" label-width="80px">
				<el-form-item label="类型名称" prop="name">
					<el-input
						class="w-25"
						v-model="form.name"
						placeholder="类型名称"
						size="mini"
					></el-input>
				</el-form-item>
				<el-form-item label="排序">
					<el-input-number
						size="mini"
						v-model="form.order"
						:min="0"
					></el-input-number>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="form.status" size="mini">
						<el-radio :label="1" border>启用</el-radio>
						<el-radio :label="0" border>禁用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="关联规格">
					<div class="d-flex">
						<span
							class="py-2 border rounded mr-3 sku_list-item"
							style="line-height:1;min-width:80px;text-align:center;"
						>
							<font>颜色</font>
							<i class="el-icon-delete"></i>
						</span>
						<el-button size="mini">
							<i class="el-icon-plus"></i>
						</el-button>
					</div>
				</el-form-item>
				<el-form-item label="属性列表">
					属性列表
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
	components: { buttonSearch },
	data() {
		return {
			tableData: [
				{
					id: 1,
					name: '鞋子',
					order: 50,
					status: 1,
					sku_list: [
						{ id: 1, name: '颜色' },
						{ id: 2, name: '尺寸' },
					],
					value_list: [
						{ order: 50, name: '特性', type: 'input', value: '' },
						{ order: 50, name: '电池', type: 'radio', value: '' },
					],
				},
			],
			currentPage: 1,
			multipleSelection: [],
			createModel: false,
			editIndex: -1,
			form: {
				name: '',
				order: 50,
				status: 1,
				type: 0,
				value: '',
			},
			rules: {
				name: [
					{
						required: true,
						message: '规格名称不能为空',
						trigger: 'blur',
					},
				],
				value: [
					{
						required: true,
						message: '规格值不能为空',
						trigger: 'blur',
					},
				],
			},
		};
	},
	filters: {
		formatValue(value) {
			let arr = value.map((v) => v.name);
			return arr.join(',');
		},
	},
	methods: {
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
		// 打开模态框
		openModel(e = false) {
			// 增加
			if (!e) {
				// 初始化表单
				this.form = {
					name: '',
					order: 50,
					status: 1,
					type: 0,
					value: '',
				};
				this.editIndex = -1;
			} else {
				// 修改
				this.form = {
					name: e.row.name,
					order: e.row.order,
					status: e.row.status,
					type: e.row.type,
					value: e.row.value.replace(/,/g, '\n'),
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
		// 表格选中
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		// 添加规格
		submit() {
			this.$refs.form.validate((res) => {
				if (res) {
					let msg = '添加';
					this.form.value = this.form.value.replace(/\n/g, ',');
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
				}
			});
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

<style>
.sku_list-item > i {
	display: none;
	cursor: pointer;
}
.sku_list-item:hover {
	background-color: #f4f4f4;
}
.sku_list-item:hover > font {
	display: none;
}
.sku_list-item:hover > i {
	display: inline-block;
}
</style>
