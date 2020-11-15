<template>
	<div
		class="bg-white px-3"
		style="margin:-20px;margin-top:-1rem;margin-bottom:0!important;"
	>
		<el-tabs v-model="preUrl" @tab-click="getList">
			<el-tab-pane label="管理员列表" name="manager">
				<div class="d-flex align-items-center">
					<el-button
						type="primary"
						size="mini"
						@click="openDialog('manager')"
						>添加管理员</el-button
					>
					<div class="ml-auto d-flex">
						<el-input
							v-model="keyword"
							size="mini"
							style="width:200px;"
							placeholder="请输入用户名"
						></el-input>
						<el-button
							type="info"
							size="mini"
							class="ml-2"
							@click="getList"
							>搜索</el-button
						>
					</div>
				</div>
				<el-table
					border
					class="mt-3 mb-3"
					:data="managerList"
					style="width: 100%"
				>
					<el-table-column label="用户头像" align="center">
						<template slot-scope="scope">
							<el-avatar
								size="large"
								:src="scope.row.avatar"
							></el-avatar>
						</template>
					</el-table-column>
					<el-table-column
						label="用户名"
						align="center"
						prop="username"
					>
					</el-table-column>
					<el-table-column label="所属管理员" align="center">
						<template slot-scope="scope">
							{{ scope.row.role.name }}
						</template>
					</el-table-column>
					<el-table-column label="状态" align="center">
						<template slot-scope="scope">
							<el-button
								@click="changeStatus(scope.row)"
								:type="scope.row.status ? 'success' : 'danger'"
								size="mini"
								plain
								>{{
									scope.row.status ? '启用' : '禁用'
								}}</el-button
							>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="150">
						<template slot-scope="scope">
							<el-button
								type="text"
								size="mini"
								@click="openDialog('manager', scope.row)"
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
			</el-tab-pane>
			<el-tab-pane label="角色列表" name="role">
				<div class="d-flex align-items-center">
					<el-button
						type="primary"
						size="mini"
						v-auth="'添加角色'"
						@click="openDialog('role')"
						>添加角色</el-button
					>
				</div>
				<el-table
					border
					class="mt-3 mb-3"
					:data="roleList"
					style="width: 100%"
				>
					<el-table-column
						label="角色名称"
						align="center"
						prop="name"
					>
					</el-table-column>
					<el-table-column
						label="角色描述"
						align="center"
						prop="desc"
					>
					</el-table-column>
					<el-table-column label="状态" align="center">
						<template slot-scope="scope">
							<el-button
								@click="changeStatus(scope.row)"
								:type="scope.row.status ? 'success' : 'danger'"
								size="mini"
								plain
								>{{
									scope.row.status ? '启用' : '禁用'
								}}</el-button
							>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="250">
						<template slot-scope="scope">
							<el-button
								type="text"
								size="mini"
								@click="openDialog('role', scope.row)"
								>修改</el-button
							>
							<el-button type="text" size="mini"
								>配置权限</el-button
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
			</el-tab-pane>
			<el-tab-pane label="权限管理" name="rule">
				<el-tree
					class="mb-3"
					:data="data"
					:props="defaultProps"
					@node-click="handleNodeClick"
					default-expand-all
					:expand-on-click-node="false"
					:draggable="true"
					@node-drop="nodeDrop"
				>
					<span class="custom-tree-node" slot-scope="{ node, data }">
						<div>
							<el-input
								v-if="data.editStatus"
								v-model="data.label"
								size="mini"
							></el-input>
							<span v-else>{{ node.label }}</span>
						</div>
						<span>
							<el-button
								:type="data.status ? 'primary' : 'danger'"
								size="mini"
								@click.stop="showOrHide(data)"
								>{{ data.status ? '显示' : '隐藏' }}</el-button
							>
							<el-button
								type="success"
								size="mini"
								@click.stop="append(data)"
								v-auth="'添加规则'"
								>增加</el-button
							>
							<el-button
								:type="data.editStatus ? 'default' : 'warning'"
								size="mini"
								@click.stop="edit(data)"
								>{{
									data.editStatus ? '完成' : '修改'
								}}</el-button
							>
							<el-button
								type="danger"
								size="mini"
								@click.stop="remove(node, data)"
								>删除</el-button
							>
						</span>
					</span>
				</el-tree>
			</el-tab-pane>
		</el-tabs>
		<div style="height:60px;" v-if="preUrl !== 'rule'"></div>
		<el-footer
			v-if="preUrl !== 'rule'"
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
		<!-- 模态框 -->
		<el-dialog
			title="标题"
			:visible.sync="dialogVisible"
			:before-close="handleClose"
			width="70%"
		>
			<!-- 添加|修改管理员 -->
			<el-form
				v-if="preUrl === 'manager'"
				label-width="80px"
				:model="form.manager"
			>
				<el-form-item label="用户名">
					<el-input v-model="form.manager.username"></el-input>
				</el-form-item>
				<el-form-item label="密码">
					<el-input
						type="password"
						v-model="form.manager.password"
					></el-input>
				</el-form-item>
				<el-form-item label="头像">
					<div>
						<span
							v-if="!form.manager.avatar"
							class="btn btn-light border text-center"
							style="width:45px;height:45px;line-height:33px;"
							@click="chooseImage"
						>
							<i class="el-icon-plus"></i>
						</span>
						<img
							v-else
							:src="form.manager.avatar"
							alt="image"
							style="width:45px;height:45px;cursor:pointer;"
							class="rounded"
							@click="chooseImage"
						/>
					</div>
				</el-form-item>
				<el-form-item label="所属角色">
					<el-select
						size="mini"
						v-model="form.manager.role_id"
						placeholder="请选择所属角色"
					>
						<el-option
							v-for="(item, index) in roleOptions"
							:key="index"
							:label="item.name"
							:value="item.id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="form.manager.status" size="mini">
						<el-radio :label="1" border>启用</el-radio>
						<el-radio :label="0" border>禁用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<!-- 添加|修改角色 -->
			<el-form
				v-if="preUrl === 'role'"
				label-width="80px"
				:model="form.role"
			>
				<el-form-item label="角色名称">
					<el-input
						v-model="form.role.name"
						placeholder="角色名称"
					></el-input>
				</el-form-item>
				<el-form-item label="角色描述">
					<el-input
						v-model="form.role.desc"
						type="textarea"
						placeholder="角色描述"
					></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="form.role.status" size="mini">
						<el-radio :label="1" border>启用</el-radio>
						<el-radio :label="0" border>禁用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import common from '@/common/mixins/common.js';
