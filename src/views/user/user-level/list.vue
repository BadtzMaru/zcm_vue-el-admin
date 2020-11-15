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
					<el-button type="text" size="mini" @click="openModel(scope)"
						>修改</el-button
					>
					<el-button
						type="text"
						size="mini"
						@click="deleteItem(scope.row)"
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
							v-model="form.max_price"
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
							v-model="form.max_times"
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
import common from '@/common/mixins/common.js';
export default {
	inject: ['app', 'layout'],
	mixins: [common],
	components: { buttonSearch },
	data() {
		return {
			preUrl: 'user_level',
			level: 0,
			tableData: [],
			createModel: false,
			editIndex: -1,
			form: {
				name: '',
				max_price: 0,
				max_times: 0,
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
					value: 'max_price',
				},
				{
					name: '累计次数',
					value: 'max_times',
				},
			];
			return arr[this.level];
		},
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
					max_price: 0,
					max_times: 0,
					discount: 0,
					level: 0,
					status: 1,
				};
				this.editIndex = -1;
			} else {
				// 修改
				this.form = {
					name: e.row.name,
					max_price: e.row.max_price,
					max_times: e.row.max_times,
					discount: e.row.discount,
					level: e.row.level,
					status: e.row.status,
				};
				this.editIndex = e.$index;
			}
			// 打开dialog
			this.createModel = true;
		},
		// 添加规格
		submit() {
			let id = 0;
			if (this.editIndex !== -1) {
				id = this.tableData[this.editIndex].id;
			}
			// 关闭模态框
			this.addOrEdit(this.form, id);
			this.createModel = false;
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
