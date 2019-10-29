<template>
	<div class="order_audit">
		<a-col :span="24" style="display: block;overflow: hidden;">
			<a-col :span="12" style="margin-bottom: -1000px;padding-bottom: 1000px;float: left;">
				<a-col :span="24" class="case">
					<span class="audit_label">合同号</span>
					<span>{{detailsValue.DO.contractNo}}</span>
				</a-col>
				<a-col :span="24" class="case">
					<span class="audit_label">项目名称</span>
					<span>{{detailsValue.DO.contractName}}</span>
				</a-col>
				<a-col :span="24" class="case">
					<span class="audit_label">订单类型</span>
					<span>{{detailsValue.DO.orderType==1?"贸易类":detailsValue.DO.orderType==2?"咨询类":detailsValue.DO.orderType==3?"设计制造类":"其他"}}</span>
				</a-col>
				<a-col :span="24" class="case">
					<span class="audit_label">订单编号</span>
					<span>{{detailsValue.DO.no}}</span>
				</a-col>
				<a-col :span="24" class="case">
					<span class="audit_label">承接部门</span>
					<span>{{detailsValue.DO.undertakeDep}}</span>
				</a-col>
				<a-col :span="24" class="case">
					<span class="audit_label">负责人</span>
					<span>{{detailsValue.DO.dutyBy}}</span>
				</a-col>
				<a-col :span="24" class="case">
					<span class="audit_label">客户名称</span>
					<span>{{detailsValue.DO.customerName}}</span>
				</a-col>
				<a-col :span="24" class="case">
					<span class="audit_label">合同金额</span>
					<span>{{detailsValue.DO.totalMoney}}</span>
				</a-col>
				<a-col :span="24" class="case">
					<span class="audit_label">单位</span>
					<span>{{detailsValue.DO.measureUnit}}</span>
				</a-col>
				<a-col :span="24" class="case">
					<span class="audit_label">订单数量</span>
					<span>{{detailsValue.DO.orderQuantity}}</span>
				</a-col>
				<a-col :span="24" class="case">
					<span class="audit_label">运输方式</span>
					<span>{{detailsValue.DO.transportType}}</span>
				</a-col>
				<a-col :span="24" class="case">
					<span class="audit_label">签订时间</span>
					<span>{{detailsValue.DO.gmtSign}}</span>
				</a-col>
				<a-col :span="24" class="case">
					<span class="audit_label">交货地点</span>
					<span>{{detailsValue.DO.deliveryPlace}}</span>
				</a-col>
				<a-col :span="24" class="case">
					<span class="audit_label">交货日期</span>
					<span>{{detailsValue.DO.gmtDelivery}}</span>
				</a-col>
				<a-col :span="24" class="case">
					<span class="audit_label">附件</span>
					<span style="display:inline-block;vertical-align: top;width:250px;">
						<span
							v-for="(item, index) in detailsValue.DO.orderDocs==null?0:detailsValue.DO.orderDocs"
							:key="index"
						>
							<a :href="item.docPositionTrueUrl" target="_back" style="display:block;">{{item.docName}}</a>
						</span>
					</span>
				</a-col>
				<a-col :span="24" class="case">
					<span class="audit_label">备注</span>
					<span>{{detailsValue.DO.remark}}</span>
				</a-col>
			</a-col>
			<a-col
				:span="12"
				style="margin-bottom: -1000px;padding-bottom: 1000px;float: left;background-color:rgba(242, 242, 242, 0.435294117647059)"
			>
				<a-tabs defaultActiveKey="1">
					<a-tab-pane tab="审批意见" key="1" v-if="auditType!=2">
						<a-col :span="24">
							<span class="opinion_style">发起人：</span>
							<span>{{detailsValue.auditData.userName}}</span>
						</a-col>
						<a-col :span="24">
							<span class="opinion_style">发起时间：</span>
							<span>{{detailsValue.auditData.startTime}}</span>
						</a-col>
						<a-col :span="24">
							<span class="opinion_style">停留时间：</span>
							<span>{{detailsValue.auditData.stopTime}}</span>
						</a-col>
						<a-col :span="24">
							<span class="opinion_style">审批意见：</span>
							<span>
								<a-radio-group v-model="value" style="vertical-align:top">
									<a-radio :style="radioStyle" value="1">同意</a-radio>
									<a-radio :style="radioStyle" value="0">驳回</a-radio>
									<a-radio :style="radioStyle" value="-1">终止</a-radio>
								</a-radio-group>
							</span>
						</a-col>
						<a-col :span="24">
							<span class="opinion_style">审批说明：</span>
							<span>
								<a-textarea
									v-model="comment"
									style="vertical-align:top;width:260px;"
									placeholder
									:autosize="{ minRows: 4, maxRows: 4 }"
								/>
							</span>
						</a-col>
						<a-col :span="24" style="padding-left:280px;">
							<a-button type="primary" @click="audit">提交</a-button>
						</a-col>
					</a-tab-pane>
					<a-tab-pane tab="审批日志" key="2" forceRender>
						<div class="log_case">
							<div v-for="(item, index) in detailsValue.log" :key="index" class="log_item_case">
								<h3>{{item.taskName}}</h3>
								<a-col :span="24">
									<span>姓名：</span>
									<span>{{item.name}}</span>
								</a-col>
								<a-col :span="24">
									<span>处理时间：</span>
									<span>{{item.dealTime}}</span>
								</a-col>
								<a-col :span="24" v-if="item.state!=0">
									<span>处理结果：</span>
									<span>
										{{item.state}}
										<span v-if="item.comment!=null&&item.comment!=''">({{item.comment}})</span>
									</span>
								</a-col>
							</div>
						</div>
					</a-tab-pane>
					<a-tab-pane tab="流程图" key="3">
						<div class="flow_case">
							<div class="content_case">
								<span class="item_case">开始</span>
								<div v-for="(item, index1) in flow" :key="index1">
									<a-divider type="vertical" style="display: block;margin: auto;" />
									<span
										class="item_case"
									>{{item.name}}（{{item.type==1?item.groups.label:item.users.map(i=>i.name).join(",")}}）</span>
								</div>
								<a-divider type="vertical" style="display: block;margin: auto;" />
								<span class="item_case">结束</span>
							</div>
						</div>
					</a-tab-pane>
				</a-tabs>
			</a-col>
		</a-col>
	</div>
