<template>
	<div
		class="bg-white px-3"
		style="margin:-20px;margin-top:-1rem;margin-bottom:0!important;"
	>
		<el-tabs v-model="activeName">
			<el-tab-pane label="管理员列表" name="first">
				<div class="d-flex align-items-center">
					<el-button type="primary" size="mini">添加管理员</el-button>
					<div class="ml-auto d-flex">
						<el-input
							v-model="keyword"
							size="mini"
							style="width:200px;"
							placeholder="请输入用户名"
						></el-input>
						<el-button type="info" size="mini" class="ml-2"
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
					<el-table-column label="手机号" align="center" prop="phone">
					</el-table-column>
					<el-table-column label="邮箱" align="center" prop="email">
					</el-table-column>
					<el-table-column label="所属管理员" align="center">
						<template slot-scope="scope">
							{{ scope.row.group.name }}
						</template>
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
			<el-tab-pane label="角色列表" name="second">
				<div class="d-flex align-items-center">
					<el-button type="primary" size="mini" v-auth="'添加角色'"
						>添加角色</el-button
					>
				</div>
				<el-table
					border
					class="mt-3 mb-3"
					:data="groupList"
					style="width: 100%"
				>
					<el-table-column
						label="角色名称"
						align="center"
						prop="name"
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
					<el-table-column label="操作" width="250">
						<template>
							<el-button type="text" size="mini">修改</el-button>
							<el-button type="text" size="mini"
								>配置权限</el-button
							>
							<el-button type="text" size="mini">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="权限管理" name="third">
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
	</div>
</template>

<script>
export default {
	data() {
		return {
			activeName: 'first',
			keyword: '',
			form: {},
			managerList: [
				{
					id: 1,
					username: '用户名',
					avatar:
						'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3510986481,3852924315&fm=11&gp=0.jpg',
					phone: '15980260339',
					email: '707380414@qq.com',
					group_id: 1,
					group: { id: 1, name: '管理员' },
					status: 1,
				},
			],
			groupList: [{ id: 1, name: '超级管理员', status: 1 }],
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
		};
	},
	methods: {
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
	},
};
</script>

<style></style>
