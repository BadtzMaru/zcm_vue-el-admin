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
					v-for="(th, thi) in sku_card"
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
			<tr>
				<th scope="row">1</th>
				<td>Mark</td>
				<td>Otto</td>
				<td>@mdo</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
export default {
	computed: {
		...mapState({
			sku_card: (state) => state.goods_create.sku_card,
		}),
		...mapGetters(['tableThs', 'tableData']),
	},
	mounted() {
		console.log(this.tableData);
	},
};
</script>

<style scoped></style>
