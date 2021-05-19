<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>系统管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
		</el-breadcrumb>
		<div style="margin-top: 55px;">
			<el-input placeholder="请输入内容" v-model="uname" class="input-with-select">
				<el-button slot="append" icon="el-icon-search" @click="seachUsersPage"></el-button>
			</el-input>
			<el-button v-if="['1','12','13','123'].includes($route.query.bid)" type="primary" @click="dialogFormDisable=true,dialogFormVisible = true">增加用户</el-button>
		</div>
		<div>
			<el-table :data="page.listUsers" border style="width: 100%;margin-top: 20px;">
				<!-- <el-table-column prop="uportrait" align="center" label="头像">
				</el-table-column> -->
				<el-table-column prop="uname" align="center" label="用户名">
				</el-table-column>
				<el-table-column prop="roles" align="center" label="拥有角色">
					<template slot-scope="scope">
						<span v-if="scope.row.roles==''">暂无角色</span>
						<span v-else v-for="role in scope.row.roles" :key="role.rid">{{role.rname}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="状态">
					<template slot-scope="scope">
						<el-switch v-if="['2','12','23','123'].includes($route.query.bid)" v-model="scope.row.ustatus" :active-value="1" :inactive-value="0" @change="changeSwitch(scope.row)">
						</el-switch>
						<div v-else>
							<span v-if="scope.row.ustatus==0">已停用</span>
							<span v-else>已启用</span>
						</div>
					</template>
				</el-table-column>
				<el-table-column fixed="right" align="center" label="操作">
					<template slot-scope="scope">
						<el-button v-if="['3','13','23','123'].includes($route.query.bid)" @click="getUser(scope.$index)" type="primary"
						 icon="el-icon-edit" title="编辑"></el-button>
						<el-button v-if="['2','12','23','123'].includes($route.query.bid)" @click="delUser(scope.$index)" :plain="true"
						 type="danger" icon="el-icon-delete" title="删除"></el-button>
						<el-button v-if="['123'].includes($route.query.bid)" @click="getUserRoles(scope.$index)" type="warning" icon="el-icon-setting"
						 title="授予角色"></el-button>
						<span v-if="['0','1'].includes($route.query.bid)">暂无操作权限</span>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 增加用户的对话框 -->
		<el-dialog title="增加用户" :visible.sync="dialogFormVisible">
			<el-form :model="userForm" status-icon :rules="rules" ref="userForm" class="demo-ruleForm" label-width="200px">
				<el-form-item label="用户名" prop="uname">
					<el-input v-model="userForm.uname" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="upwd">
					<el-input type="password" v-model="userForm.upwd" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="checkPwd">
					<el-input type="password" v-model="userForm.checkPwd" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button @click="dialogFormVisible = false">取 消</el-button>
					<el-button @click="resetForm('userForm')">重置</el-button>
					<el-button type="primary" @click="editUser" :disabled="dialogFormDisable">修改</el-button>
					<el-button type="primary" @click="submitForm('userForm')" :disabled="!dialogFormDisable">添加</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!-- 授予角色的对话框 -->
		<el-dialog title="授予角色" :visible.sync="dialogTableVisible">
			<el-form ref="userRoles" label-width="100px">
				<el-form-item label="用户名" prop="uname">
					<el-input v-model="userRoles.uname" disabled></el-input>
				</el-form-item>
				<el-form-item label="角色">
					<el-checkbox-group v-model="rids">
						<el-checkbox v-for="role in roles" :key="role.rid" :label="role.rid">{{role.rname}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogTableVisible = false">取 消</el-button>
				<el-button type="primary" @click="addDelUserRole">授权</el-button>
			</div>
		</el-dialog>
		<!-- 分页 -->
		<div style="text-align:center;margin-top: 20px;">
			<el-pagination background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
			 @current-change="getUsersPage" :current-page.sync="page.currentPage" :page-sizes="[3,5,10]" :page-size="page.pageSize"
			 :total="page.totalCount">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	const qs = require('qs');

	export default {
		name: 'userInfo',
		data() {
			var checkName = (rule, value, callback) => {
				if (value === '') {
					return callback(new Error('用户名不能为空'));
				} else {
					callback();
				}
			};
			var validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'));
				} else {
					if (this.userForm.checkPwd !== '') {
						this.$refs.userForm.validateField('checkPwd');
					}
					callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.userForm.upwd) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				page: [],
				roles: [],
				userRoles: [],
				rids: {},
				uname: '',
				dialogTableVisible: false,
				dialogFormVisible: false,
				dialogFormDisable: true,
				index: '',
				userForm: {
					uid: '',
					uname: '',
					upwd: '',
					checkPwd: '',
					uportrait: ''
				},
				rules: {
					uname: [{
						validator: checkName,
						trigger: 'blur'
					}],
					upwd: [{
						validator: validatePass,
						trigger: 'blur'
					}],
					checkPwd: [{
						validator: validatePass2,
						trigger: 'blur'
					}]

				}
			}
		},
		methods: {
			addUser() {
				var user = {
					uname: this.userForm.uname,
					upwd: this.userForm.upwd,
					uportrait: this.userForm.uportrait
				}
				this.$axios.post("addUser", user).then(res => {
					if (res.data == "添加成功") {
						this.dialogFormVisible = false;
						this.$message({
							showClose: true,
							message: '添加成功',
							type: 'success'
						});
						this.getUsersPage();
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
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.addUser();
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			changeSwitch(data) {
				this.$axios.post("editUserStatus", {
					'uid': data.uid,
					'ustatus': data.ustatus
				}).then(res => {
					if (res.data == "修改成功") {
						if (data.ustatus == 1) {
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
			getUser(index) {
				var uid = this.page.listUsers[index].uid;
				//axios发送异步请求,获取指定的用户信息
				this.$axios.get("getUser", {
						params: {
							'uid': uid,
						}
					})
					.then(res => { //请求成功
						this.userForm = res.data;
						this.userForm.checkPwd = this.userForm.upwd;
						this.index = index;
						this.dialogFormVisible = true;
						this.dialogFormDisable = false;
					})
					.catch(err => {
						console.log(err);
					});
			},
			editUser() {
				//通过下标查找id
				this.userForm.uid = this.page.listUsers[this.index].uid;
				var user = {
					uid: this.userForm.uid,
					uname: this.userForm.uname,
					upwd: this.userForm.upwd,
					uportrait: this.userForm.uportrait
				}
				this.$axios.post("editUser", user).then(res => {
					if (res.data == "修改成功") {
						this.dialogFormVisible = false;
						this.$message({
							showClose: true,
							message: '修改成功',
							type: 'success'
						});
						this.getUsersPage();
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
			delUser(index) {
				var uid = this.page.listUsers[index].uid;
				this.$confirm('此操作将永久删除该年级, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.get("delUser", {
						params: {
							'uid': uid
						}
					}).then(res => {
						if (res.data == "删除成功") {
							this.page.listUsers.splice(index, 1);
							this.$message({
								showClose: true,
								message: '删除成功',
								type: 'success'
							});
							this.getUsersPage();
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
			getUsersPage(val) {
				//页面挂载完成,axios发送异步请求,获取所有的学生分页信息
				this.$axios.get("getUsersPage", {
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
				this.getUsersPage();
			},
			seachUsersPage() {
				//页面挂载完成,axios发送异步请求,获取所有的学生分页信息
				this.$axios.get("getUsersPage", {
						params: {
							'uname': this.uname,
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
			getUserRoles(index) {
				this.rids = [];
				var uid = this.page.listUsers[index].uid;
				//axios发送异步请求,获取指定的用户信息
				this.$axios.get("getUserRoles", {
						params: {
							'uid': uid,
						}
					})
					.then(res => { //请求成功
						this.userRoles = res.data;
						for (var i = 0; i < res.data.roles.length; i++) {
							this.rids.push(res.data.roles[i].rid);
						}
						this.index = index;
						this.dialogTableVisible = true;
						this.getRoles();
					})
					.catch(err => {
						console.log(err);
					});
			},
			addDelUserRole(index) {
				var uid = this.page.listUsers[this.index].uid;
				this.$axios.get("addDelUserRole", {
					params: {
						'uid': uid,
						'rids': this.rids
					},
					paramsSerializer: function(params) {
						return qs.stringify(params, {
							arrayFormat: 'repeat'
						})
					}
				}).then(res => {
					if (res.data == "授权成功") {
						this.dialogTableVisible = false;
						this.$message({
							showClose: true,
							message: '授权成功',
							type: 'success'
						});
						this.getUsersPage();
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
			getRoles() {
				//页面挂载完成,axios发送异步请求,获取所有的角色分页信息
				this.$axios.get("getRoles")
					.then(res => { //请求成功
						//将集合通过$emit存入公共vue实例（$bus）中
						this.roles = res.data;
					})
					.catch(err => {
						console.log(err);
					});
			}
		},
		created() {
			//从公共vue实例（$bus）中通过$on获取分页信息
			this.$bus.$on('userPage', res => {
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
			this.getUsersPage();
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
