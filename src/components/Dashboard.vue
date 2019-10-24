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
							<ul v-if="pendingValue.length>0" class="list_case">
								<li
									v-for="(item, index) in pendingValue"
									:key="index"
									class="list"
									@click="getDetails(item)"
								>
									<a-col :span="3">{{item.id}}</a-col>
									<a-col
										:span="3"
									>{{item.type==1?"项目订单":item.type==2?"项目设计":item.type==3?"采购询价":item.type==4?"采购合同":""}}</a-col>
									<a-col :span="10">{{item.name}}</a-col>
									<a-col :span="4">{{item.startTime}}</a-col>
									<a-col :span="4">{{item.time}}</a-col>
								</li>
							</ul>
							<div style="text-align:center;line-height:100px;" v-else>暂无待办事项</div>
							<div style="text-align:right;">
								<a-pagination
									size="small"
									@change="onChange"
									:current="current"
									:total="totle"
									:showTotal="totle => `共 ${totle} 条`"
								/>
							</div>
						</a-tab-pane>
						<a-tab-pane tab="已办事项" key="2" forceRender>
							<ul v-if="alreadyValue.length>0" class="list_case">
								<li v-for="(item, index) in alreadyValue" :key="index" class="list">
									<a-col :span="3">{{item.id}}</a-col>
									<a-col
										:span="3"
									>{{item.type==1?"项目订单":item.type==2?"项目设计":item.type==3?"采购询价":item.type==4?"采购合同":""}}</a-col>
									<a-col :span="10">{{item.name}}</a-col>
									<a-col :span="4">{{item.startTime}}</a-col>
									<a-col :span="4">{{item.time}}</a-col>
								</li>
							</ul>
							<div style="text-align:center;line-height:100px;" v-else>暂无已办事项</div>
							<div style="text-align:right;">
								<a-pagination
									size="small"
									@change="onChange2"
									:current="current2"
									:total="totle2"
									:showTotal="totle2 => `共 ${totle2} 条`"
								/>
							</div>
						</a-tab-pane>
					</a-tabs>
				</div>
				<div class="msg_style">
					<a-badge count="0" class="badge_style">
						<a></a>
					</a-badge>
					<h3>消息通知</h3>
					<ul class="list_case" v-if="messageValue.length>0">
						<li v-for="(item, index) in messageValue" :key="index" class="list">
							<a-col :span="20">
								<a-col :span="2" style="color:#999999">[{{item.type}}]</a-col>
								<a-col :span="22">
									<i class="iconfont" style="color:red;">&#xe607;</i>
									<span class="content_style" @click="msgShow(item)">{{item.title}}</span>
								</a-col>
							</a-col>
							<a-col :span="4">
								<span>{{item.gmtCreated}}</span>
							</a-col>
						</li>
					</ul>
					<div style="text-align:center;line-height:100px;" v-else>暂无消息通知</div>
					<div style="text-align:right;">
						<a-pagination
							size="small"
							@change="onChange1"
							:current="current1"
							:total="totle1"
							:showTotal="totle1 => `共 ${totle1} 条`"
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
					<div v-html="blackboardValue"></div>
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
		<a-modal
			title="消息通知 "
			:maskClosable="false"
			centered
			width="600px"
			:visible="msgVisible"
			:footer="null"
			@cancel="cancel(1)"
			class="modal_body_style"
		>
			<h3 style="text-align:center;font-weight:900;">{{msgValue.title}}</h3>
			<div v-html="msgValue.content"></div>
			<div style="text-align:right;">{{msgValue.gmtCreated}}</div>
		</a-modal>
		<a-modal
			title="订单审批 "
			:maskClosable="false"
			centered
			width="800px"
			:visible="orderAuditVisible"
			:footer="null"
			@cancel="cancel(2)"
		>
			<orderAudit v-on:auditParams="auditParams" :auditValue="auditValue"></orderAudit>
		</a-modal>
		<a-modal
			title="设计审批 "
			:maskClosable="false"
			centered
			width="800px"
			:visible="designAuditVisible"
			:footer="null"
			@cancel="cancel(3)"
		>
			<designAudit v-on:auditParams="auditParams" :auditValue="auditValue"></designAudit>
		</a-modal>
		<a-modal
			title="采购审批 "
			:maskClosable="false"
			centered
			width="800px"
			:visible="purchaseContractAuditVisible"
			:footer="null"
			@cancel="cancel(5)"
		>
			<purchaseContractAudit v-on:auditParams="auditParams" :auditValue="auditValue"></purchaseContractAudit>
		</a-modal>
		<a-modal
			title="询价审批 "
			:maskClosable="false"
			centered
			width="800px"
			:visible="enquiryAuditVisible"
			:footer="null"
			@cancel="cancel(4)"
		>
			<enquiryAudit v-on:auditParams="auditParams" :auditValue="auditValue"></enquiryAudit>
		</a-modal>
	</div>
