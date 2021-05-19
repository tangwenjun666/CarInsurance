<template>
	<body id="poster">
		<el-form class="login-container" label-position="left" label-width="0px">
			<h3 class="login_title">系统登录</h3>
			<el-form-item>
				<el-input type="text" v-model="loginForm.uname" placeholder="账号"></el-input>
			</el-form-item>
			<el-form-item>
				<el-input type="password" v-model="loginForm.upwd" placeholder="密码"></el-input>
			</el-form-item>
			<el-form-item style="width: 100%">
				<el-button type="primary" style="width: 100%;background: #505458;border: none" @click="login">登录</el-button>
			</el-form-item>
		</el-form>
	</body>
</template>


<script>
	export default {
		name: "login",
		data() {
			return {
				loginForm: {
					uname: '',
					upwd: ''
				},
				responseResult: []
			}
		},
		methods: {
			login() {
				if (this.loginForm.username !== '' && this.loginForm.password !== '') {
					//发送axios请求判断是否登录
					this.$axios.get('isLogin',{
						params:{
							    'uname':this.loginForm.uname,
								'upwd':this.loginForm.upwd
							}
					}).then(res=>{
						console.log(res.data)
						if (res.data != '') {
							this.$message({
								showClose: true,
								message: '登录成功',
								type: 'success'
							});
							console.log(res.data);
							//将用户对象存储到sessionStorage中
							sessionStorage.setItem("user", JSON.stringify(res.data));
							this.$router.push({
								path: '/home'
							});
						}else{
							this.$message({
								showClose: true,
								message: '用户名或密码错误',
								type: 'error'
							});
						}
					}).catch(err=>{
						console.log(err);
					})
					
				} else {
					this.$message({
						showClose: true,
						message: '用户名和密码不能为空',
						type: 'error'
					});
				}
			}
		}
	}
</script>

<style>
	#poster {
		background: url("../assets/backiee-10700.jpg") no-repeat;
		background-position: center;
		height: 100%;
		width: 100%;
		background-size: cover;
		position: fixed;
	}

	body {
		margin: 0px;
		padding: 0;
	}

	.login-container {
		border-radius: 15px;
		background-clip: padding-box;
		margin: 240px auto;
		width: 400px;
		padding: 35px 35px 15px 35px;
		background: #fff;
		border: 1px solid #eaeaea;
		box-shadow: 0 0 25px #cac6c6;
	}

	.login_title {
		margin: 0px auto 40px auto;
		text-align: center;
		color: #505458;
	}
</style>
