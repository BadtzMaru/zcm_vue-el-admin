<template>
	<div
		class="border py-2 px-4 rounded mr-2 position-relative d-flex align-items-center"
	>
		<div v-if="type !== 0">
			<!-- 颜色选择器 -->
			<el-color-picker
				v-if="type === 1"
				size="mini"
				:value="item.color"
				@change="onColorChange"
			></el-color-picker>
			<!-- 图片选择 -->
			<template v-else>
				<span
					v-if="!item.image"
					class="btn btn-light border text-center"
					style="width:45px;height:45px;line-height:33px;"
					@click="chooseImage"
				>
					<i class="el-icon-plus"></i>
				</span>
				<img
					v-else
					:src="item.image"
					alt="image"
					style="width:45px;height:45px;cursor:pointer;"
					class="rounded"
					@click="chooseImage"
				/>
			</template>
		</div>
		<input
			v-if="type === 0"
			type="text"
			:value="item.text"
			@input="inputChange"
			class="form-control text-center border-0"
			style="width:80px;font-size:15px;"
		/>
		<span
			@click="delSkuValueEvent"
			class="btn btn-light p-0 position-absolute"
			style="line-height:1;right: -10px;top:-10px;"
		>
			<i class="el-icon-circle-close"></i>
		</span>
	</div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
	inject: ['app', 'layout'],
	props: {
		type: {
			type: Number,
			default: 0,
		},
		item: Object,
		index: Number,
		cardIndex: Number,
	},
	watch: {
		type(newVal) {
			let keys = ['text', 'color', 'image'];
			let defaultValue = ['属性值', '#FFFFFF', '/favicon.ico'];
			this.item.value = this.item[keys[newVal]]
				? this.item[keys[newVal]]
				: defaultValue[newVal];
			this.updateSkuValueEvent();
		},
	},
	methods: {
		...mapMutations(['delSkuValue', 'updateSkuValue']),
		updateSkuValueEvent() {
			let keys = ['text', 'color', 'image'];
			this.item.value = this.item[keys[this.type]];
			this.axios
				.post(
					`/admin/goods_skus_card_value/${this.item.id}`,
					this.item,
					{ token: true }
				)
				.then(() => {})
				.catch(() => {});
		},
		delSkuValueEvent() {
			this.layout.showLoading();
			this.axios
				.post(
					`/admin/goods_skus_card_value/${this.item.id}/delete`,
					{},
					{ token: true }
				)
				.then(() => {
					this.layout.hideLoading();
					this.delSkuValue({
						cardIndex: this.cardIndex,
						valueIndex: this.index,
					});
				})
				.catch(() => {
					this.layout.hideLoading();
				});
		},
		inputChange(e) {
			this.vModel('text', e.target.value);
		},
		vModel(key, value) {
			this.updateSkuValue({
				cardIndex: this.cardIndex,
				valueIndex: this.index,
				key,
				value,
			});
			this.updateSkuValueEvent();
		},
		// 选择图片
		chooseImage() {
			this.app.chooseImage((res) => {
				this.vModel('image', res[0].url);
			}, 1);
		},
		// 监听颜色选择器
		onColorChange(e) {
			this.vModel('color', e);
		},
	},
};
</script>

<style scoped></style>
