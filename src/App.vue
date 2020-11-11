<template>
	<div id="app">
		<router-view />
		<el-dialog title="标题" :visible.sync="imageModel">
			<div slot="footer" class="dialog-footer">
				<el-button @click="hide">取 消</el-button>
				<el-button type="primary" @click="confirm">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'app',
	// 依赖注入
	provide() {
		return {
			app: this,
		};
	},
	components: {},
	data() {
		return {
			imageModel: false,
		};
	},
	methods: {
		// 打开弹出层
		show() {
			this.imageModel = true;
		},
		// 确定
		confirm() {
			// 选中的图片url
			// 隐藏
			this.hide();
		},
		hide() {
			this.imageModel = false;
		},
	},
};
</script>

<style>
::-webkit-scrollbar-track {
	background: rgba(0, 0, 0, 0.1);
	border-radius: 0;
}

::-webkit-scrollbar {
	-webkit-appearance: none;
	width: 10px;
	height: 10px;
}

::-webkit-scrollbar-thumb {
	cursor: pointer;
	border-radius: 5px;
	background: rgba(0, 0, 0, 0.25);
	transition: color 0.2s ease;
}
</style>
