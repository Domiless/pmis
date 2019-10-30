<template>
	<div class="designManage">
		<div class="design_header">
			<a-row style="line-height:50px;">
				<a-button @click="addVisible=true">
					<a-icon style="color:#1890ff;" type="plus" />新增
				</a-button>
				<a-button @click="edit" :disabled="selectedRowKeys.length!=1">
					<a-icon style="color:#1890ff;" type="edit" />修改
				</a-button>
				<!-- <a-button @click="addBomVisible=true">
					<a-icon style="color:#1890ff;" type />BOM管理
				</a-button>-->
				<a-button :disabled="selectedRowKeys.length!=1" @click="download">
					<a-icon style="color:#1890ff;" type />BOM导出
				</a-button>
				<a-button :disabled="selectedRowKeys.length!=1" @click="approveShow">
					<a-icon style="color:#1890ff;" type />提交审批
				</a-button>
				<a-button @click="showDeleteConfirm" :disabled="selectedRowKeys.length!=1">
					<a-icon style="color:#1890ff;" type="delete" />删除
				</a-button>
			</a-row>
		</div>
		<div class="design_content">
			<a-row>
				<a-col :span="24">
					<span>日期：</span>
					<a-range-picker @change="onDateChange" style="width:240px" format="YYYY/MM/DD" />
					<span class="changeDis">
						<span>审批状态：</span>
						<a-select :defaultValue="-1" v-model="reviewState" style="width: 100px">
							<a-select-option :value="-1">全部</a-select-option>
							<a-select-option :value="1">暂存</a-select-option>
							<a-select-option :value="2">审批中</a-select-option>
							<a-select-option :value="3">已通过</a-select-option>
							<a-select-option :value="4">未通过</a-select-option>
							<a-select-option :value="5">已终止</a-select-option>
						</a-select>
					</span>
					<span>关键词：</span>
					<a-input placeholder="订单编号/项目名称/部件名称/图号" v-model="keyword" style="width: 250px"></a-input>
					<a-button @click="getList">搜索</a-button>
				</a-col>
			</a-row>
			<a-row>
				<a-table
					:pagination="false"
					rowKey="id"
					:columns="columns"
					:dataSource="data"
					:rowSelection="{selectedRowKeys:selectedRowKeys,onChange: onSelectChange}"
				>
					<template slot="bomReviewSchedule" slot-scope="text, record">
						<div>
							<span v-if="text==2" style="font-size:14px;color:#027DB4;">审批中</span>
							<span v-if="text==1" style="font-size:14px;color:#999999;">暂存</span>
							<a-popover title placement="right">
								<template slot="content">
									<span>审批意见：{{record.comment!=null?record.comment:"无"}}</span>
								</template>
								<span v-if="text==4" style="font-size:14px;color:#f6003c;">未通过</span>
							</a-popover>
							<a-popover title placement="right">
								<template slot="content">
									<span>审批意见：{{record.comment!=null?record.comment:"无"}}</span>
								</template>
								<span v-if="text==5" style="font-size:14px;color:#E02D2D;">已终止</span>
							</a-popover>
							<a-popover title placement="right">
								<template slot="content">
									<span>审批意见：{{record.comment!=null?record.comment:"无"}}</span>
								</template>
								<span v-if="text==3" style="font-size:14px;color:#10CF0C;">已通过</span>
							</a-popover>
						</div>
					</template>
					<template slot="partName" slot-scope="text, record">
						<a href="javascript:" @click="showDetails(record)">{{text}}</a>
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
				@cancel="handleCancel(1)"
				v-model="addVisible"
				width="1200px"
				:maskClosable="false"
				:footer="null"
			>
				<add-design-manage @changeAddOrder="cancelAddOrder" ref="addModal"></add-design-manage>
			</a-modal>
			<a-modal
				title="修改"
				@cancel="handleCancel(2)"
				v-model="editVisible"
				:maskClosable="false"
				width="1200px"
				:footer="null"
			>
				<edit-design-manage @changeAddOrder="cancelEditOrder" ref="editModal" :oneMsg="oneMsg"></edit-design-manage>
			</a-modal>
			<a-modal
				title="提交审批"
				v-model="addBomVisible"
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
			<a-modal
				:title="titleName"
				:footer="null"
				width="1000px"
				:visible="detailsVisible"
				@cancel="handleCancel(3)"
				:maskClosable="false"
			>
				<a-tabs defaultActiveKey="1">
					<a-tab-pane tab="基础信息" key="1">
						<a-row>
							<a-col :span="24" style="margin-bottom:12px;">
								<span class="label_right">项目订单：</span>
								<span>{{partDetails.workOrderNo}}</span>
							</a-col>
							<a-col :span="24" style="margin-bottom:12px;">
								<span class="label_right">设计单号：</span>
								<span>{{partDetails.bomNo}}</span>
							</a-col>
							<a-col :span="24" style="margin-bottom:12px;">
								<span class="label_right">部件名称：</span>
								<span>{{partDetails.partName}}</span>
							</a-col>
							<a-col :span="24" style="margin-bottom:12px;">
								<span class="label_right">图号：</span>
								<span>{{partDetails.bomDrawingNo}}</span>
							</a-col>
							<a-col :span="24" style="margin-bottom:12px;">
								<span class="label_right">需求数量：</span>
								<span>{{partDetails.number}}</span>
							</a-col>
							<a-col :span="24" style="margin-bottom:12px;">
								<span class="label_right">备注：</span>
								<span>{{partDetails.remake}}</span>
							</a-col>
						</a-row>
					</a-tab-pane>
					<a-tab-pane tab="BOM" key="2" style="margin-bottom: 20px">
						<a-row>
							<a-table
								:scroll="{ x: 1900, y: 400 }"
								:pagination="false"
								rowKey="id"
								:columns="columns1"
								:dataSource="partDetails.bomDes"
							></a-table>
						</a-row>
					</a-tab-pane>
				</a-tabs>
			</a-modal>
		</div>
	</div>
