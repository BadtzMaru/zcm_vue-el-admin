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
				<div>
					<small class="mr-2">请选择升级标准: </small>
					<el-radio-group v-model="level" size="mini">
						<el-radio-button label="累计消费"></el-radio-button>
						<el-radio-button label="累计次数"></el-radio-button>
					</el-radio-group>
				</div>
			</template>
		</button-search>
		<!-- 商品列表 -->
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
					{{
						level +
							':' +
							(level === '累计消费'
								? scope.row.consume
								: scope.row.times)
					}}
				</template>
			</el-table-column>
			<el-table-column label="折扣率" align="center" prop="discount">
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
					<el-button type="text" size="mini">重置密码</el-button>
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
		<el-dialog title="添加会员" :visible.sync="createModel" top="5vh">
			<!-- 表单内容 -->
			<el-form ref="form" :model="form" label-width="80px">
				<el-form-item label="用户名" prop="name">
					<el-input
						class="w-25"
						v-model="form.username"
						placeholder="用户名"
						size="mini"
					></el-input>
				</el-form-item>
				<el-form-item label="密码">
					<el-input
						class="w-25"
						v-model="form.password"
						placeholder="密码"
						type="password"
						size="mini"
					></el-input>
				</el-form-item>
				<el-form-item label="昵称">
					<el-input
						class="w-25"
						v-model="form.nickname"
						placeholder="昵称"
						size="mini"
					></el-input>
				</el-form-item>
				<el-form-item label="头像">
					<div>
						<span
							v-if="!form.avatar"
							class="btn btn-light border text-center"
							style="width:45px;height:45px;line-height:33px;"
							@click="chooseImage"
						>
							<i class="el-icon-plus"></i>
						</span>
						<img
							v-else
							:src="form.avatar"
							alt="image"
							style="width:45px;height:45px;cursor:pointer;"
							class="rounded"
							@click="chooseImage"
						/>
					</div>
				</el-form-item>
				<el-form-item label="会员等级">
					<el-select
						size="mini"
						v-model="form.level_id"
						placeholder="请选择会员等级"
					>
						<el-option
							label="普通会员"
							value="shanghai"
						></el-option>
						<el-option label="黄金会员" value="beijing"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="手机" prop="phone">
					<el-input
						class="w-25"
						v-model="form.phone"
						placeholder="手机"
						size="mini"
					></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input
						class="w-25"
						v-model="form.email"
						placeholder="邮箱"
						size="mini"
					></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="form.sex" size="mini">
						<el-radio :label="0" border>保密</el-radio>
						<el-radio :label="1" border>男性</el-radio>
						<el-radio :label="2" border>女性</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="form.status" size="mini">
						<el-radio :label="1" border>启用</el-radio>
						<el-radio :label="0" border>禁用</el-radio>
					</el-radio-group>
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
			level: '累计消费',
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
				username: '',
				password: '',
				nickname: '',
				avatar: '',
				status: 1,
				level_id: 1,
				phone: '',
				email: '',
				sex: 0,
				level: null,
			},
		};
	},
	methods: {
		// 打开模态框
		openModel(e = false) {
			// 增加
			if (!e) {
				// 初始化表单
				this.form = {
					username: '',
					password: '',
					nickname: '',
					avatar: '',
					status: 1,
					level_id: 1,
					phone: '',
					email: '',
					sex: 0,
					level: null,
				};
				this.editIndex = -1;
			} else {
				// 修改
				this.form = {
					username: e.row.username,
					password: '',
					nickname: e.row.nickname,
					avatar: e.row.avatar,
					status: e.row.status,
					level_id: e.row.level_id,
					phone: e.row.phone,
					email: e.row.email,
					sex: e.row.sex,
					level: e.row.level,
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
				this.form.level = {
					id: 1,
					name: '普通会员',
				};
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
			this.$confirm('是否要删除该会员?', '提示', {
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
