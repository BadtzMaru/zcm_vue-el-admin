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
							<el-button
								type="text"
								size="mini"
								@click="openDrawer(scope.row)"
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
				<div class="d-flex align-items-center">
					<el-button
						type="primary"
						size="mini"
						v-auth="'添加规则'"
						@click="openDialog('rule')"
						>添加规则</el-button
					>
				</div>
				<el-tree
					class="mb-3"
					:data="ruleList"
					:props="defaultProps"
					default-expand-all
					:expand-on-click-node="false"
				>
					<span class="custom-tree-node" slot-scope="{ data }">
						<div>
							<span
								v-if="data.menu"
								class="mr-2 text-muted"
								:class="data.icon || 'el-icon-star-off'"
							></span>
							<small v-else class="mr-2 text-muted">{{
								data.method
							}}</small>
							<span>{{ data.name }}</span>
							<span v-if="data.menu" class="badge ml-2">{{
								data.frontpath
							}}</span>
							<span v-else class="badge badge-secondary ml-2">{{
								data.condition
							}}</span>
						</div>
						<span>
							<el-button
								@click="changeStatus(data)"
								:type="data.status ? 'success' : 'danger'"
								size="mini"
								plain
								>{{ data.status ? '启用' : '禁用' }}</el-button
							>
							<el-button
								type="text"
								size="mini"
								@click.stop="openDialog('rule', data.id)"
								v-auth="'添加规则'"
								>增加</el-button
							>
							<el-button
								type="text"
								size="mini"
								@click.stop="openDialog('rule', data)"
								>修改</el-button
							>
							<el-button
								type="text"
								size="mini"
								@click.stop="deleteItem(data)"
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
			<!-- 添加|修改规则 -->
			<el-form
				v-if="preUrl === 'rule'"
				label-width="120px"
				:model="form.rule"
			>
				<el-form-item label="上级规则">
					<el-select
						size="mini"
						v-model="form.rule.rule_id"
						placeholder="请选择上级规则"
					>
						<el-option label="顶级规则" :value="0"></el-option>
						<el-option
							v-for="(item, index) in ruleOptions"
							:key="index"
							:label="item | tree"
							:value="item.id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="菜单/规则">
					<el-radio-group v-model="form.rule.menu" size="mini">
						<el-radio :label="1" border>菜单</el-radio>
						<el-radio :label="0" border>规则</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="名称">
					<el-input v-model="form.rule.name"></el-input>
				</el-form-item>
				<el-form-item label="后端规则" v-if="!form.rule.menu">
					<el-input
						v-model="form.rule.condition"
						placeholder="后端规则"
					></el-input>
				</el-form-item>
				<el-form-item label="请求方式" v-if="!form.rule.menu">
					<el-select
						size="mini"
						v-model="form.rule.method"
						placeholder="请选择请求方式"
					>
						<el-option label="GET" value="GET"></el-option>
						<el-option label="POST" value="POST"></el-option>
						<el-option label="PUT" value="PUT"></el-option>
						<el-option label="DELETE" value="DELETE"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="图标" v-if="form.rule.menu">
					<el-input
						v-model="form.rule.icon"
						placeholder="图标"
					></el-input>
				</el-form-item>
				<el-form-item label="前台路由别名" v-if="form.rule.menu">
					<el-input
						v-model="form.rule.desc"
						placeholder="前台路由别名"
					></el-input>
				</el-form-item>
				<el-form-item
					label="前台路由路径"
					v-if="form.rule.menu && form.rule.rule_id > 0"
				>
					<el-input
						v-model="form.rule.frontpath"
						placeholder="前台路由路径"
					></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="form.rule.status" size="mini">
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
		<el-drawer
			title="配置权限"
			:visible.sync="drawer"
			:direction="direction"
			size="40%"
		>
			<div style="position:absolute;top:52px;;right:0;bottom:0;left:0;">
				<div
					style="position:absolute;top:0;left:0;right:0;bottom:60px;overflow-y:auto;"
				>
					<el-tree
						:data="ruleList"
						show-checkbox
						node-key="id"
						default-expand-all
						:default-checked-keys="checkedKeys"
						:props="defaultProps"
						:check-strictly="true"
						@check="check"
					>
					</el-tree>
				</div>
				<div
					style="height:60px;position: absolute;bottom:0;right:0;left:0;"
					class="bg-white border d-flex align-items-center px-3"
				>
					<el-button @click="drawer = false">取消</el-button>
					<el-button type="primary" @click="submitRules"
						>确定</el-button
					>
				</div>
			</div>
		</el-drawer>
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
				rule: {
					menu: 1,
					rule_id: '',
					name: '',
					status: 1,
					frontpath: '',
					condition: '',
					desc: '',
					icon: '',
					method: 'GET',
					order: 50,
				},
			},
			managerList: [],
			roleList: [],
			ruleList: [],
			defaultProps: {
				children: 'child',
				label: 'name',
			},
			dialogVisible: false,
			dialogType: 'manager',
			roleOptions: [],
			ruleOptions: [],
			dialogId: 0,
			drawer: false,
			direction: 'rtl',
			checkedKeys: [],
			drawerId: 0,
		};
	},
	filters: {
		tree(item) {
			if (item.level === 0) {
				return item.name;
			}
			let str = '';
			for (let i = 0; i < item.level; i++) {
				str += i === 0 ? '|--' : '--';
			}
			return str + ' ' + item.name;
		},
	},
	methods: {
		// 提交配置权限
		submitRules() {
			this.layout.showLoading();
			this.axios
				.post(
					`/admin/role/set_rules`,
					{
						id: this.drawerId,
						rule_ids: this.checkedKeys,
					},
					{ token: true }
				)
				.then((res) => {
					this.layout.hideLoading();
					this.drawer = false;
					this.$message({
						message: '配置成功',
						type: 'success',
					});
					this.getList();
				})
				.catch(() => {
					this.layout.hideLoading();
				});
		},
		check(...e) {
			this.checkedKeys = e[1].checkedKeys;
		},
		// 打开抽屉
		openDrawer(item) {
			this.layout.showLoading();
			this.axios
				.get(`/admin/rule/1`, { token: true })
				.then((res) => {
					this.layout.hideLoading();
					this.ruleList = res.data.data.list;
					this.checkedKeys = item.rules.map((item) => item.id);
					this.drawer = true;
					this.drawerId = item.id;
				})
				.catch(() => {
					this.layout.hideLoading();
				});
		},
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
				case 'rule':
					if (!item || typeof item === 'number') {
						this.dialogId = 0;
						this.form.rule = {
							menu: 1,
							rule_id: '',
							name: '',
							status: 1,
							frontpath: '',
							condition: '',
							desc: '',
							icon: '',
							method: 'GET',
							order: 50,
						};
						this.form.rule.rule_id = item;
						this.dialogId = 0;
					} else {
						this.dialogId = item.id;
						this.form.rule = {
							menu: item.menu,
							rule_id: item.rule_id,
							name: item.name,
							status: item.status,
							frontpath: item.frontpath,
							condition: item.condition,
							desc: item.desc,
							icon: item.icon,
							method: item.method,
							order: 50,
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
			}
			return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}`;
		},
		getListResult(e) {
			switch (this.preUrl) {
				case 'manager':
					this.managerList = e.list;
					this.roleOptions = e.role;
					break;
				case 'role':
					this.roleList = e.list;
					break;
				case 'rule':
					this.ruleList = e.list;
					this.ruleOptions = e.rules;
					break;
			}
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
