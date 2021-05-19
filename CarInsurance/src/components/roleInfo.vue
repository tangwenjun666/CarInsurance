<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>系统管理</el-breadcrumb-item>
			<el-breadcrumb-item>角色管理</el-breadcrumb-item>
		</el-breadcrumb>
		<div style="margin-top: 55px;">
			<el-input placeholder="请输入内容" v-model="rname" class="input-with-select">
				<el-button slot="append" icon="el-icon-search" @click="seachRolesPage"></el-button>
			</el-input>
			<el-button v-if="['1','12','13','123'].includes($route.query.bid)" type="primary" @click="roleForm.rid='',roleForm.rname='',roleForm.rdescribe='',dialogFormDisable=true,dialogFormVisible = true">增加角色</el-button>
		</div>
		<div>
			<el-table :data="page.listRoles" border style="width: 100%;margin-top: 20px;">
				<el-table-column prop="rname" align="center" label="角色名">
				</el-table-column>
				<el-table-column prop="rdescribe" align="center" label="描述">
				</el-table-column>
				<el-table-column prop="menus" align="center" label="拥有菜单权限">
					<template slot-scope="scope">
						<span v-if="scope.row.menus==''">暂无权限</span>
						<span v-else v-for="menu in scope.row.menus" :key="menu.mid">{{menu.mname}} </span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="状态">
					<template slot-scope="scope">
						<el-switch v-if="['2','12','23','123'].includes($route.query.bid)" v-model="scope.row.rstatus" :active-value="1" :inactive-value="0" @change="changeSwitch(scope.row)">
						</el-switch>
						<div v-else>
							<span v-if="scope.row.rstatus==0">已停用</span>
							<span v-else>已启用</span>
						</div>
					</template>
				</el-table-column>
				<el-table-column fixed="right" align="center" label="操作">
					<template slot-scope="scope">
						<el-button v-if="['3','13','23','123'].includes($route.query.bid)" @click="getRole(scope.$index)" type="primary"
						 icon="el-icon-edit" title="编辑"></el-button>
						<el-button v-if="['2','12','23','123'].includes($route.query.bid)" @click="delRole(scope.$index)" :plain="true"
						 type="danger" icon="el-icon-delete" title="删除"></el-button>
						<el-button v-if="['123'].includes($route.query.bid)" @click="getRoleMenus(scope.$index)" type="warning" icon="el-icon-setting"
						 title="授予权限"></el-button>
						<span v-if="['0','1'].includes($route.query.bid)">暂无操作权限</span>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 增加修改角色的对话框 -->
		<el-dialog title="增加角色" :visible.sync="dialogFormVisible">
			<el-form :model="roleForm" ref="roleForm" label-width="100px">
				<el-form-item label="角色名" prop="rname">
					<el-input v-model="roleForm.rname"></el-input>
				</el-form-item>
				<el-form-item label="描述" prop="rdescribe">
					<el-input type="textarea" v-model="roleForm.rdescribe"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="editRole" :disabled="dialogFormDisable">修改</el-button>
				<el-button type="primary" @click="addRole" :disabled="!dialogFormDisable">添加</el-button>
			</div>
		</el-dialog>
		<!-- 授予权限的对话框 -->
		<el-dialog title="授予权限" :visible.sync="dialogMenuVisible" width="600px">
			<el-form :model="roleMenus">
				<el-form-item label="角色名">
					<el-input v-model="roleMenus.rname" disabled></el-input>
				</el-form-item>
				<el-form-item label="选择权限">
				</el-form-item>
				<div class="custom-tree-container">
					<div class="block">
						<el-tree @check="addOrDelMids" :data="menus" ref="tree" show-checkbox node-key="id" :default-expanded-keys="[1]" :default-checked-keys="mids"
						 :props="defaultProps" :expand-on-click-node="false" highlight-current>
							<span class="custom-tree-node" slot-scope="{ node, data }">
								<span>{{ node.label }}</span>
								<span v-if="data.pid!=0" style="margin-left: 70px;">
									<span v-if="mbid.mid==data.mid" v-for="mbid in mbids" :key="mbid.mid">
										<el-checkbox v-if="mbid.bids.indexOf('1')>=0" @change="changeButton(data,'1')" checked>增加</el-checkbox>
										<el-checkbox v-else @change="changeButton(data,'1')">增加</el-checkbox>
										<el-checkbox v-if="mbid.bids.indexOf('2')>=0" @change="changeButton(data,'2')" checked>删除</el-checkbox>
										<el-checkbox v-else @change="changeButton(data,'2')">删除</el-checkbox>
										<el-checkbox v-if="mbid.bids.indexOf('3')>=0" @change="changeButton(data,'3')" checked>修改</el-checkbox>
										<el-checkbox v-else @change="changeButton(data,'3')">修改</el-checkbox>
									</span>
									<span v-if="mids.indexOf(data.mid)<0">
										<el-checkbox @change="changeButton(data,'1')" disabled>增加</el-checkbox>
										<el-checkbox @change="changeButton(data,'2')" disabled>删除</el-checkbox>
										<el-checkbox @change="changeButton(data,'3')" disabled>修改</el-checkbox>
									</span>
								</span>
							</span>
						</el-tree>
					</div>
				</div>
			</el-form>
			<div slot="footer" class="dialog-footer buttons">
				<el-button @click="getCheckedKeys" type="primary">授予权限</el-button>
				<el-button @click="dialogMenuVisible = false">取 消</el-button>
			</div>
		</el-dialog>
		<div style="text-align:center;margin-top: 20px;">
			<el-pagination background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
			 @current-change="getRolesPage" :current-page.sync="page.currentPage" :page-sizes="[3,5,10]" :page-size="page.pageSize"
			 :total="page.totalCount">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	const qs = require('qs');

	export default {
		name: 'roleInfo',
		data() {
			return {
				rname: '',
				roleMenus: [],
				dialogMenuVisible: false,
				dialogFormVisible: false,
				dialogFormDisable: true,
				formLabelWidth: '120px',
				index: '',
				page: [],
				roleForm: {
					rid: '',
					rname: '',
					rdescribe: ''
				},
				menus: [],
				mids: [],
				mbids: [],
				defaultProps: {
					children: 'children',
					label: 'label'
				}
			}
		},
		methods: {
			addRole() {
				var role = this.roleForm;
				this.$axios.post("addRole", role).then(res => {
					if (res.data == "添加成功") {
						this.dialogFormVisible = false;
						this.$message({
							showClose: true,
							message: '添加成功',
							type: 'success'
						});
						this.getRolesPage();
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
				this.$axios.post("editRoleStatus", {
					'rid': data.rid,
					'rstatus': data.rstatus
				}).then(res => {
					if (res.data == "修改成功") {
						if (data.rstatus == 1) {
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
			getRole(index) {
				var rid = this.page.listRoles[index].rid;
				//axios发送异步请求,获取指定的学生信息
				this.$axios.get("getRole", {
						params: {
							'rid': rid,
						}
					})
					.then(res => { //请求成功
						this.roleForm = res.data;
						this.index = index;
						this.dialogFormVisible = true;
						this.dialogFormDisable = false;
					})
					.catch(err => {
						console.log(err);
					});
			},
			editRole() {
				//通过下标查找id
				this.roleForm.rid = this.page.listRoles[this.index].rid;
				this.$axios.post("editRole", this.roleForm).then(res => {
					if (res.data == "修改成功") {
						this.dialogFormVisible = false;
						this.$message({
							showClose: true,
							message: '修改成功',
							type: 'success'
						});
						this.getRolesPage();
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
			delRole(index) {
				var rid = this.page.listRoles[index].rid;
				this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.get("delRole", {
						params: {
							'rid': rid
						}
					}).then(res => {
						if (res.data == "删除成功") {
							this.page.listRoles.splice(index, 1);
							this.$message({
								showClose: true,
								message: '删除成功',
								type: 'success'
							});
							this.getRolesPage();
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
			getRolesPage(val) {
				//页面挂载完成,axios发送异步请求,获取所有的学生分页信息
				this.$axios.get("getRolesPage", {
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
				this.getRolesPage();
			},
			seachRolesPage() {
				//页面挂载完成,axios发送异步请求,获取所有的学生分页信息
				this.$axios.get("getRolesPage", {
						params: {
							'rname': this.rname,
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
			getRoleMenus(index) {
				this.mids = [];
				this.mbids = [];
				var rid = this.page.listRoles[index].rid;
				//axios发送异步请求,获取指定的用户信息
				this.$axios.get("getRoleMenus", {
						params: {
							'rid': rid,
						}
					})
					.then(res => { //请求成功
						this.roleMenus = res.data;
						if (res.data.menus != null) {
							for (var i = 0; i < res.data.menus.length; i++) {
								if (res.data.menus[i].pid != 0) {
									this.mids[i] = res.data.menus[i].mid;
									var bid = res.data.menus[i].bid + '';
									var mbid = {
										mid: res.data.menus[i].mid,
										bids: bid.split('')
									};
									this.mbids.push(mbid);
								}
							}
						}
						this.index = index;
						this.dialogMenuVisible = true;
						this.getMenusTree();
					})
					.catch(err => {
						console.log(err);
					});
			},
			addOrDelMids(node){
				var mid = node.mid;
				//mids数组中,查找mid当前点击的数组下标
				var index = this.mids.findIndex(value => {
					return value == mid
				});
				if (index < 0) {
					this.mids.push(mid);
					this.mbids.push({
						mid: mid,
						bids: ["0"]
					});
				}else{
					this.mids.splice(index,1);
					//mbids数组中,查找mid当前点击的数组下标
					var mbindex = this.mbids.findIndex(mbid => {
						return mbid.mid == mid;
					});
					this.mbids.splice(mbindex,1);
				}
			},
			getCheckedKeys() {
				var rid = this.page.listRoles[this.index].rid;
				this.mids = this.$refs.tree.getCheckedKeys();
				this.$axios.post("addDelRoleMenus", {
					'rid': rid,
					'mids': this.mids,
					'mbids': this.mbids
				}).then(res => {
					if (res.data == "授权成功") {
						this.dialogMenuVisible = false;
						this.$message({
							showClose: true,
							message: '授权成功',
							type: 'success'
						});
						this.getRolesPage();
					} else {
						this.$message({
							showClose: true,
							message: '授权失败',
							type: 'error'
						});
					}
				}).catch(error => {
					console.log(error);
				});
			},
			getMenusTree() {
				//页面挂载完成,axios发送异步请求,获取所有的树状菜单信息
				this.$axios.get("getMenusTree")
					.then(res => { //请求成功
						this.menus = res.data;
					})
					.catch(err => {
						console.log(err);
					});
			},
			changeButton(data, bid) {
				var mid = data.mid;
				//mbids数组中,查找mid当前点击的数组下标
				var index = this.mids.findIndex(id => {
					return id = mid;
				});
				if (index <= 0) {
					this.mids.push(mid);
				}
				//mbids数组中,查找mid当前点击的数组下标
				var index = this.mbids.findIndex(mbid => {
					return mbid.mid == mid;
				});
				if (index >= 0) {
					//mbids数组中,查找bid当前点击的数组下标
					var bindex = this.mbids[index].bids.findIndex(mbid => {
						return mbid == bid;
					});
					if (bindex >= 0) { //存在就删除
						this.mbids[index].bids.splice(bindex, 1);
					} else { //不存在就添加
						this.mbids[index].bids.push(bid);
					}
				} else {
					this.mbids.push({
						mid: data.mid,
						bids: [bid]
					});
				}
				console.log(this.mbids);
			}
		},
		created() {
			//从公共vue实例（$bus）中通过$on获取分页信息
			this.$bus.$on('rolePage', res => {
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
			//页面挂载完成,axios发送异步请求,获取所有的用户信息
			this.getRolesPage();
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
