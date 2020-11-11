<template>
	<div>
		<el-dialog
			title="图片管理"
			:visible.sync="imageModel"
			width="80%"
			top="5vh"
		>
			<el-container
				style="height:70vh;position:relative;margin:-30px -20px;"
			>
				<el-header class="d-flex align-items-center border-bottom">
					<!-- 头部 -->
					<div class="d-flex mr-auto">
						<el-select
							placeholder="请选择图片排序方式"
							size="mini"
							style="width: 150px;"
							class="mr-2"
							v-model="searchForm.order"
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
						<el-input
							class="mr-2"
							size="mini"
							style="width: 150px;"
							placeholder="请输入相册名称"
							v-model="searchForm.keyword"
						></el-input>
						<el-button type="success" size="mini">搜索</el-button>
					</div>
				</el-header>
				<el-container>
					<el-aside
						width="200px"
						style="position:absolute;top:60px;left:0;bottom:60px;"
						class="bg-white border-right"
					>
						<!-- 侧边 | 相册列表 -->
						<ul class="list-group list-group-flush">
							<album-item
								v-for="(item, index) in albums"
								:key="index"
								:item="item"
								:index="index"
								:active="albumIndex === index"
								@change="albumChange"
								:showOptions="false"
							></album-item>
						</ul>
					</el-aside>
					<el-container>
						<el-main
							style="position:absolute;top:60px;left:200px;bottom:60px;right:0;"
						>
							<!-- 主内容 -->
							<el-row :gutter="10">
								<el-col
									:span="24"
									:lg="4"
									:md="6"
									:sm="8"
									v-for="(item, index) in imageList"
									:key="index"
								>
									<el-card
										class="mb-3 position-relative"
										:body-style="{ padding: 0 }"
										shadow="hover"
										style="cursor:pointer"
									>
										<div
											class="border"
											:class="{
												'border-danger': item.ischeck,
											}"
										>
											<span
												v-if="item.ischeck"
												class="badge badge-danger"
												style="position:absolute;right:0;top:0;"
												>{{ item.checkOrder }}</span
											>
											<img
												class="w-100"
												style="height:100px;"
												:src="item.url"
												@click="choose(item)"
											/>
											<div
												style="background: rgba(0,0,0,0.5);margin-top:-25px;position:absolute;"
												class="w-100 text-white px-1"
											>
												<span class="small">{{
													item.name
												}}</span>
											</div>
											<div class="p-2 text-center">
												<el-button-group>
													<el-button
														class="p-2"
														size="mini"
														icon="el-icon-view"
														@click="
															previewImage(item)
														"
													></el-button>
													<el-button
														class="p-2"
														size="mini"
														icon="el-icon-edit"
														@click="
															imageEdit(
																item,
																index
															)
														"
													></el-button>
													<el-button
														class="p-2"
														size="mini"
														icon="el-icon-delete"
														@click="
															imageDel({ index })
														"
													></el-button>
												</el-button-group>
											</div>
										</div>
									</el-card>
								</el-col>
							</el-row>
						</el-main>
					</el-container>
				</el-container>
				<el-footer
					class="border-top border-bottom d-flex align-items-center px-0"
				>
					<!-- 底部 -->
					<div
						style="width:200px;flex-shrink:0;"
						class="h-100 d-flex align-items-center justify-content-center border-right"
					>
						<el-button-group>
							<el-button size="mini">上一页</el-button>
							<el-button size="mini">下一页</el-button>
						</el-button-group>
					</div>
					<div style="flex:1;" class="px-2">
						<el-pagination
							@size-change="handleSizeChange"
							@current-change="handleCurrentChange"
							:current-page="currentPage"
							:page-sizes="[100, 200, 300, 400]"
							:page-size="100"
							layout="total, sizes, prev, pager, next, jumper"
							:total="400"
						>
						</el-pagination>
					</div>
				</el-footer>
			</el-container>
			<div slot="footer">
				<el-button @click="hide">取 消</el-button>
				<el-button type="primary" @click="confirm">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 预览图片 -->
		<el-dialog :visible.sync="previewModel" width="60vw" top="5vh">
			<div style="margin: -60px -20px -30px -20px;">
				<img :src="previewUrl" class="w-100" />
			</div>
		</el-dialog>
	</div>
</template>

