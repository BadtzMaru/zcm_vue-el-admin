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
				<el-button slot="append" icon="el-icon-more"> </el-button>
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
			<el-button @click="delSkuCard(index)" size="mini" type="text"
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
					@click="addSkuValue(index)"
					>增加规格值</el-button
				>
			</div>
		</div>
	</div>
</template>

<script>
import { mapMutations } from 'vuex';
import skuCardChildren from './sku-card-children.vue';
export default {
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
	mounted() {
		this.$dragging.$on('dragend', (e) => {
			if (e.group === `skuItem${this.index}`) {
				this.sortSkuValue({ index: this.index, value: this.list });
			}
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
		vModel(key, index, value) {
			this.vModelSkuCard({ key, index, value });
		},
		// 规格卡片排序
		sortCard(action, index) {
			this.sortSkuCard({ action, index });
		},
	},
};
</script>

<style scoped></style>
