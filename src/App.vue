<template>
	<div id="app">
		<div class="container">
			<div class="card mt-5 border-primary">
				<div class="card-header bg-primary text-white">头部</div>
				<div class="card-body">内容</div>
				<div class="card-footer bg-primary text-white">底部</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'app',
	components: {},
	data() {
		return {};
	},
	methods: {
		change(e) {
			console.log(e);
		},
	},
};
</script>

<style></style>