</template>
<script>
import designAudit from "./public/designAudit";
import enquiryAudit from "./public/enquiryAudit";
import orderAudit from "./public/orderAudit";
import purchaseContractAudit from "./public/purchaseContractAudit";
import Vue from "vue";
import { calendar } from "ant-design-vue";
Vue.use(calendar);
export default {
	name: "dashboard",
	data() {
		return {
			enquiryAuditVisible: false,
			purchaseContractAuditVisible: false,
			designAuditVisible: false,
			orderAuditVisible: false,
			msgVisible: false,
			detailsVisible: true,
			msg: "Welcome to Your Dashboard",

			current: 1,
			current1: 1,
			current2: 1,
			totle: 0,
			totle1: 0,
			totle2: 0,
			pendingValue: [],
			alreadyValue: [],
			messageValue: [],
			blackboardValue: "",
			msgValue: {},
			auditValue: ""
		};
	},
	methods: {
		auditParams(params) {
			if (params.type == 1) {
				this.orderAuditVisible == false;
				this.getPending();
			}
		},
		msgShow(item) {
			this.msgValue = item;
			this.msgVisible = true;
		},
		cancel(a) {
			if (a == 1) {
				this.msgVisible = false;
			}
			if (a == 2) {
				this.orderAuditVisible = false;
			}
			if (a == 3) {
				this.designAuditVisible = false;
			}
			if (a == 4) {
				this.enquiryAuditVisible = false;
			}
			if (a == 5) {
				this.purchaseContractAuditVisible = false;
			}
		},
		onPanelChange(value, mode) {
			console.log(value, mode);
		},
		onChange(current) {
			this.current = current;
			this.getPending();
		},
		onChange1(current) {
			this.current1 = current;
			this.getMessageList();
		},
		onChange2(current) {
			this.current2 = current;
			this.getAlready();
		},
		clickMsg() {
			// this.msg='I had change Dashboard';
		},
		getPending() {
			this.Axios(
				{
					url: "/api-order/activiti/pendingTask",
					params: {
						page: this.current,
						size: 10
					},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.pendingValue =
							result.data.data != null ? result.data.data.data : [];
						this.totle = parseInt(
							result.data.data != null ? result.data.data.totalElement : 0
						);
					}
				},
				({ type, info }) => {}
			);
		},
		getAlready() {
			this.Axios(
				{
					url: "/api-order/activiti/alreadyTask",
					params: {
						page: this.current2,
						size: 10
					},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.alreadyValue =
							result.data.data != null ? result.data.data.data : [];
						this.totle2 = parseInt(
							result.data.data != null ? result.data.data.totalElement : 0
						);
					}
				},
				({ type, info }) => {}
			);
		},
		getBlackboard() {
			this.Axios(
				{
					url: "/api-order/blackborad/get",
					params: {},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						// console.log(result);
						this.blackboardValue = result.data.data;
					}
				},
				({ type, info }) => {}
			);
		},
		getMessageList() {
			this.Axios(
				{
					url: "/api-order/message/list",
					params: {
						page: this.current1,
						size: 10
					},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						// console.log(result);
						this.messageValue = result.data.data.content;
						this.totle1 = result.data.data.totalElement;
					}
				},
				({ type, info }) => {}
			);
		},
		getDetails(item) {
			console.log(item.id);
			console.log(item.type);
			this.Axios(
				{
					url: "/api-order/activiti/detail",
					params: {
						processInstanceId: item.id
					},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.auditValue = result.data.data;
						if (item.type == 1) {
							this.orderAuditVisible = true;
						}
						if (item.type == 2) {
							this.designAuditVisible = true;
						}
						if (item.type == 3) {
							this.enquiryAuditVisible = true;
						}
						if (item.type == 4) {
							this.purchaseContractAuditVisible = true;
						}
					}
				},
				({ type, info }) => {}
			);
		}
	},
	created() {
		this.getPending();
		this.getAlready();
		this.getBlackboard();
		this.getMessageList();
	},
	components: {
		designAudit,
		enquiryAudit,
		orderAudit,
		purchaseContractAudit
	}
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
					cursor: pointer;
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
					.content_style {
						&:hover {
							color: #40a9ff;
							text-decoration: underline;
						}
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
.modal_body_style {
	.ant-modal-body {
		padding: 12px 24px;
		max-height: 600px;
		overflow: auto;
		img {
			width: 100%;
		}
	}
}
</style>