<script>
import albumItem from '@/components/image/album-item.vue';
export default {
	props: {
		max: {
			type: Number,
			default: 9,
		},
	},
	components: { albumItem },
	data() {
		return {
			imageModel: false,
			callback: false,
			searchForm: {
				order: '',
				keyword: '',
			},
			albumIndex: 0,
			albums: [],
			imageList: [],
			chooseList: [],
			currentPage: 1,
			previewUrl: '',
			previewModel: false,
		};
	},
	created() {
		this.__init();
	},
	methods: {
		// 打开弹出层
		chooseImage(callback) {
			// 取消选中
			this.unChoose();
			this.imageModel = true;
			this.callback = callback;
		},
		// 确定
		confirm() {
			// 选中的图片url
			if (typeof this.callback === 'function') {
				this.callback(this.chooseList);
			}
			// 隐藏
			this.hide();
		},
		// 关闭弹出层
		hide() {
			this.callback = false;
			this.imageModel = false;
		},
		// 取消选中
		unChoose() {
			this.imageList.forEach((img) => {
				// 找到选中的图片
				let i = this.chooseList.findIndex((item) => {
					return item.id === img.id;
				});
				if (i > -1) {
					// 取消选中样式,选中排序归零
					img.ischeck = false;
					img.checkOrder = 0;
					// 从chooseList中移除
					this.chooseList.splice(i, 1);
				}
			});
		},
		// 选中图片
		choose(item) {
			// 之前未选中
			if (!item.ischeck) {
				// 限制选中数量
				if (this.chooseList.length >= this.max) {
					return this.$message({
						message: `最多选择${this.max}张图片`,
						type: 'warning',
					});
				}
				// 加入选中
				this.chooseList.push({ id: item.id, url: item.url });
				// 计算序号
				item.checkOrder = this.chooseList.length;
				// 显示
				item.ischeck = !item.ischeck;
				return;
			}
			// 取消选中
			// 找到在chooseList中的索引
			let i = this.chooseList.findIndex((v) => v.id === item.id);
			if (i === -1) return;
			// 重新计算序号
			let length = this.chooseList.length;
			// 取消选中中间部分
			if (i + 1 < length) {
				// 重新计算imageList中的序号
				for (let j = i; j < length; j++) {
					let no = this.imageList.findIndex(
						(v) => v.id === this.chooseList[j].id
					);
					if (no > -1) {
						this.imageList[no].checkOrder--;
					}
				}
			}
			// 删除
			this.chooseList.splice(i, 1);
			// 修改状态
			item.ischeck = false;
			// 重置序号
			item.checkOrder = 0;
		},
		// 初始化页面
		__init() {
			for (let i = 0; i < 20; i++) {
				this.albums.push({
					name: '相册' + i,
					num: Math.floor(Math.random() * 100),
					order: 0,
				});
			}
			for (let i = 0; i < 30; i++) {
				this.imageList.push({
					id: i,
					url:
						'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1604988789449&di=f8b7b63b35aa4de72ce6374bfe8822b8&imgtype=0&src=http%3A%2F%2Fwww.aspku.com%2Fuploads%2Fallimg%2F190823%2F23244K9D-2.jpg',
					name: '图片' + i,
					ischeck: false,
					checkOrder: 0,
				});
			}
		},
		// 切换相册
		albumChange(index) {
			this.albumIndex = index;
		},
		// 预览图片
		previewImage(item) {
			this.previewUrl = item.url;
			this.previewModel = true;
		},
		// 修改图片名称
		imageEdit(item) {
			this.$prompt('请输入新名称', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputValue: item.name,
				inputValidator(val) {
					if (val === '') {
						return '图片名称不能为空';
					}
				},
			})
				.then(({ value }) => {
					item.name = value;
					this.$message({
						type: 'success',
						message: '修改成功',
					});
				})
				.catch(() => {});
		},
		// 删除当前图片
		imageDel(obj) {
			this.$confirm(
				obj.all ? '是否删除选中图片?' : '是否删除该图片',
				'提示',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}
			)
				.then(() => {
					if (obj.all) {
						let list = this.imageList.filter((img) => {
							return !this.chooseList.some((c) => {
								return c.id === img.id;
							});
						});
						this.imageList = list;
						this.chooseList = [];
					} else {
						this.imageList.splice(obj.index, 1);
					}

					this.$message({
						message: '删除成功',
						type: 'success',
					});
				})
				.catch(() => {});
		},
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
		},
		handleCurrentChange(val) {
			console.log(`当前页: ${val}`);
		},
	},
};
</script>

<style scoped></style>