export default {
	mixins: [common],
	inject: ['app', 'layout'],
	data() {
		return {
			preUrl: 'manager',
			keyword: '',
			form: {
				manager: {
					username: '',
					password: '',
					avatar: '',
					role_id: '',
					status: 1,
				},
				role: {
					name: '',
					desc: '',
					status: 1,
				},
			},
			managerList: [],
			roleList: [],
			data: [
				{
					id: 1,
					label: '一级 1',
					status: 1,
					editStatus: false,
					children: [
						{
							id: 2,
							label: '二级 1-1',
							status: 1,
							editStatus: false,
							children: [
								{
									id: 3,
									label: '三级 1-1-1',
									status: 1,
									editStatus: false,
									children: [],
								},
							],
						},
					],
				},
				{
					id: 4,
					label: '一级 2',
					status: 1,
					editStatus: false,
					children: [
						{
							id: 5,
							label: '二级 2-1',
							status: 1,
							editStatus: false,
							children: [
								{
									id: 6,
									label: '三级 2-1-1',
									status: 1,
									editStatus: false,
									children: [],
								},
							],
						},
					],
				},
			],
			defaultProps: {
				children: 'children',
				label: 'label',
			},
			dialogVisible: false,
			dialogType: 'manager',
			roleOptions: [],
			dialogId: 0,
		};
	},
	methods: {
		// 提交表单
		submit() {
			this.addOrEdit(this.form[this.preUrl], this.dialogId);
			this.dialogVisible = false;
		},
		// 打开弹出层
		openDialog(type, item = false) {
			// 确认类型
			this.dialogType = type;
			// 初始化表单
			switch (type) {
				case 'manager':
					if (!item) {
						this.form.manager = {
							username: '',
							password: '',
							avatar: '',
							role_id: '',
							status: 1,
						};
						this.dialogId = 0;
					} else {
						this.dialogId = item.id;
						this.form.manager = {
							username: item.username,
							password: '',
							avatar: item.avatar,
							role_id: item.role_id,
							status: item.status,
						};
					}
					break;
				case 'role':
					if (!item) {
						this.dialogId = 0;
						this.form.role = {
							name: '',
							desc: '',
							status: 1,
						};
						this.dialogId = 0;
					} else {
						this.dialogId = item.id;
						this.form.role = {
							name: item.name,
							desc: item.desc,
							status: item.status,
						};
					}
					break;
				default:
					break;
			}
			// 显示弹出层
			this.dialogVisible = true;
		},
		handleClose(done) {
			this.$confirm('您确定要这样做吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					done();
				})
				.catch(() => {});
		},
		getListUrl() {
			if (this.preUrl === 'manager') {
				return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}&keyword=${this.keyword}`;
			} else if (this.preUrl === 'role') {
				return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}`;
			}
		},
		getListResult(e) {
			console.log(JSON.parse(JSON.stringify(e)));
			switch (this.preUrl) {
				case 'manager':
					this.managerList = e.list;
					this.roleOptions = e.role;
					break;
				case 'role':
					this.roleList = e.list;
					break;
			}
		},
		handleNodeClick(data) {
			console.log(data);
		},
		// 显示/隐藏
		showOrHide(data) {
			data.status = data.status ? 0 : 1;
		},
		// 编辑提交
		edit(data) {
			data.editStatus = !data.editStatus;
		},
		// 删除
		remove(node, data) {
			this.$confirm('此操作将删除该分类,是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					let parent = node.parent;
					let children = parent.data.children || parent.data;
					let index = children.findIndex((v) => {
						return v.id === data.id;
					});
					children.splice(index, 1);
				})
				.catch(() => {});
		},
		// 增加子分类
		append(data) {
			let newObj = {
				id: 1,
				label: '一级 1',
				status: 1,
				editStatus: true,
				children: [],
			};
			data.children.push(newObj);
		},
		// 拖拽
		nodeDrop(...options) {
			console.log(options[0].data, options[1].data);
		},
		// 选择头像
		chooseImage() {
			this.app.chooseImage((res) => {
				this.form.manager.avatar = res[0].url;
			}, 1);
		},
	},
};
</script>

<style></style>
