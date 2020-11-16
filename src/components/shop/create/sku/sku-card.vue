<template>
	<div class="card mb-3" style="line-height:1.2;">
		<div class="card-header d-flex align-items-center">
			规格项:
			<el-input
				:value="item.name"
				@input="vModel('name', index, $event)"
				class="ml-2"
				size="mini"
				style="width:200px;"
			>
				<el-button
					slot="append"
					icon="el-icon-more"
					@click="chooseSkus"
				></el-button>
			</el-input>
			<el-radio-group
				:value="item.type"
				@input="vModel('type', index, $event)"
				size="mini"
				style="margin-bottom:-10px;"
				class="ml-2"
			>
				<el-radio :label="0">无</el-radio>
				<el-radio :label="1">颜色</el-radio>
				<el-radio :label="2">图片</el-radio>
			</el-radio-group>
			<!-- 上移 -->
			<el-button
				class="ml-auto"
				size="mini"
				icon="el-icon-top"
				@click="sortCard('moveUp', index)"
				:disabled="index === 0"
			></el-button>
			<!-- 下移 -->
			<el-button
				@click="sortCard('moveDown', index)"
				size="mini"
				icon="el-icon-bottom"
				:disabled="total === index + 1"
			></el-button>
			<el-button @click="delSkuCardEvent" size="mini" type="text"
				>删除</el-button
			>
		</div>
		<div class="card-body">
			<!-- 规格属性列表 -->
			<div class="d-flex align-items-center flex-wrap">
				<sku-card-children
					v-for="(item2, index2) in list"
					:key="index2"
					:item="item2"
					:index="index2"
					:type="item.type"
					:cardIndex="index"
					v-dragging="{
						item: item2,
						list: list,
						group: `skuItem${index}`,
					}"
				></sku-card-children>
			</div>
			<!-- 增加规格属性 -->
			<div class="mt-2">
				<el-button
					type="text"
					size="mini"
					icon="el-icon-plus"
					@click="addSkuValueEvent()"
					>增加规格值</el-button
				>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import skuCardChildren from './sku-card-children.vue';
let defaultValue = ['属性值', '#FFFFFF', '/favicon.ico'];
export default {
	inject: ['app', 'layout'],
	components: { skuCardChildren },
	props: {
		item: Object,
		index: Number,
		total: Number,
	},
	data() {
		return {
			list: this.item.list,
		};
	},
	computed: {
		...mapState({
			sku_card: (state) => state.goods_create.sku_card,
		}),
	},
	mounted() {
		this.$watch('item.list', (newValue) => {
			this.list = newValue;
		});
		this.$dragging.$on('dragend', (e) => {
			if (e.group === `skuItem${this.index}`) {
				this.sortSkuValue({ index: this.index, value: this.list });
			}
			this.axios
				.post(
					`/admin/goods_skus_card_value/sort`,
					{
						sortdata: this.list.map((item, index) => {
							return {
								id: item.id,
								order: index + 1,
							};
						}),
					},
					{ token: true }
				)
				.then(() => {})
				.catch(() => {});
		});
	},
	methods: {
		...mapMutations([
			'delSkuCard',
			'vModelSkuCard',
			'sortSkuCard',
			'addSkuValue',
			'sortSkuValue',
		]),
		addSkuValueEvent(value = false) {
			this.layout.showLoading();
			this.axios
				.post(
					`/admin/goods_skus_card_value`,
					{
						goods_skus_card_id: this.item.id,
						name: this.item.name,
						order: 50,
						value:
							typeof value === 'string'
								? value
								: defaultValue[this.item.type],
					},
					{ token: true }
				)
				.then((res) => {
					this.layout.hideLoading();
					let data = res.data.data;
					data.text =
						this.item.type === 0 ? data.value : defaultValue[0];
					data.color =
						this.item.type === 1 ? data.value : defaultValue[1];
					data.image =
						this.item.type === 2 ? data.value : defaultValue[2];
					this.addSkuValue({
						index: this.index,
						data,
					});
				})
				.catch(() => {
					this.layout.hideLoading();
				});
		},
		delSkuCardEvent() {
			this.layout.showLoading();
			this.axios
				.post(
					`/admin/goods_skus_card/${this.item.id}/delete`,
					{},
					{ token: true }
				)
				.then(() => {
					this.layout.hideLoading();
					this.delSkuCard(this.index);
				})
				.catch(() => {
					this.layout.hideLoading();
				});
		},
		updateSkuCard() {
			this.axios
				.post(`/admin/goods_skus_card/${this.item.id}`, this.item, {
					token: true,
				})
				.then(() => {})
				.catch(() => {});
		},
		vModel(key, index, value) {
			this.vModelSkuCard({ key, index, value });
			this.updateSkuCard();
		},
		// 规格卡片排序
		sortCard(action, index) {
			this.sortSkuCard({ action, index });
			this.axios
				.post(
					`/admin/goods_skus_card/sort`,
					{
						sortdata: this.sku_card.map((item, index) => {
							return {
								id: item.id,
								order: index + 1,
							};
						}),
					},
					{ token: true }
				)
				.then(() => {})
				.catch(() => {});
		},
		// 选择规格
		chooseSkus() {
			this.app.chooseSkus((res) => {
				this.vModel('name', this.index, res.name);
				this.vModel('type', this.index, res.type);
				// this.vModel('list', this.index, res.list);
				// this.list = res.list;
				res.list.forEach((item) => {
					this.addSkuValueEvent(item.name);
				});
			});
		},
	},
};
</script>

<style scoped></style>
