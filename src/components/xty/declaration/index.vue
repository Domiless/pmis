<template>
	<div class="declaration_list">
		<a-row style="line-height:50px;">
			<permission-button permCode banType="hide" @click="addVisible=true">
				<a-icon style="color:#1890ff;" type="plus" />新增
			</permission-button>
			<permission-button
				permCode
				banType="hide"
				:disabled="selectedRowKeys.length!=1"
				@click="editVisible=true"
			>
				<a-icon style="color:#1890ff;" type="edit" />修改
			</permission-button>
			<permission-button
				permCode
				banType="hide"
				:disabled="selectedRowKeys.length!=1"
				@click="approveShow"
			>提交审批</permission-button>
		</a-row>
		<a-row style="margin-bottom: 10px;">
			<a-col :span="24">
				<span>日期 :</span>
				<a-range-picker style="width:240px" @change="onChangeRange" format="YYYY/MM/DD"></a-range-picker>
				<span>关键词 :</span>
				<a-input
					placeholder="项目订单编号/设计单号/部件名称/图号/设计负责人"
					style="width: 350px"
					v-model="keyWords"
					@keyup.enter.native="getList"
				></a-input>
				<a-button @click="getList">搜索</a-button>
			</a-col>
		</a-row>
		<a-row>
			<a-table
				rowKey="id"
				:columns="columns"
				:dataSource="data"
				:pagination="false"
				:rowSelection="{selectedRowKeys:selectedRowKeys,onChange: onSelectChange}"
			>
				<template slot="titleName" slot-scope="text, record, index">
					<a href="javascript:" @click="showDetails(record.id)">{{text}}</a>
				</template>
				<template slot="reviewSchedule" slot-scope="text, record, index">
					<span
						:style="{color:text==1?'':text==2?'#1890FF':text==3?'#03B615':text==4?'red':'#999999'}"
					>{{text==1?'暂存':text==2?'审批中':text==3?'已通过':text==4?'未通过':'已终止'}}</span>
				</template>
				<template slot="remark" slot-scope="text, record, index">
					<div class="content_style" style="max-width:200px;">{{record.remark}}</div>
				</template>
			</a-table>
			<a-pagination
				style="padding-top:12px;text-align: right;"
				showQuickJumper
				:defaultCurrent="current"
				:total="total"
				@change="onChange"
				showSizeChanger
				:pageSizeOptions="['10','20','30']"
				@showSizeChange="onShowSizeChange"
				:showTotal="total => `共 ${total} 条`"
			/>
		</a-row>
		<a-modal
			title="新增"
			:footer="null"
			width="1200px"
			:visible="addVisible"
			@cancel="handleCancel(1)"
			:maskClosable="false"
		>
			<add v-on:addModal="addModal" ref="addEnquiry"></add>
		</a-modal>
		<a-modal
			title="修改"
			:footer="null"
			width="1200px"
			:visible="editVisible"
			@cancel="handleCancel(2)"
			:maskClosable="false"
		>
			<edit v-on:addModal="editModal" :rowId="selectedRowKeys[0]" ref="editEnquiry"></edit>
		</a-modal>
		<a-modal
			title="详情"
			:footer="null"
			width="1200px"
			:visible="detailsVisible"
			@cancel="handleCancel(3)"
			:maskClosable="false"
		>
			<details1 :rowId="detailsId"></details1>
		</a-modal>
		<a-modal
			title="提交审批"
			v-model="auditVisible"
			:footer="null"
			width="600px"
			@cancel="handleCancel(4)"
			:maskClosable="false"
		>
			<a-form :form="form">
				<a-form-item label="选择流程" :labelCol="{span:4}" :wrapperCol="{span:18}">
					<a-select
						v-decorator="[
								'procDefId',
								{rules: [{ required: true, message: '请选择项目订单' }]}
								]"
						showSearch
						placeholder="请选择"
						optionFilterProp="children"
						style="width: 100%"
						:filterOption="filterOption"
					>
						<a-select-option v-for="(i,j) in userProcess" :key="j" :value="i.id">{{i.name}}</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="说明" :labelCol="{span:4}" :wrapperCol="{span:18}">
					<a-textarea v-decorator="['description']" :autosize="{ minRows: 4, maxRows: 4 }" />
				</a-form-item>
				<a-form-item :wrapper-col="{ span: 20,offset: 4 }" style="text-align:right">
					<a-button style="margin-right:12px;" @click="handleCancel(4)">取消</a-button>
					<a-button type="primary" @click="auditSubmit">提交</a-button>
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>
<script>
import add from "./add";
import edit from "./edit";
import details1 from "./details";
const columns = [
	{
		title: "报审单编号",
		key: "purchaseNo",
		dataIndex: "purchaseNo",
		width: "18%"
	},
	{
		title: "标题",
		key: "title",
		dataIndex: "title",
		width: "30%",
		scopedSlots: { customRender: "titleName" }
	},
	{
		title: "拟制",
		key: "production",
		dataIndex: "production",
		width: "8%"
	},
	{
		title: "填报日期",
		key: "gmtDelivery",
		dataIndex: "gmtDelivery",
		width: "13%"
	},
	{
		title: "审批状态",
		key: "reviewSchedule",
		dataIndex: "reviewSchedule",
		width: "10%",
		scopedSlots: { customRender: "reviewSchedule" }
	},
	{
		title: "备注",
		key: "remark",
		dataIndex: "remark ",
		width: "16%",
		scopedSlots: { customRender: "remark" }
	}
];
export default {
	data() {
		return {
			detailsId: "",
			form: this.$form.createForm(this),
			auditVisible: false,
			addVisible: false,
			editVisible: false,
			detailsVisible: false,
			columns,
			data: [{ no: 111, title: 222 }],
			total: 0,
			current: 1,
			selectedRowKeys: [],
			selectedRows: [],
			keyWords: "",
			dateValue: [],
			userProcess: []
		};
	},
	methods: {
		showDetails(id) {
			this.detailsId = id;
			this.detailsVisible = true;
		},
		filterOption(input, option) {
			return (
				option.componentOptions.children[0].text
					.toLowerCase()
					.indexOf(input.toLowerCase()) >= 0
			);
		},
		auditSubmit() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					let qs = require("qs");
					let data = qs.stringify({
						purchaseId: this.selectedRowKeys[0],
						procDefId: values.procDefId,
						description: values.description
					});
					console.log(data);

					this.Axios(
						{
							url: "/api-order/purchase/submit",
							params: data,
							type: "post",
							option: { successMsg: "提交成功！" }
							// config: {
							// 	headers: { "Content-Type": "application/json" }
							// }
						},
						this
					).then(
						result => {
							if (result.data.code === 200) {
								console.log(result);
								this.auditVisible = false;
								this.form.resetFields();
								this.getList();
							}
						},
						({ type, info }) => {}
					);
				}
			});
		},
		getUserprocess() {
			this.Axios(
				{
					url: "/api-order/activiti/getUserprocess",
					// url: "/api-order/activiti/getprocess",
					type: "get",
					params: {
						type: "money"
					},
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.userProcess = result.data.data;
					}
				},
				({ type, info }) => {}
			);
		},
		approveShow() {
			if (
				this.selectedRows[0].reviewSchedule != 1 &&
				this.selectedRows[0].reviewSchedule != 4
			) {
				this.$message.error(`只能对暂存、未通过状态的设计单提交审批！`);
			} else {
				this.auditVisible = true;
			}
		},
		addModal() {
			this.addVisible = false;
			this.getList();
		},
		editModal(a) {
			this.editVisible = false;
			if (a == 1) {
			}
			if (a == 2) {
				this.selectedRowKeys = [];
				this.getList();
			}
		},
		handleCancel(a) {
			if (a == 1) {
				this.$refs.addEnquiry.quxiao();
				// this.addVisible = false;
			}
			if (a == 2) {
				this.$refs.editEnquiry.quxiao();
			}
			if (a == 3) {
				this.detailsVisible = false;
			}
			if (a === 4) {
				this.auditVisible = false;
			}
		},
		onChange(current, pageNumber) {
			console.log("Page: ", pageNumber);
			console.log("第几页: ", current);
			this.current = current;
			this.getList();
		},
		onShowSizeChange(current, pageSize) {
			this.pageSize = pageSize;
			this.current = 1;
			this.getList();
		},
		onSelectChange(a, b) {
			this.selectedRowKeys = a;
			this.selectedRows = b;
		},
		onChangeRange(date, datestring) {
			console.log(datestring);
			this.dateValue = datestring;
		},
		getList() {
			this.Axios(
				{
					url: "/api-order/purchase/list",
					type: "get",
					params: {
						page: this.current,
						size: this.pageSize,
						auditState: this.reviewSchedule != -1 ? this.reviewSchedule : null,
						keyword: this.keyWords,
						start: this.dateValue[0] != "" ? this.dateValue[0] : null,
						end: this.dateValue[1] != "" ? this.dateValue[1] : null
					},
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.data = result.data.data.content;
						this.total = result.data.data.totalElement;
					}
				},
				({ type, info }) => {}
			);
		}
	},
	created() {
		this.getList();
		this.getUserprocess();
	},
	components: {
		add,
		edit,
		details1
	}
};
</script>
<style lang="less">
.declaration_list {
	overflow: hidden;
	padding: 0 20px;
}
</style>