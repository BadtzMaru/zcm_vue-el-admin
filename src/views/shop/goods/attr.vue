<template>
	<div
		class="bg-white p-3 goods_create"
		style="margin:-20px;margin-top:-1rem;margin-bottom:0!important;"
	>
		<router-link
			:to="{ name: 'shop_goods_list' }"
			style="position:absolute;top:12px;left:200px;"
		>
			<el-button size="mini">回到商品列表</el-button>
		</router-link>

		<el-form label-width="80px">
			<el-form-item label="商品类型">
				<el-select
					v-model="goods_type_id"
					placeholder="请选择商品类型"
					@change="change"
				>
					<el-option
						v-for="(item, index) in typeOptions"
						:key="index"
						:label="item.name"
						:value="item.id"
					></el-option>
				</el-select>
			</el-form-item>
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>商品属性</span>
				</div>
				<el-form label-width="80px">
					<el-form-item
						:label="item.name"
						v-for="(item, index) in goods_type_values"
						:key="index"
					>
						<el-input
							v-if="item.type === 'input'"
							v-model="item.value"
						></el-input>
						<el-radio-group
							v-model="item.value"
							v-else-if="item.type === 'radio'"
						>
							<el-radio
								v-for="(item2, index2) in item.default"
								:key="index2"
								:label="item2"
								>{{ item2 }}</el-radio
							>
						</el-radio-group>
						<el-checkbox-group
							v-else-if="item.type === 'checkbox'"
							v-model="item.value"
						>
							<el-checkbox
								v-for="(item2, index2) in item.default"
								:key="index2"
								label="item2"
								>{{ item2 }}</el-checkbox
							>
						</el-checkbox-group>
					</el-form-item>
				</el-form>
			</el-card>
		</el-form>
		<el-button
			type="primary"
			style="position: fixed;bottom: 50px;right:50px;"
			@click="submit"
			>提交</el-button
		>
	</div>
</template>

<script>
export default {
	inject: ['app', 'layout'],

	data() {
		return {
			goods_type_id: '',
			typeOptions: [],
			goods_type_values: [],
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
				this.typeOptions = res.data.data.types;
				this.goods_type_values = res.data.data.goodsAttrs.map(
					(item) => {
						if (item.type !== 'input')
							item.default = item.default.split(',');
						return item;
					}
				);
			})
			.catch(() => {
				this.layout.hideLoading();
			});
	},
	methods: {
		change(id) {
			let index = this.typeOptions.findIndex((item) => item.id === id);
			if (index === -1) {
				return (this.goods_type_values = []);
			}
			let options = this.typeOptions[index].goods_type_values;
			this.goods_type_values = options.map((item) => {
				let defaultVal = [];
				if (item.type !== 'input') {
					defaultVal = item.default ? item.default.split(',') : [];
				}
				return {
					goods_id: this.id,
					value: '',
					name: item.name,
					default: defaultVal,
					type: item.type,
				};
			});
		},
		submit() {
			this.layout.showLoading();
			this.axios
				.post(
					`/admin/goods/attrs/${this.id}`,
					{
						goods_attrs: this.goods_type_values.map((item) => {
							if (item.type !== 'input') {
								item.default = item.default.join(',');
							}
							return item;
						}),
					},
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
