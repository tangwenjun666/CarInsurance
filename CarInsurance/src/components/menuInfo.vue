<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>系统管理</el-breadcrumb-item>
			<el-breadcrumb-item>菜单管理</el-breadcrumb-item>
		</el-breadcrumb>
		<div style="margin-top: 55px;">
			<el-input placeholder="请输入内容" v-model="mname" class="input-with-select">
				<el-button slot="append" icon="el-icon-search" @click="seachMenusPage"></el-button>
			</el-input>
			<el-button v-if="['1','12','13','123'].includes($route.query.bid)" type="primary" @click="dialogFormDisable=true,dialogFormVisible = true">增加菜单</el-button>
		</div>
		<div>
			<el-table :data="page.listMenus" border style="width: 100%;margin-top: 20px;">
				<el-table-column prop="mname" align="center" label="菜单名称">
				</el-table-column>
				<el-table-column prop="page_url" align="center" label="页面路径">
				</el-table-column>
				<el-table-column prop="pMenu.mname" align="center" label="父菜单">
					<template slot-scope="scope">
						<span v-if="scope.row.pMenu==null">无父菜单</span>
						<span v-else v-text="scope.row.pMenu.mname"></span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="状态">
					<template slot-scope="scope">
						<el-switch v-if="['2','12','23','123'].includes($route.query.bid)" v-model="scope.row.mstatus" :active-value="1" :inactive-value="0" @change="changeSwitch(scope.row)">
						</el-switch>
						<div v-else>
							<span v-if="scope.row.mstatus==0">已停用</span>
							<span v-else>已启用</span>
						</div>
					</template>
				</el-table-column>
				<el-table-column fixed="right" align="center" label="操作">
					<template slot-scope="scope">
						<el-button v-if="['3','13','23','123'].includes($route.query.bid)" @click="getMenu(scope.$index)" type="primary"
						 icon="el-icon-edit" title="编辑"></el-button>
						<el-button v-if="['2','12','23','123'].includes($route.query.bid)" @click="delMenu(scope.$index)" :plain="true"
						 type="danger" icon="el-icon-delete" title="删除"></el-button>
						<span v-if="['0','1'].includes($route.query.bid)">暂无操作权限</span>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<el-dialog title="增加菜单" :visible.sync="dialogFormVisible">
			<el-form :model="menuForm" ref="menuForm" label-width="100px">
				<el-form-item label="菜单名" prop="mname">
					<el-input v-model="menuForm.mname"></el-input>
				</el-form-item>
				<el-form-item label="页面路径" prop="page_url">
					<el-input v-model="menuForm.page_url"></el-input>
				</el-form-item>
				<el-form-item label="父级菜单">
					<el-select v-model="menuForm.pid" placeholder="请选择父级菜单">
						<el-option v-for="menu in menus" :key="menu.mid" :label="menu.mname" :value="menu.mid"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="editMenu" :disabled="dialogFormDisable">修改</el-button>
				<el-button type="primary" @click="addMenu" :disabled="!dialogFormDisable">添加</el-button>
			</div>
		</el-dialog>
		<div style="text-align:center;margin-top: 20px;">
			<el-pagination background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
			 @current-change="getMenusPage" :current-page.sync="page.currentPage" :page-sizes="[3,5,10]" :page-size="page.pageSize"
			 :total="page.totalCount">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'menuInfo',
		data() {
			return {
				mname: '',
				mstatus: '1',
				dialogFormVisible: false,
				dialogFormDisable: true,
				formLabelWidth: '120px',
				index: '',
				page: [],
				menuForm: {
					mid: '',
					mname: '',
					page_url: '',
					pid: ''
				},
				menus: []
			}
		},
		methods: {
			getMenusAll(val) {
				//页面挂载完成,axios发送异步请求,获取所有的菜单分页信息
				this.$axios.get("getMenusAll")
					.then(res => { //请求成功
						this.menus = res.data;
					})
					.catch(err => {
						console.log(err);
					});
			},
			addMenu() {
				this.$axios.post("addMenu", this.menuForm).then(res => {
					if (res.data == "添加成功") {
						this.dialogFormVisible = false;
						this.$message({
							showClose: true,
							message: '添加成功',
							type: 'success'
						});
						this.getMenusPage();
						this.getMenusAll();
					} else {
						this.$message({
							showClose: true,
							message: '添加失败',
							type: 'error'
						});
					}
				}).catch(error => {
					console.log(error);
				});
			},
			changeSwitch(data) {
				this.$axios.post("editMenuStatus", {
					'mid': data.mid,
					'mstatus': data.mstatus
				}).then(res => {
					if (res.data == "修改成功") {
						if (data.mstatus == 1) {
							this.$message({
								showClose: true,
								message: '已启用',
								type: 'success'
							});
						} else {
							this.$message({
								showClose: true,
								message: '已停用',
								type: 'warning'
							});
						}
					} else {
						this.$message({
							showClose: true,
							message: '修改失败',
							type: 'error'
						});
					}
				}).catch(error => {
					console.log(error);
				});
			},
			getMenu(index) {
				var mid = this.page.listMenus[index].mid;
				//axios发送异步请求,获取指定的学生信息
				this.$axios.get("getMenu", {
						params: {
							'mid': mid,
						}
					})
					.then(res => { //请求成功
						this.menuForm = res.data;
						this.index = index;
						this.dialogFormVisible = true;
						this.dialogFormDisable = false;
					})
					.catch(err => {
						console.log(err);
					});
			},
			editMenu() {
				//通过下标查找id
				this.menuForm.mid = this.page.listMenus[this.index].mid;
				this.$axios.post("editMenu", this.menuForm).then(res => {
					if (res.data == "修改成功") {
						this.dialogFormVisible = false;
						this.$message({
							showClose: true,
							message: '修改成功',
							type: 'success'
						});
						this.getMenusPage();
						this.getMenusAll();
					} else {
						this.$message({
							showClose: true,
							message: '修改失败',
							type: 'error'
						});
					}
				}).catch(error => {
					console.log(error);
				});
			},
			delMenu(index) {
				var mid = this.page.listMenus[index].mid;
				this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.get("delMenu", {
						params: {
							'mid': mid
						}
					}).then(res => {
						if (res.data == "删除成功") {
							this.page.listMenus.splice(index, 1);
							this.$message({
								showClose: true,
								message: '删除成功',
								type: 'success'
							});
							this.getMenusPage();
							this.getMenusAll();
						} else {
							this.$message({
								showClose: true,
								message: '删除失败',
								type: 'error'
							});
						}
					}).catch(error => {
						console.log(error);
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			getMenusPage(val) {
				//页面挂载完成,axios发送异步请求,获取所有的菜单分页信息
				this.$axios.get("getMenusPage", {
						params: {
							'pageNo': val,
							'pageSize': this.page.pageSize
						}
					})
					.then(res => { //请求成功
						//将集合通过$emit存入公共vue实例（$bus）中
						this.page = res.data;
					})
					.catch(err => {
						console.log(err);
					});
			},
			handleSizeChange(val) {
				this.page.pageSize = val;
				this.getMenusPage();
			},
			seachMenusPage() {
				//页面挂载完成,axios发送异步请求,获取所有的菜单分页信息
				this.$axios.get("getMenusPage", {
						params: {
							'mname': this.mname,
							'pageSize': this.page.pageSize
						}
					})
					.then(res => { //请求成功
						//将集合通过$emit存入公共vue实例（$bus）中
						this.page = res.data;
					})
					.catch(err => {
						console.log(err);
					});
			}
		},
		created() {
			//从公共vue实例（$bus）中通过$on获取分页信息
			this.$bus.$on('menuPage', res => {
				this.page = res;
			})
			//从公共vue实例（$bus）中通过$on获取值
			this.$bus.$on('del', res => {
				if (res != null) {
					this.grades = res;
				}
			})
		},
		mounted() {
			//页面挂载完成,axios发送异步请求,获取所有的菜单信息
			this.getMenusPage();
			this.getMenusAll();
		}
	}
</script>

<style>
	.el-input {
		width: 400px;
	}

	.el-input-group__prepend {
		background-color: #fff;
	}
</style>
