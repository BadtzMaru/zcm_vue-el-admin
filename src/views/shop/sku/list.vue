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
				label="规格名称"
				align="center"
				prop="name"
			></el-table-column>
			<el-table-column
				prop="default"
				label="规格值"
				align="center"
				width="380"
			>
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
			:title="editIndex > -1 ? '修改规格' : '添加规格'"
			:visible.sync="createModel"
			top="5vh"
		>
			<!-- 表单内容 -->
			<el-form ref="form" :model="form" :rules="rules" label-width="80px">
				<el-form-item label="规格名称" prop="name">
					<el-input
						class="w-25"
						v-model="form.name"
						placeholder="规格名称"
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
				<el-form-item label="类型">
					<el-radio-group v-model="form.type" size="mini">
						<el-radio :label="0" border>文字</el-radio>
						<el-radio :label="1" border>颜色</el-radio>
						<el-radio :label="2" border>图片</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="规格值" prop="default">
					<el-input
						type="textarea"
						:rows="3"
						placeholder="一行一个规格项,多个规格项用换行来输入"
						v-model="form.default"
					></el-input>
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
	inject: ['layout'],
	mixins: [common],
	components: { buttonSearch },
	data() {
		return {
			preUrl: 'skus',
			tableData: [],
			createModel: false,
			editIndex: -1,
			form: {
				name: '',
				order: 50,
				status: 1,
				type: 0,
				default: '',
			},
			rules: {
				name: [
					{
						required: true,
						message: '规格名称不能为空',
						trigger: 'blur',
					},
				],
				default: [
					{
						required: true,
						message: '规格值不能为空',
						trigger: 'blur',
					},
				],
			},
		};
	},

	methods: {
		getListResult(e) {
			this.tableData = e.list;
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
					default: '',
				};
				this.editIndex = -1;
			} else {
				// 修改
				this.form = {
					name: e.row.name,
					order: e.row.order,
					status: e.row.status,
					type: e.row.type,
					default: e.row.default.replace(/,/g, '\n'),
				};
				this.editIndex = e.$index;
			}
			// 打开dialog
			this.createModel = true;
		},
		// 添加规格
		submit() {
			this.$refs.form.validate((res) => {
				if (res) {
					this.form.default = this.form.default.replace(/\n/g, ',');
					let id = 0;
					if (this.editIndex !== -1)
						id = this.tableData[this.editIndex].id;
					this.addOrEdit(this.form, id);
				}
			});
		},
	},
};
</script>

<style></style>
