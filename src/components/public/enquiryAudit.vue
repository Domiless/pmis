<template>
	<div class="enquiry_audit">
		<a-col :span="24" style="display: block;overflow: hidden;">
			<a-col :span="12" style="margin-bottom: -1000px;padding-bottom: 1000px;float: left;">
				<a-col :span="24" class="case">
					<span class="audit_label">项目订单</span>
					<span>DDHT-20190919-001</span>
				</a-col>
				<a-col :span="24" class="case">
					<span class="audit_label">设计单号</span>
					<span>DDHT-20190919-001</span>
				</a-col>
				<a-col :span="24" class="case">
					<span class="audit_label">采购单号</span>
					<span>DDHT-20190919-001</span>
				</a-col>
				<a-col :span="24" class="case">
					<span class="audit_label">采购明细</span>
					<span class="details" @click="detailsVisible=true">查看明细</span>
				</a-col>
				<a-col :span="24" class="case">
					<span class="audit_label">备注</span>
					<span>DDHT-20190919-001</span>
				</a-col>
			</a-col>
			<a-col
				:span="12"
				style="margin-bottom: -1000px;padding-bottom: 1000px;float: left;background-color:rgba(242, 242, 242, 0.435294117647059)"
			>
				<a-tabs defaultActiveKey="1">
					<a-tab-pane tab="审批意见" key="1">
						<a-col :span="24">
							<span class="opinion_style">发起人：</span>
							<span>王五</span>
						</a-col>
						<a-col :span="24">
							<span class="opinion_style">发起时间：</span>
							<span>2019-09-01 12:32:09</span>
						</a-col>
						<a-col :span="24">
							<span class="opinion_style">停留时间：</span>
							<span>9 天 23 小时 46 秒</span>
						</a-col>
						<a-col :span="24">
							<span class="opinion_style">审批意见：</span>
							<span>
								<a-radio-group v-model="value" style="vertical-align:top">
									<a-radio :style="radioStyle" :value="1">同意</a-radio>
									<a-radio :style="radioStyle" :value="2">驳回</a-radio>
									<a-radio :style="radioStyle" :value="3">终止</a-radio>
								</a-radio-group>
							</span>
						</a-col>
						<a-col :span="24">
							<span class="opinion_style">审批说明：</span>
							<span>
								<a-textarea
									style="vertical-align:top;width:260px;"
									placeholder
									:autosize="{ minRows: 4, maxRows: 4 }"
								/>
							</span>
						</a-col>
						<a-col :span="24" style="padding-left:280px;">
							<a-button type="primary">提交</a-button>
						</a-col>
					</a-tab-pane>
					<a-tab-pane tab="审批日志" key="2" forceRender>
						<div class="log_case">
							<div v-for="(item, index) in 10" :key="index" class="log_item_case">
								<h3>发起审批</h3>
								<a-col :span="24">
									<span>姓名：</span>
									<span></span>
								</a-col>
								<a-col :span="24">
									<span>处理时间：</span>
									<span></span>
								</a-col>
								<a-col :span="24">
									<span>处理结果：</span>
									<span></span>
								</a-col>
							</div>
						</div>
					</a-tab-pane>
					<a-tab-pane tab="流程图" key="3">
						<div class="flow_case">
							<div class="content_case">
								<span class="item_case">开始</span>
								<div v-for="(item, index1) in 10" :key="index1">
									<a-divider type="vertical" style="display: block;margin: auto;" />
									<span class="item_case">结束</span>
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
			></a-table>
		</a-modal>
	</div>
</template>
<script>
const columns = [
	{
		title: "图号",
		width: 150,
		dataIndex: "name",
		key: "name"
	},
	{ title: "名称", dataIndex: "address", key: "1", width: 150 },
	{ title: "装入部件号", dataIndex: "address", key: "2", width: 150 },
	{ title: "组件中零件数量", dataIndex: "address", key: "3", width: 150 },
	{ title: "单件中零件数量", dataIndex: "address", key: "4", width: 150 },
	{ title: "需求总数量", dataIndex: "address", key: "5", width: 150 },
	{ title: "装入整件号", dataIndex: "address", key: "6", width: 150 },
	{ title: "领料单位", dataIndex: "address", key: "7", width: 150 },
	{ title: "备注", dataIndex: "address", key: "8", width: 150 },
	{ title: "零件类别", dataIndex: "address", key: "9", width: 150 },
	{ title: "指定品牌", dataIndex: "address", key: "10", width: 150 }
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
	data() {
		return {
			columns,
			data,
			detailsVisible: false,
			value: "",
			radioStyle: {
				display: "block",
				lineHeight: "24px"
			}
		};
	},
	methods: {
		handleCancel() {
			this.detailsVisible = false;
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