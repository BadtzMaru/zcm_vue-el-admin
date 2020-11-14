<template>
	<div>
		<el-dialog
			title="商品规格选择"
			:visible.sync="createModel"
			width="80%"
			top="5vh"
		>
			<el-container
				style="height:70vh;position:relative;margin:-30px -20px;"
			>
				<el-container>
					<el-aside
						width="200px"
						style="position:absolute;top:0px;left:0;bottom:50px;"
						class="bg-white border-right"
					>
						<!-- 侧边 | 规格卡片标题 -->
						<ul class="list-group list-group-flush">
							<li
								@click="changeSku(index)"
								v-for="(item, index) in skusList"
								:key="index"
								class="list-group-item list-group-item-action"
								:class="skuIndex === index ? 'sum-active' : ''"
							>
								{{ item.name }}
							</li>
						</ul>
					</el-aside>
					<el-footer
						style="position: absolute;left:0;bottom:0;height:50px;width:200px;"
						class="border d-flex align-items-center justify-content-center"
					>
						<el-pagination
							:current-page="page.current"
							:page-sizes="page.sizes"
							:page-size="page.size"
							:total="page.total"
							layout="prev,next"
							@current-change="handleCurrentChange"
						>
						</el-pagination>
					</el-footer>
					<el-container>
						<el-header
							style="position:absolute;top:0;left:200px;right:0;height:60px;line-height:60px;"
							class="border-top border-bottom"
						>
							<el-button
								type="primary"
								size="mini"
								@click="doChooseAll"
							>
								{{ isChooseAll ? '取消全选' : '全选' }}
							</el-button>
						</el-header>
						<el-main
							style="position:absolute;top:60px;left:200px;bottom:0px;right:0;"
						>
							<!-- 主内容 -->
							<div class="d-flex flex-wrap">
								<span
									class="border rounded py-1 px-2 m-2"
									style="cursor:pointer"
									v-for="(item, index) in skuItems"
									:key="index"
									:class="item.ischeck ? 'sum-active' : ''"
									@click="choose(item)"
								>
									{{ item.name }}
								</span>
							</div>
						</el-main>
					</el-container>
				</el-container>
			</el-container>
			<div slot="footer">
				<el-button @click="hide">取 消</el-button>
				<el-button type="primary" @click="confirm">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import common from '@/common/mixins/common.js';
export default {
	mixins: [common],
	data() {
		return {
			preUrl: 'skus',
			loading: false,
			createModel: false,
			callback: false,
			chooseList: [],
			// 数据
			skuIndex: 0,
			skusList: [],
		};
	},
	computed: {
		// 当前规格下的规格属性列表
		skuItems() {
			let item = this.skusList[this.skuIndex];
			return item ? item.list : [];
		},
		// 是否全选
		isChooseAll() {
			return this.skuItems.length === this.chooseList.length;
		},
	},
	methods: {
		getListResult(e) {
			this.skusList = e.list.map((item) => {
				let list = item.default.split(',');
				item.list = list.map((name) => {
					return {
						name,
						color: '',
						image: '',
						ischeck: false,
					};
				});
				return item;
			});
		},
		// 打开弹出层
		chooseSkus(callback) {
			this.createModel = true;
			this.callback = callback;
		},
		// 确定
		confirm() {
			// 选中的skus
			if (typeof this.callback === 'function') {
				let item = this.skusList[this.skuIndex];
				this.callback({
					id: item.id,
					name: item.name,
					type: item.type,
					list: this.chooseList,
				});
			}
			// 隐藏
			this.hide();
		},
		// 关闭弹出层
		hide() {
			this.unChooseAll();
			this.callback = false;
			this.createModel = false;
		},
		// 切换规格卡片
		changeSku(index) {
			this.unChooseAll();
			this.skuIndex = index;
		},
		// 选中规格属性
		choose(item) {
			// 之前没有选中
			if (!item.ischeck) {
				// 修改选中状态
				item.ischeck = true;
				// 加入选中列表
				return this.chooseList.push(item);
			}
			// 之前选中
			// 找到当前对象在chooseList的索引
			let index = this.chooseList.findIndex((v) => {
				return v.id === item.id;
			});
			// 找不到
			if (index < 0) return;
			// 从选中列表中移除
			this.chooseList.splice(index, 1);
			// 修改选中状态
			item.ischeck = false;
		},
		// 选中/取消选中
		doChooseAll() {
			let list = this.skusList[this.skuIndex].list;
			// 已经全选
			if (this.isChooseAll) {
				return this.unChooseAll();
			}
			// 全选
			this.chooseList = list.map((v) => {
				// 设置全选状态
				v.ischeck = true;
				return v;
			});
		},
		// 取消选中所有
		unChooseAll() {
			let list = this.skusList[this.skuIndex].list;
			// 取消选中状态
			list.forEach((v) => {
				v.ischeck = false;
			});
			// 清空选中列表
			return (this.chooseList = []);
		},
	},
};
</script>

<style></style>
