<template>
	<div
		class="bg-white px-3"
		style="margin:-20px;margin-top:-1rem;margin-bottom:0!important;"
	>
		<el-tabs v-model="activeName">
			<el-tab-pane label="运费模板" name="second">
				<div>
					<el-button type="primary" size="mini">添加模板</el-button>
				</div>
				<el-table
					border
					class="mt-3 mb-3"
					:data="tableData"
					style="width: 100%"
				>
					<el-table-column
						label="模板名称"
						align="center"
						prop="name"
					>
					</el-table-column>

					<el-table-column
						label="计费方式"
						align="center"
						prop="discount"
					>
						<template slot-scope="scope">
							{{ scope.row.type | formatType }}
						</template>
					</el-table-column>
					<el-table-column label="排序" align="center" prop="order">
					</el-table-column>
					<el-table-column
						label="添加时间"
						align="center"
						prop="create_time"
					>
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
						<template>
							<el-button type="text" size="mini">修改</el-button>
							<el-button type="text" size="mini">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="物流跟踪" name="third">
				<el-form :model="form" label-width="160px">
					<el-form-item label="快递100 Customer">
						<el-input
							v-model="form.customer"
							size="mini"
							style="width: 50%;"
							placeholder="快递100 Customer"
						></el-input>
						<small class="text-secondary d-block"
							>用于查询物流信息,<a
								href="https://www.kuaidi100.com/?from=openv"
								target="_blank"
								>快递100申请</a
							></small
						>
					</el-form-item>
					<el-form-item label="快递100 Key">
						<el-input
							v-model="form.key"
							size="mini"
							style="width: 50%;"
							placeholder="快递100 Key"
						></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="mini">保存</el-button>
					</el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
export default {
	data() {
		return {
			activeName: 'second',
			form: {
				customer: '',
				key: '',
			},
			tableData: [
				{
					name: '全国统一邮费',
					type: 1,
					create_time: '2019-07-17 16:29:32',
					status: 1,
					order: 100,
				},
			],
		};
	},
	filters: {
		formatType(value) {
			let arr = ['按重量', '按件数'];
			return arr[value];
		},
	},
};
</script>

<style></style>
