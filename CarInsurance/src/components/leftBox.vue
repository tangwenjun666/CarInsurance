<template>
	<el-tabs type="border-card" style="height: 650px;">
		<el-tab-pane label="车险理赔">
			<span slot="label"><i class="el-icon-s-promotion"></i>车险理赔</span>
			<el-row class="tac">
				<el-menu class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" 
				  active-text-color="#FE9A2E">
					<div v-for="role in user.roles" :key="role.rid">
						<el-submenu v-if="menu.mid==5" v-for="menu in role.menus" :key="menu.mid" :index="menu.mid">
							<template slot="title">
								<i class="el-icon-menu"></i>
								<span>{{menu.mname}}</span>
							</template>
							<el-menu-item-group>
								<el-menu-item v-for="m in menu.children" :key="m.mid" :index="menu.mid+'-'+m.mid">
									<router-link :to="m.page_url+'?bid='+m.bid" tag="div">{{m.mname}}</router-link>
								</el-menu-item>
							</el-menu-item-group>
						</el-submenu>
					</div>
				</el-menu>
			</el-row>
		</el-tab-pane>
		<el-tab-pane label="系统设置">
			<span slot="label"><i class="el-icon-setting"></i>系统设置</span>
			<el-row class="tac">
				<el-menu class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" 
				  active-text-color="#FE9A2E">
					<div v-for="role in user.roles" :key="role.rid">
						<el-submenu v-if="menu.mid==1" v-for="menu in role.menus" :key="menu.mid" :index="menu.mid">
							<template slot="title">
								<i class="el-icon-menu"></i>
								<span>{{menu.mname}}</span>
							</template>
							<el-menu-item-group>
								<el-menu-item v-for="m in menu.children" :key="m.mid" :index="menu.mid+'-'+m.mid">
									<router-link :to="m.page_url+'?bid='+m.bid" tag="div">{{m.mname}}</router-link>
								</el-menu-item>
							</el-menu-item-group>
						</el-submenu>
					</div>
				</el-menu>
			</el-row>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
	export default {
		name: 'leftBox',
		data: function() {
			return {
				user: []
			}
		},
		methods: {
			handleOpen(key, keyPath) {
				console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				console.log(key, keyPath);
			},
			getUsersPage: function(id) {
				//页面挂载完成,axios发送异步请求,获取所有的用户分页信息
				this.$axios.get("getUsersPage")
					.then(res => { //请求成功
						//将集合通过$emit存入公共vue实例（$bus）中
						this.$bus.$emit('userPage', res.data);
					})
					.catch(err => {
						console.log(err);
					});
			},
			getRolesPage: function(id) {
				//页面挂载完成,axios发送异步请求,获取所有的学生分页信息
				this.$axios.get("getRolesPage")
					.then(res => { //请求成功
						//将集合通过$emit存入公共vue实例（$bus）中
						this.$bus.$emit('rolePage', res.data);
					})
					.catch(err => {
						console.log(err);
					});
			},
			getMenusPage: function(id) {
				//页面挂载完成,axios发送异步请求,获取所有的学生分页信息
				this.$axios.get("getMenusPage")
					.then(res => { //请求成功
						//将集合通过$emit存入公共vue实例（$bus）中
						this.$bus.$emit('menuPage', res.data);
					})
					.catch(err => {
						console.log(err);
					});
			}
		},
		created() {
			//从公共vue实例（$bus）中通过$on获取值
			/* this.$bus.$on('del', res => {
			  this.grades = res;
			}) */
		},
		mounted() {
			this.user = JSON.parse(sessionStorage.getItem("user"));
			//页面挂载完成,axios发送异步请求,获取所有的年级信息
			/* this.$axios.get("getGrades")
			  .then(res => { //请求成功
			    this.grades = res.data;
			  })
			  .catch(err => {
			    console.log(err);
			  }); */
		}
	}
</script>

<style>
</style>
