<template>
	<div
		class="bg-white px-3"
		style="margin:-20px;margin-top:-1rem;margin-bottom:0!important;"
	>
		<button-search
			class="pt-3"
			placeholder="手机号/邮箱/会员昵称"
			ref="buttonSearch"
			@search="searchEvent"
		>
			<template #left>
				<el-button size="mini" type="success" @click="openModel(false)"
					>添加会员</el-button
				>
			</template>
			<template #form>
				<el-form inline ref="form" :model="form" label-width="80px">
					<el-form-item label="搜索内容" class="mb-0">
						<el-input
							v-model="search.keyword"
							size="mini"
							placeholder="手机号/邮箱/会员昵称"
						></el-input>
					</el-form-item>
					<el-form-item label="会员等级" class="mb-0">
						<el-select
							v-model="search.user_level_id"
							placeholder="请选择会员等级"
							size="mini"
						>
							<el-option
								v-for="(item, index) in user_level"
								:key="index"
								:label="item.name"
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
		>
			<el-table-column label="会员" width="280">
				<template slot-scope="scope">
					<div class="media">
						<img
							:src="scope.row.avatar"
							class="mr-3 rounded-circle"
							alt="avatar"
							style="width:40px;height:40px;"
						/>
						<div class="media-body">
							<h6 class="mt-0 d-flex align-items-center">
								{{ scope.row.username }}
								<el-button
									type="text"
									size="mini"
									class="ml-auto"
									>详情</el-button
								>
							</h6>
							用户ID: {{ scope.row.id }}
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="会员等级" align="center">
				<template slot-scope="scope">
					{{ scope.row.user_level.name }}
				</template>
			</el-table-column>
			<el-table-column label="登陆注册" align="center" width="250">
				<template slot-scope="scope">
					<div>注册时间: {{ scope.row.create_time }}</div>
					<div>最后登录: {{ scope.row.last_login_time }}</div>
				</template>
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
					<el-button type="text" size="mini">重置密码</el-button>
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
import common from '@/common/mixins/common.js';
export default {
	inject: ['app', 'layout'],
	mixins: [common],
	components: { buttonSearch },
	data() {
		return {
			preUrl: 'user',
			tableData: [],
			createModel: false,
			editIndex: -1,
			search: {
				keyword: '',
				user_level_id: '',
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
			user_level: [],
		};
	},
	methods: {
		getListResult(e) {
			console.log(e);
			this.tableData = e.list;
			this.user_level = e.user_level;
		},
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
		// 清空筛选条件
		clearSearch() {
			this.search = {
				keyword: '',
				user_level_id: '',
			};
			this.$refs.buttonSearch.closeSuperSearch();
			this.getList();
		},
		getListUrl() {
			return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}&keyword=${this.search.keyword}&user_level_id=${this.search.user_level_id}`;
		},
		// 搜索事件
		searchEvent(e = false) {
			if (typeof e === 'string') {
				// 简单搜索
				this.search.keyword = e;
				this.getList();
			} else {
				// 高级搜索
				this.getList();
			}
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
