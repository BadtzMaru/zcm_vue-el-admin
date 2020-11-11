<template>
	<table class="table table-sm table-bordered">
		<thead>
			<tr>
				<th
					v-for="(th, thi) in tableThs"
					:key="thi"
					scope="col"
					class="text-center"
					:rowspan="th.rowspan"
					:colspan="th.colspan"
					style="vertical-align:middle;"
				>
					{{ th.name }}
				</th>
			</tr>
			<tr>
				<th
					v-for="(th, thi) in skuLabels"
					:key="thi"
					scope="col"
					class="text-center"
					rowspan="1"
					colspan="1"
					style="vertical-align:middle;"
				>
					{{ th.name }}
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(item, index) in list" :key="index">
				<!-- 商品规格 -->
				<td
					v-for="(sku, skuI) in item.skus"
					:key="skuI"
					class="text-center"
				>
					{{ sku.name }}
				</td>
				<td class="text-center" width="100">
					<span class="btn btn-light border">
						<i class="el-icon-plus"></i>
					</span>
				</td>
				<td class="text-center" width="100">
					<input
						type="number"
						v-model="item.pprice"
						class="form-control text-center"
					/>
				</td>

				<td class="text-center" width="100">
					<input
						type="number"
						v-model="item.oprice"
						class="form-control text-center"
					/>
				</td>
				<td class="text-center" width="100">
					<input
						type="number"
						v-model="item.cprice"
						class="form-control text-center"
					/>
				</td>
				<td class="text-center" width="100">
					<input
						type="number"
						v-model="item.stock"
						class="form-control text-center"
					/>
				</td>
				<td class="text-center" width="100">
					<input
						type="number"
						v-model="item.volume"
						class="form-control text-center"
					/>
				</td>
				<td class="text-center" width="100">
					<input
						type="number"
						v-model="item.weight"
						class="form-control text-center"
					/>
				</td>
				<td class="text-center" width="100">
					<input
						type="text"
						v-model="item.code"
						class="form-control text-center"
					/>
				</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
export default {
	data() {
		return {
			list: [],
		};
	},
	computed: {
		...mapState({
			sku_card: (state) => state.goods_create.sku_card,
		}),
		...mapGetters(['tableThs', 'tableData', 'skuLabels']),
	},
	watch: {
		tableData(newValue) {
			this.list = newValue;
		},
	},
	mounted() {
		this.list = this.tableData;
	},
};
</script>

<style scoped></style>
