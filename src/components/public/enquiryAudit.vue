<template>
	<div class="enquiry_audit">
		<a-col :span="24" style="display: block;overflow: hidden;">
			<a-col :span="12" style="margin-bottom: -1000px;padding-bottom: 1000px;float: left;">
				<a-col :span="24" style="padding-top:20px;padding-bottom:20px;">
					<a-col :span="24" class="case">
						<span class="audit_label">项目订单</span>
						<span>{{detailsValue.DO.workOrderNo}}</span>
					</a-col>
					<a-col :span="24" class="case">
						<span class="audit_label">设计单号</span>
						<span>{{detailsValue.DO.workOrderNo}}</span>
					</a-col>
					<a-col :span="24" class="case">
						<span class="audit_label">采购单号</span>
						<span>{{detailsValue.DO.purchaseNo}}</span>
					</a-col>
					<a-col :span="24" class="case">
						<span class="audit_label">采购明细</span>
						<span class="details" @click="detailsVisible=true">查看明细</span>
					</a-col>
					<a-col :span="24" class="case">
						<span class="audit_label">备注</span>
						<pre>{{detailsValue.DO.remark}}</pre>
					</a-col>
				</a-col>
			</a-col>
			<a-col
				:span="12"
				style="margin-bottom: -1000px;padding-bottom: 1000px;float: left;background-color:rgba(242, 242, 242, 0.435294117647059)"
			>
				<a-tabs defaultActiveKey="1" style="padding-bottom:20px;">
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
		<a-modal
			title="采购清单"
			:footer="null"
			width="1200px"
			@cancel="handleCancel()"
			:visible="detailsVisible"
			:maskClosable="false"
		>
			<a-table
				size="small"
				:pagination="false"
				:columns="columns"
				:dataSource="data"
				:scroll="{ x: 1500, y: 500 }"
				rowKey="id"
			></a-table>
		</a-modal>
	</div>
</template>
<script>
const columns = [
	{
		dataIndex: "drawingNo",
		title: "图号",
		key: "drawingNo",
		width: 100
	},
	{
		dataIndex: "name",
		title: "名称",
		key: "name",
		width: 100
	},
	{
		dataIndex: "number",
		title: "需求数量",
		key: "number",
		width: 100
	},
	{
		dataIndex: "brand",
		title: "指定品牌",
		key: "brand",
		width: 100
	},
	{
		dataIndex: "designer",
		title: "设计师",
		key: "designer",
		width: 100
	},
	{
		dataIndex: "orderNum",
		title: "订单数量",
		key: "orderNum",
		slots: { title: "orderNumTitle" },
		scopedSlots: { customRender: "orderNum" },
		width: 100
	},
	{
		dataIndex: "orderUnit",
		title: "订单单位",
		key: "orderUnit",
		slots: { title: "orderUnitTitle" },
		scopedSlots: { customRender: "orderUnit" },
		width: 100
	},
	{
		dataIndex: "deliveryDate",
		title: "交货日期",
		key: "deliveryDate",
		slots: { title: "deliveryDateTitle" },
		scopedSlots: { customRender: "deliveryDate" },
		width: 120
	},
	{
		dataIndex: "unitPrice",
		title: "单价",
		key: "unitPrice",
		slots: { title: "unitPriceTitle" },
		scopedSlots: { customRender: "unitPrice" },
		width: 100
	},
	{
		dataIndex: "taxrate",
		title: "税率",
		key: "taxrate",
		slots: { title: "taxrateTitle" },
		scopedSlots: { customRender: "taxrate" },
		width: 100
	},
	{
		dataIndex: "supplier",
		title: "供应商",
		key: "supplier",
		slots: { title: "supplierTitle" },
		scopedSlots: { customRender: "supplier" },
		width: 100
	},
	{
		dataIndex: "priceUnit",
		title: "价格单位",
		key: "priceUnit",
		slots: { title: "priceUnitTitle" },
		scopedSlots: { customRender: "priceUnit" },
		width: 100
	},
	{
		dataIndex: "moneyType",
		title: "货币类型",
		key: "moneyType",
		slots: { title: "moneyTypeTitle" },
		scopedSlots: { customRender: "moneyType" },
		width: 100
	},
	{
		dataIndex: "remark",
		title: "备注",
		key: "remark",
		scopedSlots: { customRender: "remark" },
		width: 100
	},
	{
		dataIndex: "summation",
		title: "小计",
		key: "summation",
		width: 100
	}
];
const data = [];
for (let i = 0; i < 100; i++) {
	data.push({
		key: i,
		name: `Edrward ${i}`,
		age: 32,
		address: `London Park no. ${i}`
	});
}
import Vue from "vue";
import { Divider } from "ant-design-vue";
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
			columns,
			data,
			detailsVisible: false,
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
		handleCancel() {
			this.detailsVisible = false;
		},
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
							type: 3
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
		this.data = this.auditValue.DO.purchaseDesDOList;
		this.auditType = this.$store.state.homeStore.details;
	},
	watch: {
		auditValue() {
			// this.rizi = this.auditValue.log[this.auditValue.log.length - 1];
			this.detailsValue = this.auditValue;
			// this.detailsValue.log.pop();
			this.getModel();
			this.data = this.auditValue.DO.purchaseDesDOList;
			this.auditType = this.$store.state.homeStore.details;
		}
	}
};
</script>
<style lang="less">
.enquiry_audit {
	overflow: hidden;
	.details {
		cursor: pointer;
		color: rgba(24, 144, 255, 1);
		&:hover {
			text-decoration: underline;
		}
	}
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
				width: 160px;
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