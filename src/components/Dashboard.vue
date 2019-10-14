<template>
	<div class="home">
		<!-- <div class="msg_case">
			<h2>欢迎使用长虹生产管理系统</h2>
			<p>V1.2.3 beta（内测版）</p>
			<p>技术支持：长虹智能制造 工业云项目部</p>
		</div>-->
		<a-row>
			<a-col :span="18">
				<div class="things_case">
					<a-tabs defaultActiveKey="1" class="tabs_style">
						<a-tab-pane tab="待办事项" key="1">
							<ul v-if="things>0" class="list_case">
								<li v-for="(item, index) in things" :key="index" class="list">
									<a-col :span="3">20191012</a-col>
									<a-col :span="3">项目订单</a-col>
									<a-col :span="10">张三发起的项目订单流程审批111111111111111</a-col>
									<a-col :span="4">2019-10-12 14:23:01</a-col>
									<a-col :span="4">4天23小时46分</a-col>
								</li>
							</ul>
							<div style="text-align:center;line-height:100px;" v-else>暂无待办事项</div>
							<div style="text-align:right;">
								<a-pagination
									size="small"
									@change="onChange"
									:current="current"
									:total="50"
									:showTotal="total => `共 ${total} 条`"
								/>
							</div>
						</a-tab-pane>
						<a-tab-pane tab="已办事项" key="2" forceRender>
							<ul v-if="things>0" class="list_case">
								<li v-for="(item, index) in things" :key="index" class="list">
									<a-col :span="3">20191012</a-col>
									<a-col :span="3">项目订单</a-col>
									<a-col :span="10">张三发起的项目订单流程审批111111111111111</a-col>
									<a-col :span="4">2019-10-12 14:23:01</a-col>
									<a-col :span="4">4天23小时46分</a-col>
								</li>
							</ul>
							<div style="text-align:center;line-height:100px;" v-else>暂无待办事项</div>
							<div style="text-align:right;">
								<a-pagination
									size="small"
									@change="onChange2"
									:current="current2"
									:total="50"
									:showTotal="total => `共 ${total} 条`"
								/>
							</div>
						</a-tab-pane>
					</a-tabs>
				</div>
				<div class="msg_style">
					<a-badge count="5" class="badge_style">
						<a></a>
					</a-badge>
					<h3>消息通知</h3>
					<ul class="list_case">
						<li v-for="(item, index) in 30" :key="index" class="list">
							<a-col :span="20">
								<a-col :span="2" style="color:#999999">[业务]</a-col>
								<a-col :span="22">
									<i class="iconfont" style="color:red;">&#xe607;</i>有1条项目订单需要采购，请尽快处理，设计单号SJ-20190901-0001。
								</a-col>
							</a-col>
							<a-col :span="4">
								<span>2019-10-12 14:23:01</span>
							</a-col>
						</li>
					</ul>
					<div style="text-align:right;">
						<a-pagination
							size="small"
							@change="onChange1"
							:current="current1"
							:total="50"
							:showTotal="total => `共 ${total} 条`"
						/>
					</div>
				</div>
			</a-col>
			<a-col :span="6" style="padding:0 0 0 12px">
				<div class="blackboard1">
					<a-calendar :fullscreen="false" @panelChange="onPanelChange" />
				</div>
				<div class="blackboard">
					<h2>小黑板</h2>
					<p>常用联系人及联系方式：</p>
					<p>
						项目部 张三 15012345678
						<br />设计部一部 李四 15012345678
						<br />设计部二部 王五 15012345678
						<br />采购部 赵六 15012345678
						<br />制造部 钱七 15012345678
						<br />仓库 我爱罗 15012345678
						<br />技术支持 汪宁 15012345678
						<br />
					</p>
				</div>
				<div class="erweima">
					<a-col :span="10">
						<img src="../assets/TGX3%ND]III)@IKUQ@(V_CT.png" alt />
					</a-col>
					<a-col :span="14">
						<h3>协同云APP</h3>
						<div class="content">
							随时随地移动管控
							<br />快速、灵活、安全
							<br />五维一体，协同高效
						</div>
					</a-col>
				</div>
			</a-col>
		</a-row>
	</div>