</template>
<script>
import AddDesignManage from "./Add";
import EditDesignManage from "./Edit";
import importBom from "./Bom";
const columns = [
	{
		dataIndex: "workOrderNo",
		title: "项目订单编号",
		key: "workOrderNo",
		width: 150
	},
	{
		dataIndex: "bomNo",
		title: "设计单号",
		key: "bomNo",
		width: 150
	},
	{
		dataIndex: "partName",
		title: "部件名称",
		key: "partName",
		width: 150,
		scopedSlots: { customRender: "partName" }
	},
	{
		dataIndex: "bomDrawingNo",
		title: "图号",
		key: "bomDrawingNo",
		width: 150
	},
	{
		dataIndex: "number",
		title: "需求数量",
		key: "number",
		width: 90
	},
	{
		dataIndex: "production",
		title: "负责人",
		key: "production",
		width: 90
	},
	{
		dataIndex: "bomReviewSchedule",
		title: "审批状态",
		key: "bomReviewSchedule",
		width: 90,
		scopedSlots: { customRender: "bomReviewSchedule" }
	},
	{
		dataIndex: "gmtCreated",
		title: "创建时间",
		key: "gmtCreated",
		width: 100
	},
	{
		dataIndex: "remake",
		title: "备注",
		key: "remake",
		width: 100
	}
];
const columns1 = [
	{
		title: "图号",
		dataIndex: "drawingNo",
		key: "drawingNo",
		// fixed: "left",
		width: 150
	},
	{
		title: "名称",
		dataIndex: "name",
		key: "name",
		width: 150
	},
	{
		title: "装入部件号",
		dataIndex: "partsNo",
		key: "partsNo",
		width: 150
	},
	{
		title: "组件中零件数量",
		dataIndex: "groupNum",
		key: "groupNum",
		width: 150
	},
	{
		title: "单机中零件数量",
		dataIndex: "singleNum",
		key: "singleNum",
		width: 150
	},
	{
		title: "需求总数量",
		dataIndex: "addNum",
		key: "addNum",
		width: 150
	},
	{
		title: "装入整件号",
		dataIndex: "entiretyNo",
		key: "entiretyNo",
		width: 150
	},
	{
		title: "领料单位",
		dataIndex: "picking",
		key: "picking",
		width: 150
	},
	{
		title: "备注",
		dataIndex: "remake",
		key: "remake",
		width: 150
	},
	{
		title: "零件类别",
		dataIndex: "partCat",
		key: "8",
		width: 150
	},
	{
		title: "指定品牌",
		dataIndex: "brand",
		key: "brand",
		width: 150
	},
	{
		title: "设计师",
		dataIndex: "planner",
		key: "planner",
		width: 150
	}
];
export default {
	data() {
		return {
			columns,
			columns1,
			data: [],
			partDetails: [],
			addVisible: false,
			editVisible: false,
			addBomVisible: false,
			detailsVisible: false,
			keyword: "",
			current: 1,
			pageSize: 10,
			total: 0,
			beginDate: "",
			endDate: "",
			reviewState: -1,
			selectedRowKeys: [],
			selectedRows: [],
			oneMsg: {},
			form: this.$form.createForm(this),
			userProcess: [],
			titleName: ""
		};
	},
	methods: {
		edit() {
			if (
				this.selectedRows[0].bomReviewSchedule != 1 &&
				this.selectedRows[0].bomReviewSchedule != 4
			) {
				this.$message.error(`只能对暂存、未通过状态的设计单进行修改！`);
			} else {
				this.fondOne(this.selectedRowKeys[0]);
				this.editVisible = true;
			}
		},
		approveShow() {
			if (
				this.selectedRows[0].bomReviewSchedule != 1 &&
				this.selectedRows[0].bomReviewSchedule != 4
			) {
				this.$message.error(`只能对暂存、未通过状态的设计单提交审批！`);
			} else {
				this.addBomVisible = true;
			}
		},
		download() {
			let qs = require("qs");
			let value = qs.stringify({
				bomId: this.selectedRowKeys[0]
			});
			this.$axios
				.post(this.global.apiSrc + "/api-order/bom/exportExcel", value, {
					responseType: "blob" // 设置响应数据类型
					// headers: { "Content-Type": "application/json" }
				})
				.then(res => {
					if (res.status == 200) {
						console.log(res);
						var blob = new Blob([res.data], {
							type:
								"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
						});
						var downloadElement = document.createElement("a");
						var href = window.URL.createObjectURL(blob); //创建下载的链接
						downloadElement.href = href;
						let fileName;
						fileName = this.selectedRows[0].partName;
						downloadElement.download = fileName + "BOM单.xlsx"; //下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); //点击下载
						document.body.removeChild(downloadElement); //下载完成移除元素
						window.URL.revokeObjectURL(href); //释放掉blob对象
					}
				});
		},
		auditSubmit() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					console.log("Received values of form: ", values);
					let qs = require("qs");
					let data = qs.stringify({
						bomId: this.selectedRowKeys[0],
						procDefId: values.procDefId,
						description: values.description
					});
					console.log(data);

					this.Axios(
						{
							url: "/api-order/bom/submit",
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
								this.addBomVisible = false;
								this.form.resetFields();
								this.getList();
							}
						},
						({ type, info }) => {}
					);
				}
			});
		},
		filterOption(input, option) {
			return (
				option.componentOptions.children[0].text
					.toLowerCase()
					.indexOf(input.toLowerCase()) >= 0
			);
		},
		onShowSizeChange(current, pageSize) {
			this.pageSize = pageSize;
			this.current = 1;
			this.getList();
		},
		onChange(current, pageNumber) {
			console.log("Page: ", pageNumber);
			console.log("第几页: ", current);
			this.current = current;
			this.getList();
		},
		onDateChange(date, dateString) {
			console.log(date);
			console.log(dateString);
			this.beginDate = dateString[0];
			this.endDate = dateString[1];
		},
		handleCancel(a) {
			if (a == 1) {
				this.$refs.addModal.closeAdd();
			}
			if (a == 2) {
				this.$refs.editModal.closeAdd();
			}
			if (a == 3) {
				this.detailsVisible = false;
			}
			if (a == 4) {
				this.addBomVisible = false;
				this.form.resetFields();
			}
		},
		cancelAddOrder(params) {
			this.addVisible = params;
			this.getList();
		},
		cancelEditOrder(params) {
			this.editVisible = params;
			this.getList();
		},
		showDetails(row) {
			// this.partDetails = row;
			console.log(row);
			this.titleName = row.partName + "详情";
			this.fondOne(row.id);
			this.detailsVisible = true;
			console.log(this.partDetails);
		},
		getList() {
			this.Axios(
				{
					url: "/api-order/bom/list",
					type: "get",
					params: {
						keyword: this.keyword != "" ? this.keyword : null,
						page: this.current,
						size: this.pageSize,
						auditState: this.reviewState != -1 ? this.reviewState : null,
						start: this.beginDate != "" ? this.beginDate : null,
						end: this.endDate != "" ? this.endDate : null
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
						this.selectedRowKeys = [];
						this.selectedRows = [];
					}
				},
				({ type, info }) => {}
			);
		},
		fondOne(id) {
			this.Axios(
				{
					url: "/api-order/bom/findone",
					type: "get",
					params: {
						id: id
					},
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.partDetails = result.data.data;
						this.oneMsg = result.data.data;
					}
				},
				({ type, info }) => {}
			);
		},
		onDelete(e) {
			console.log(this.selectedRowKeys);
			let qs = require("qs");
			let data = qs.stringify({
				bomId: this.selectedRowKeys[0]
			});
			this.Axios(
				{
					url: "/api-order/bom/deleteBom",
					params: data,
					type: "post",
					option: { successMsg: "删除成功！" }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.getList();
						this.selectedRowKeys = [];
						this.selectedRows = [];
					}
				},
				({ type, info }) => {}
			);
		},
		showDeleteConfirm() {
			if (
				this.selectedRows[0].bomReviewSchedule != 1 &&
				this.selectedRows[0].bomReviewSchedule != 4
			) {
				this.$message.error(`只能对暂存、未通过状态的设计单进行删除！`);
			} else {
				let that = this;
				this.$confirm({
					title: "确定删除吗？",
					content: "",
					okText: "确定",
					okType: "danger",
					cancelText: "取消",
					onOk: function() {
						that.onDelete();
					},
					onCancel() {}
				});
			}
		},
		onSelectChange(selectedRowKeys, selectedRows) {
			this.selectedRows = selectedRows;
			this.selectedRowKeys = selectedRowKeys;
		},
		getUserprocess() {
			this.Axios(
				{
					url: "/api-order/activiti/getUserprocess",
					// url: "/api-order/activiti/getprocess",
					type: "get",
					params: {
						type: "bom"
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
		}
	},

	created() {
		this.getList();
		this.getUserprocess();
	},
	computed: {},
	components: {
		AddDesignManage,
		EditDesignManage,
		importBom
	}
};
</script>
<style lang="less" scoped>
.designManage {
	padding: 0 20px;
	.design_header {
		margin-bottom: 10px;
	}
	.design_content {
		.ant-row:nth-child(1) {
			margin-bottom: 10px;
		}
	}
	.changeDis {
		display: inline;
		margin: 0 20px;
	}
}
.label_right {
	display: inline-block;
	width: 120px;
	text-align: right;
}
</style>