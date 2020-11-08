<template>
	<div id="app">
		<el-radio-group v-model="radio" @change="change" size="small">
			<el-radio :label="3" border>备选项3</el-radio>
			<el-radio :label="6" border>备选项6</el-radio>
			<el-radio :label="9" border>备选项9</el-radio>
		</el-radio-group>
	</div>
</template>

<script>
export default {
	name: 'app',
	components: {},
	data() {
		return {
			radio: 3,
		};
	},
	methods: {
		change(e) {
			console.log(e);
		},
	},
};
</script>

<style></style>
