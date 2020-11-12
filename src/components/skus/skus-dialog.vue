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
						style="position:absolute;top:0px;left:0;bottom:0px;"
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
export default {
	data() {
		return {
			createModel: false,
			callback: false,
			chooseList: [],
			// 数据
			skuIndex: 0,
			skusList: [
				{
					name: '颜色', // 规格名称
					type: 0, // 规格类型 0无,1颜色,2图片
					// 规格属性列表
					list: [
						{
							id: 1,
							name: '黄色',
							image: '',
							color: '',
							ischeck: false,
						},
						{
							id: 2,
							name: '红色',
							image: '',
							color: '',
							ischeck: false,
						},
					],
				},
				{
					name: '大小', // 规格名称
					type: 0, // 规格类型 0无,1颜色,2图片
					// 规格属性列表
					list: [
						{
							id: 1,
							name: 'S',
							image: '',
							color: '',
							ischeck: false,
						},
						{
							id: 2,
							name: 'M',
							image: '',
							color: '',
							ischeck: false,
						},
						{
							id: 3,
							name: 'L',
							image: '',
							color: '',
							ischeck: false,
						},
					],
				},
			],
		};
	},
	computed: {
		// 当前规格下的规格属性列表
		skuItems() {
			return this.skusList[this.skuIndex].list;
		},
		// 是否全选
		isChooseAll() {
			return this.skuItems.length === this.chooseList.length;
		},
	},
	methods: {
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
