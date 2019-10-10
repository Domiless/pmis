<template>
	<div class="home">
		<div class="msg_case">
			<h2>欢迎使用长虹生产管理系统</h2>
			<p>V1.2.3 beta（内测版）</p>
			<p>技术支持：长虹智能制造 工业云项目部</p>
		</div>
	</div>
</template>

<script>
export default {
	name: "dashboard",
	data() {
		return {
			msg: "Welcome to Your Dashboard"
		};
	},
	methods: {
		clickMsg() {
			// this.msg='I had change Dashboard';
		}
	},
	created() {}
};
</script>
<style lang="less">
.home {
	position: relative;
	width: 100%;
	height: calc(100vh - 200px);
	background: url("../assets/gztbg.jpg") no-repeat 100%;
	.msg_case {
		width: 300px;
		position: absolute;
		right: 20px;
		bottom: 20px;
	}
}
</style>