</template>
<script>
import Vue from "vue";
import { Divider } from "ant-design-vue";
import { stringify } from "querystring";
Vue.use(Divider);
export default {
	props: {
		auditValue: {
			default: {}
		},
		auditParams: {
			default: ""
		}
	},
	data() {
		return {
			detailsValue: {
				DO: {},
				auditData: {},
				log: []
			},
			value: "",
			radioStyle: {
				display: "block",
				lineHeight: "24px"
			},
			rizi: {},
			flow: [],
			comment: "",
			auditType: ""
		};
	},
	methods: {
		getModel() {
			this.Axios(
				{
					url: "/api-order/activiti/getModelProcess",
					params: {
						procDefId: this.auditValue.auditData.processDefinitionId
					},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.flow = result.data.data.userTask;
					}
				},
				({ type, info }) => {}
			);
		},
		audit() {
			if (this.value == "" || this.value == null) {
				this.$message.error("请选择审批意见！");
				return false;
			}
			if ((this.value == 0 || this.value == -1) && this.comment == "") {
				this.$message.error("驳回或终止需要填写审批说明！");
				return false;
			}
			let qs = require("qs");
			let data = qs.stringify({
				comment: this.comment,
				state: this.value,
				taskID: this.auditValue.auditData.id
			});
			this.Axios(
				{
					url: "/api-order/activiti/audit",
					params: data,
					type: "post",
					option: { successMsg: "审批成功！" }
					// config: {
					// 	headers: { "Content-Type": "application/json" }
					// }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.comment = "";
						this.value = "";
						let params = {
							type: 1
						};
						this.$emit("auditParams", params);
					}
				},
				({ type, info }) => {}
			);
		}
	},
	created() {
		// this.rizi = this.auditValue.log[this.auditValue.log.length - 1];
		this.detailsValue = this.auditValue;
		// this.detailsValue.log.pop();
		this.getModel();
		this.auditType = this.$store.state.homeStore.details;
	},
	watch: {
		auditValue() {
			// this.rizi = this.auditValue.log[this.auditValue.log.length - 1];
			this.detailsValue = this.auditValue;
			// this.detailsValue.log.pop();
			this.getModel();
			this.auditType = this.$store.state.homeStore.details;
		}
	}
};
</script>
<style lang="less">
.order_audit {
	overflow: hidden;
	.case:not(:last-child) {
		margin-bottom: 8px;
	}
	.audit_label {
		display: inline-block;
		width: 100px;
		text-align: right;
		padding-right: 8px;
		color: #999999;
	}
	.opinion_style {
		display: inline-block;
		width: 80px;
		text-align: right;
		color: #999999;
	}
	.ant-tabs {
		span {
			line-height: 24px;
		}
		.ant-col-24:not(:last-child) {
			margin-bottom: 12px;
		}
	}
	.log_case {
		max-height: 500px;
		overflow: auto;
		padding: 0 20px 0;
		span {
			line-height: 24px;
		}
		.ant-col-24:not(:last-child) {
			margin-bottom: 0px;
		}
		.log_item_case:not(:last-child) {
			overflow: hidden;
			margin-bottom: 20px;
		}
	}
	.flow_case {
		.content_case {
			text-align: center;
			padding-top: 12px;
			max-height: 500px;
			overflow: auto;
			.item_case {
				margin: auto;
				display: block;
				width: 200px;
				background-color: rgba(24, 144, 255, 1);
				line-height: 40px;
				border-radius: 5px;
				color: white;
			}
			.ant-divider {
				background-color: rgba(24, 144, 255, 1);
				height: 1.9em;
				width: 2px;
			}
		}
	}
}
</style>