</template>
<script>
import Vue from "vue";
import { calendar } from "ant-design-vue";
Vue.use(calendar);
export default {
	name: "dashboard",
	data() {
		return {
			msg: "Welcome to Your Dashboard",
			things: 10,
			current: 1,
			current1: 1,
			current2: 1
		};
	},
	methods: {
		onPanelChange(value, mode) {
			console.log(value, mode);
		},
		onChange(current) {
			this.current = current;
		},
		onChange1(current) {
			this.current1 = current;
		},
		onChange2(current) {
			this.current2 = current;
		},
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
	// background: url("../assets/gztbg.jpg") no-repeat 100%;
	.msg_case {
		width: 300px;
		position: absolute;
		right: 20px;
		bottom: 20px;
	}
	.things_case {
		position: relative;
		border: 1px solid #dddddd;
		border-radius: 4px;
		padding: 12px 20px;
		.more_style {
			position: absolute;
			color: #1890ff;
			right: 24px;
			top: 24px;
			z-index: 100;
			cursor: pointer;
			&:hover {
				color: #40a9ff;
			}
		}
		.tabs_style {
			.list_case {
				max-height: 370px;
				min-height: 100px;
				overflow: auto;
				.list {
					list-style-type: none;
					line-height: 40px;
					border: 1px solid #dddddd;
					overflow: hidden;
					padding: 0 8px;
					border-radius: 4px;
					margin-bottom: 12px;
					&:hover {
						background-color: #cfe8fc;
						border-color: #cfe8fc;
					}
					.ant-col-10,
					.ant-col-4,
					.ant-col-3 {
						padding-right: 12px;
						text-overflow: ellipsis;
						overflow: hidden;
						white-space: nowrap;
					}
				}
			}
		}
	}
	.msg_style {
		position: relative;
		border: 1px solid #dddddd;
		border-radius: 4px;
		padding: 12px 20px;
		margin-top: 14px;
		.badge_style {
			position: absolute;
			left: 88px;
			top: 16px;
		}
		.more_style {
			position: absolute;
			color: #1890ff;
			right: 24px;
			top: 14px;
			z-index: 100;
			cursor: pointer;
			&:hover {
				color: #40a9ff;
			}
		}
		.list_case {
			max-height: 240px;
			overflow: auto;
			.list {
				list-style-type: none;
				line-height: 16px;
				overflow: hidden;
				padding: 0 8px;
				margin-bottom: 8px;
				.ant-col-22 {
					padding-right: 8px;
					text-overflow: ellipsis;
					overflow: hidden;
					white-space: nowrap;
					cursor: pointer;
					&:hover {
						color: #40a9ff;
						text-decoration: underline;
					}
				}
				.ant-col-2 {
					white-space: nowrap;
					text-align: right;
					// padding-right: 8px;
					width: 50px;
				}
				.ant-col-4 {
					padding-right: 8px;
					text-overflow: ellipsis;
					overflow: hidden;
					white-space: nowrap;
				}
			}
		}
	}
	.blackboard {
		border: 1px solid #dddddd;
		border-radius: 4px;
		padding: 0 12px;
		margin-top: 14px;
	}
	.blackboard1 {
		border: 1px solid #dddddd;
		border-radius: 4px;
		padding: 0 12px;
	}
	.erweima {
		border: 1px solid #dddddd;
		border-radius: 4px;
		padding: 12px;
		overflow: hidden;
		margin-top: 14px;
		img {
			width: 100%;
		}
		h3 {
			line-height: 50px;
			padding-left: 12px;
		}
		.content {
			line-height: 32px;
			padding-left: 12px;
			color: #999999;
		}
	}
}
</style>