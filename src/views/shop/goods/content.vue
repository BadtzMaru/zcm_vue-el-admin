<template>
	<div
		class="bg-white px-3 goods_create"
		style="margin:-20px;margin-top:-1rem;margin-bottom:0!important;"
	>
		<router-link
			:to="{ name: 'shop_goods_list' }"
			style="position:absolute;top:12px;left:200px;"
		>
			<el-button size="mini">回到商品列表</el-button>
		</router-link>

		<div>
			<!-- 富文本编辑器 -->
			<tinymce
				ref="editor"
				v-model="content"
				toolbar="undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists table | removeformat | imageUpload"
			/>
		</div>
		<el-button
			type="primary"
			style="position: fixed;bottom: 50px;right:50px;"
			@click="submit"
			>提交</el-button
		>
	</div>
</template>

<script>
import tinymce from '@/components/common/tinymce.vue';
export default {
	inject: ['app', 'layout'],
	components: { tinymce },
	data() {
		return {
			content: '',
			id: 0,
		};
	},
	created() {
		this.id = this.$route.params.id;
		if (!this.id) {
			this.$message({
				message: '非法参数',
				type: 'warning',
			});
			return this.$router.push({
				name: 'shop_goods_list',
			});
		}
		// 获取之前的商品详情
		this.layout.showLoading();
		this.axios
			.get(`/admin/goods/read/${this.id}`, { token: true })
			.then((res) => {
				this.layout.hideLoading();
				this.content = res.data.data.content;
			})
			.catch(() => {
				this.layout.hideLoading();
			});
	},
	methods: {
		submit() {
			this.layout.showLoading();
			this.axios
				.post(
					`/admin/goods/${this.id}`,
					{ content: this.content },
					{ token: true }
				)
				.then(() => {
					this.layout.hideLoading();
					this.$message({
						message: '提交成功',
						type: 'success',
					});
					this.$router.push({
						name: 'shop_goods_list',
					});
				})
				.catch(() => {
					this.layout.hideLoading();
				});
		},
	},
};
</script>

<style></style>
