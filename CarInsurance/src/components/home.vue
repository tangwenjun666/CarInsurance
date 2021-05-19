<template>
	<el-container>
		<el-header>
			<router-view name="header"></router-view>
		</el-header>
		<el-container>
			<el-aside width="300px">
				<router-view name="left"></router-view>
			</el-aside>
			<el-main>
				<router-view name="main"></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	export default {
		name: 'home'
	};
</script>

<style>
	* {
		margin: 0px;
		padding: 0px;
	}

	.el-header {
		margin-left: -20px;
	}

	.el-container.el-container {
		height: 730px;
	}

	/* .el-container.el-container .el-aside {
		background-color: #545c64;
		height: 100%;
	} */
</style>
