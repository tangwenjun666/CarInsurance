<template>
	<el-row style="background-color: #CEF6F5">
		<el-col :span="20">
			<div class="grid-content bg-purple">
				<span>车险理赔系统</span>
			</div>
		</el-col>
		<el-col :span="4">
			<div class="grid-content bg-purple-light">
				欢迎登录<span v-text="user.uname"></span>
				<el-button @click="logOff" type="primary" round>退出</el-button>
			</div>
		</el-col>
	</el-row>
	<!-- <el-row>
		<el-col :span="16" class="headerlogo">
			<div class="grid-content bg-purple">
				<img style="width:30px;height: 30px" src="../assets/logo.png" alt="无法显示图片" />
			</div>
		</el-col>
		<el-col :span="8" class="rightsection">
			<div class="grid-content bg-purple-light">
				<span class="el-dropdown-link userinfo-inner">欢迎您，管理员</span>
				<span class="userinfo-inner">退出</span>
			</div>
		</el-col>
	</el-row> -->
</template>

<script>
	export default {
		name: 'headerBox',
		data() {
			return {
				user: []
			}
		},
		methods: {
			logOff() {
				//将用户对象从sessionStorage中删除
				sessionStorage.removeItem("user");
				this.$router.push({
					path: '/'
				});
			}
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
