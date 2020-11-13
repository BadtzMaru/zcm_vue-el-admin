<template>
	<div
		class="bg-white px-3"
		style="margin:-20px;margin-top:-1rem;margin-bottom:0!important;"
	>
		<el-tabs v-model="activeName">
			<el-tab-pane label="支付设置" name="first">
				<el-table :data="tableData">
					<el-table-column label="支付方式">
						<template slot-scope="scope">
							<div class="d-flex align-items-center">
								<img
									:src="scope.row.src"
									alt="logo"
									style="width:40px;height:40px;"
									class="rounded mr-3"
								/>
								<div>
									<h6>{{ scope.row.name }}</h6>
									<small class="d-block text-secondary">{{
										scope.row.desc
									}}</small>
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<el-button type="primary" size="mini">配置</el-button>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="购物设置" name="second" label-width="160px">
				<el-form label-width="160px">
					<el-form-item label="未支付订单">
						<el-input
							size="small"
							placeholder="未支付订单"
							class="w-50"
							type="number"
						>
							<template slot="append">天后自动关闭</template>
						</el-input>
						<small class="text-secondary d-block"
							>订单下单未付款,n天后自动关闭,设置0天不自动关闭</small
						>
					</el-form-item>
					<el-form-item label="已发货订单">
						<el-input class="w-50" type="number" size="small">
							<template slot="append">天后自动确认收货</template>
						</el-input>
						<small class="text-secondary d-block"
							>如果在期间未确认收货,系统个自动完成收货,设置0天不自动收货</small
						>
					</el-form-item>
					<el-form-item label="已完成订单">
						<el-input class="w-50" type="number" size="small">
							<template slot="append">天内允许申请售后</template>
						</el-input>
						<small class="text-secondary d-block"
							>订单完成后,用户在n天内可以发起售后,设置0天不允许申请售后</small
						>
					</el-form-item>
					<el-form-item label="运费组合策略">
						<el-select
							size="small"
							v-model="form.region"
							placeholder="请选择运费组合策略"
						>
							<el-option
								label="区域一"
								value="shanghai"
							></el-option>
							<el-option
								label="区域二"
								value="beijing"
							></el-option>
						</el-select>
					</el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
export default {
	data() {
		return {
			activeName: 'first',
			form: {},
			tableData: [
				{
					name: '银联卡支付',
					desc: '该系统支持即时到账接口',
					src: 'http://wxcs.niuteam.cn/addons/NsUnionPay/ico.png',
				},
				{
					name: '支付宝支付',
					desc: '该系统支持即时到账接口',
					src: 'http://wxcs.niuteam.cn/addons/NsAlipay/ico.png',
				},
				{
					name: '微信支付',
					desc: '该系统支持微信网页支付和扫码支付',
					src: 'http://wxcs.niuteam.cn/addons/NsWeixinpay/ico.png',
				},
			],
		};
	},
};
</script>

<style></style>
