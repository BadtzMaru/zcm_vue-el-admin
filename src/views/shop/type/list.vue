<template>
	<div
		class="bg-white px-3"
		style="margin:-20px;margin-top:-1rem;margin-bottom:0!important;"
	>
		<button-search class="pt-3" :showSearch="false">
			<template #left>
				<el-button size="mini" type="success" @click="openModel(false)"
					>添加类型</el-button
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
					{{ scope.row.goods_type_values | formatValue }}
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
							@click="deleteItem(scope.row)"
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
							v-for="(item, index) in form.sku_list"
							:key="index"
							class="py-2 border rounded mr-3 sku_list-item"
							style="line-height:1;min-width:80px;text-align:center;"
						>
							<font>{{ item.name }}</font>
							<i
								class="el-icon-delete"
								@click="deleteFormSkuList(index)"
							></i>
						</span>
						<el-button size="mini" @click="chooseSkus">
							<i class="el-icon-plus"></i>
						</el-button>
					</div>
				</el-form-item>
				<el-form-item label="属性列表">
					<el-table :data="form.value_list">
						<el-table-column label="排序" width="80">
							<template slot-scope="scope">
								<el-input
									v-model="scope.row.order"
									size="mini"
									placeholder="排序"
								></el-input>
							</template>
						</el-table-column>
						<el-table-column label="属性名称" width="130">
							<template slot-scope="scope">
								<el-input
									v-model="scope.row.name"
									size="mini"
									placeholder="属性名称"
								></el-input>
							</template>
						</el-table-column>
						<el-table-column label="所属类型" width="130">
							<template slot-scope="scope">
								<el-select
									v-model="scope.row.type"
									placeholder="请选择所属类型"
									size="mini"
								>
									<el-option
										label="输入框"
										value="input"
									></el-option>
									<el-option
										label="单选框"
										value="radio"
									></el-option>
									<el-option
										label="多选框"
										value="checkbox"
									></el-option>
								</el-select>
							</template>
						</el-table-column>
						<el-table-column
							label="是否显示"
							prop="status"
							width="80"
						>
							<template slot-scope="scope">
								<el-switch
									v-model="scope.row.status"
									:active-value="1"
									:inactive-value="0"
								></el-switch>
							</template>
						</el-table-column>
						<el-table-column label="属性值">
							<template
								slot-scope="scope"
								v-if="scope.row.type !== 'input'"
							>
								<el-input
									v-if="scope.row.isedit"
									type="textarea"
									v-model="scope.row.default"
									size="mini"
									placeholder="一行为一个属性值,多个属性值用换行输入"
								></el-input>
								<span v-else>{{ scope.row.default }}</span>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="180">
							<template slot-scope="scope">
								<el-button
									v-if="scope.row.type !== 'input'"
									type="text"
									size="mini"
									@click="editRow(scope)"
									>{{
										scope.row.isedit ? '完成' : '编辑属性值'
									}}</el-button
								>
								<el-button
									type="text"
									size="mini"
									@click="delRow(scope.$index)"
									>删除</el-button
								>
							</template>
						</el-table-column>
					</el-table>
				</el-form-item>
				<el-form-item>
					<el-button
						type="text"
						size="mini"
						icon="el-icon-plus"
						@click="addValue"
						>添加一个属性</el-button
					>
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
import common from '@/common/mixins/common.js';
export default {
	inject: ['layout', 'app'],
	mixins: [common],
	components: { buttonSearch },
	data() {
		return {
			preUrl: 'goods_type',
			tableData: [],
			currentPage: 1,
			multipleSelection: [],
			createModel: false,
			editIndex: -1,
			form: {
				name: '',
				order: 50,
				status: 1,
				sku_list: [],
				value_list: [],
			},
			rules: {
				name: [
					{
						required: true,
						message: '类型名称不能为空',
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
	computed: {
		// 关联规格id组成的一维数组
		skus_id() {
			return this.form.sku_list.map((item) => item.id);
		},
	},
	methods: {
		getListResult(e) {
			this.tableData = e.list.map((item) => {
				item.value_list = item.goods_type_values;
				item.sku_list = item.skus;
				return item;
			});
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
					sku_list: [],
					value_list: [],
				};
				this.editIndex = -1;
			} else {
				// 修改
				this.form = {
					...e.row,
					value_list: [...e.row.value_list],
				};
				this.editIndex = e.$index;
			}
			// 打开dialog
			this.createModel = true;
		},
		// 添加类型
		submit() {
			this.$refs.form.validate((res) => {
				// 验证属性列表
				let result = true;
				let message = [];
				this.form.value_list.forEach((item, index) => {
					let no = index + 1;
					if (item.order === '') {
						result = result && false;
						message.push('第' + no + '行,排序不能为空');
					}
					if (item.name === '') {
						result = result && false;
						message.push('第' + no + '行,属性名称不能为空');
					}
					if (item.type !== 'input' && item.default === '') {
						result = result && false;
						message.push('第' + no + '行,属性值不能为空');
					}
				});
				if (!result) {
					let temp = '';
					message.forEach((v) => {
						temp += `<li>${v}</li>`;
					});
					return this.$notify({
						title: '属性提示',
						dangerouslyUseHTMLString: true,
						message: `<ul>${temp}</ul>`,
						type: 'warning',
						duration: 3000,
					});
				}
				if (res) {
					let value_list = this.form.value_list.map((item) => {
						let temp = '';
						if (item.default) {
							temp = item.default.replace(/\n/g, ',');
						}
						return { ...item, default: temp };
					});

					let data = {
						...this.form,
						value_list,
						skus_id: this.skus_id,
					};
					let id = 0;
					if (this.editIndex !== -1) {
						id = this.tableData[this.editIndex].id;
					}
					// 关闭模态框
					this.addOrEdit(data, id);
					this.createModel = false;
				}
			});
		},
		// 添加属性
		addValue() {
			this.form.value_list.push({
				order: 50,
				name: '',
				type: 'input',
				default: '',
				isedit: false,
			});
		},
		// 编辑属性
		editRow(scope) {
			scope.row.isedit = !scope.row.isedit;
		},
		// 删除属性值
		delRow(index) {
			this.form.value_list.splice(index, 1);
		},
		chooseSkus() {
			this.app.chooseSkus((e) => {
				let index = this.form.sku_list.findIndex((item) => {
					return item.id === e.id;
				});
				if (index === -1) {
					this.form.sku_list.push(e);
				}
			});
		},
		deleteFormSkuList(index) {
			this.form.sku_list.splice(index, 1);
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
