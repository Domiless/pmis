<template>
	<div class="work_order_list">
		<router-view></router-view>
		<div :class="[{hide:isHideList}]">
			<a-row>
				<a-col :span="24" style="padding:0 20px;">
					<a-row>
						<div style="line-height:50px;">
							<a-col :span="12">
								<permission-button
									permCode="workorder_manage_lookup.workorder_manager_add"
									banType="hide"
									@click="addVisible=true"
								>
									<a-icon style="color:#1890ff;" type="plus" />新增
								</permission-button>
								<permission-button
									permCode="workorder_manage_lookup.workorder_manager_update"
									banType="hide"
									@click="editShow"
									:disabled="selectedRowKeys.length!=1"
								>
									<a-icon style="color:#1890ff;" type="edit" />修改
								</permission-button>
								<permission-button
									permCode="workorder_manage_lookup.workorder_manager_delete"
									banType="hide"
									@click="showDeleteConfirm"
									:disabled="selectedRows.length==0"
								>
									<a-icon style="color:#1890ff;" type="delete" />删除
								</permission-button>
								<!-- <permission-button
									permCode="workorder_manage_lookup.workorder_manager_init"
									banType="hide"
									@click="goIntoOperation"
									:disabled="selectedRows.length==0"
								>
									<i class="iconfont" style="color:#1890ff;margin-right:8px;">&#xe6fd;</i>投产
								</permission-button>
								<permission-button
									permCode="workorder_manage_lookup.workorder_manager_reuse"
									banType="hide"
									@click="regain"
									:disabled="selectedRows.length==0"
								>
									<i class="iconfont" style="color:#1890ff;margin-right:8px;">&#xe625;</i>恢复
								</permission-button>
								<permission-button
									permCode="workorder_manage_lookup.workorder_manager_stop"
									banType="hide"
									@click="pauseShow"
									:disabled="selectedRows.length!=1"
								>
									<i class="iconfont" style="color:#1890ff;margin-right:8px;">&#xe62d;</i>暂停
								</permission-button>
								<permission-button
									permCode="workorder_manage_lookup.workorder_manager_end"
									banType="hide"
									@click="terminationShow"
									:disabled="selectedRows.length!=1"
								>
									<i class="iconfont" style="color:#1890ff;margin-right:8px;">&#xe6aa;</i>终止
								</permission-button>-->
								<permission-button
									permCode
									banType="hide"
									@click="toInventory"
									:disabled="selectedRowKeys.length!=1"
								>
									<i class="iconfont" style="color:#1890ff;margin-right:8px;">&#xe60c;</i>物资清单
								</permission-button>
								<permission-button
									permCode
									banType="hide"
									@click="toOrderPrice"
									:disabled="selectedRowKeys.length!=1"
								>生成报价单</permission-button>
							</a-col>

							<a-col :span="12" style="text-align:right">
								<a-select placeholder="请选择" optionFilterProp="children" v-model="type" style="width:100px;">
									<a-select-option :value="1">工单</a-select-option>
									<a-select-option :value="0">工单明细</a-select-option>
								</a-select>
								<a-select
									placeholder="请选择"
									optionFilterProp="children"
									v-model="state"
									style="width:100px;"
								>
									<a-select-option :value="-1">全部</a-select-option>
									<a-select-option :value="0">待产</a-select-option>
									<a-select-option :value="1">生产中</a-select-option>
									<a-select-option :value="2">暂停中</a-select-option>
									<a-select-option :value="3">已终止</a-select-option>
									<a-select-option :value="4">完成</a-select-option>
								</a-select>
								<a-input
									type="text"
									v-model="keyword"
									style="width:300px"
									:placeholder="type==1?'工作令、工单号、名称、交期':'图号'"
									@keyup.enter.native="select"
								></a-input>
								<a-button type="primary" @click="select">查询</a-button>
							</a-col>
						</div>
					</a-row>
					<a-row style="padding-top:10px;">
						<a-table
							rowKey="workOrderId"
							:columns="columns"
							:pagination="false"
							:dataSource="data"
							:rowSelection="{selectedRowKeys:selectedRowKeys,onChange: onSelectChange}"
						>
							<template slot="workOrderState" slot-scope="text, record, index">
								<div>
									<span v-if="text==1" style="font-size:14px;color:#027DB4;">生产中</span>
									<span v-if="text==0" style="font-size:14px;color:#999999;">待产</span>
									<a-popover title placement="right">
										<template slot="content">
											<span>原因：{{record.reason}}</span>
										</template>
										<span v-if="text==2" style="font-size:14px;color:#F59A23;">暂停</span>
									</a-popover>
									<a-popover title placement="right">
										<template slot="content">
											<span>原因：{{record.reason}}</span>
										</template>
										<span v-if="text==3" style="font-size:14px;color:#E02D2D;">终止</span>
									</a-popover>
									<span v-if="text==4" style="font-size:14px;color:#10CF0C;">完成</span>
								</div>
							</template>
							<template slot="hasWorkLoad" slot-scope="text, record, index">
								<div>
									<a-icon type="close" v-if="text==false" style="color:red;font-size: 16px;" />
									<a-icon type="check" v-if="text==true" style="color:green;font-size: 16px;" />
								</div>
							</template>
							<template slot="priority" slot-scope="text, record, index">
								<div>
									<i class="iconfont" style="color:#F59A23;" v-if="text==true">&#xe649;</i>
								</div>
							</template>
							<template slot="workOrderTitle" slot-scope="text, record, index">
								<div>
									<a href="jsvascript:" @click="showDetails(record)">{{text}}</a>
								</div>
							</template>
							<template slot="schedule" slot-scope="text, record, index">
								<div>
									<a-progress
										v-if="record.workOrderState==1"
										:percent="text==null?0:parseInt(text*100)"
										status="active"
									/>
									<a-progress v-if="record.workOrderState==0" :percent="text==null?0:parseInt(text*100)" />
									<a-progress
										v-if="record.workOrderState==2"
										:percent="text==null?0:parseInt(text*100)"
										strokeColor="#F59A23"
									/>
									<a-progress
										v-if="record.workOrderState==3"
										:percent="text==null?0:parseInt(text*100)"
										status="exception"
									/>
									<a-progress
										v-if="record.workOrderState==4"
										:percent="text==null?0:parseInt(text*100)"
										strokeColor="#10CF0C"
									/>
								</div>
							</template>
							<template slot="detail" slot-scope="text, record, index">
								<permission-button
									permCode
									banType="disabled"
									class="button_text btn_disabled"
									@click="toWorkOrderDetailsList(record)"
								>工单明细</permission-button>
								<!-- <span style="color:#1890ff;cursor: pointer;" @click="toWorkOrderDetailsList(record)">工单明细</span> -->
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
				</a-col>
			</a-row>
		</div>
		<a-modal
			title="新增工单"
			:footer="null"
			width="1000px"
			:visible="addVisible"
			@cancel="handleCancel(1)"
			:maskClosable="false"
		>
			<add-work-order v-on:changeAddModal="changeAddModal" ref="newWorkOrder"></add-work-order>
		</a-modal>
		<a-modal
			title="修改工单"
			:footer="null"
			width="1000px"
			:visible="editVisible"
			@cancel="handleCancel(2)"
			:maskClosable="false"
		>
			<edit-work-order
				v-on:changeEditModal="changeEditModal"
				ref="editWorkOrder"
				:woekOrderId="selectedRowKeys[0]"
			></edit-work-order>
		</a-modal>
		<a-modal
			title="暂停操作"
			:footer="null"
			width="600px"
			:visible="pauseVisible"
			@cancel="handleCancel(3)"
			:maskClosable="false"
		>
			<a-form :form="form" layout="inline">
				<a-form-item label="暂停原因" style="margin-bottom:20px;">
					<a-textarea
						maxlength="50"
						v-decorator="['reason',{rules: [{ required: true, message: '请填写暂停原因' }]}]"
						style="width:454px;"
						:autosize="{ minRows: 6, maxRows: 6 }"
					></a-textarea>
				</a-form-item>
				<a-form-item style="display:block;text-align:right;">
					<a-button style="margin-right:12px;" @click="handleCancel(3)">取消</a-button>
					<a-button type="primary" @click="pause">保存</a-button>
				</a-form-item>
			</a-form>
		</a-modal>
		<a-modal
			title="终止操作"
			:footer="null"
			width="600px"
			:visible="terminationVisible"
			@cancel="handleCancel(4)"
			:maskClosable="false"
		>
			<a-form :form="form" layout="inline">
				<a-form-item label="终止原因" style="margin-bottom:20px;">
					<a-textarea
						maxlength="50"
						v-decorator="['reason',{rules: [{ required: true, message: '请填写终止原因' }]}]"
						style="width:454px;"
						:autosize="{ minRows: 6, maxRows: 6 }"
					></a-textarea>
					<p style="color:red;">注：工单终止后，无法再恢复生产。</p>
				</a-form-item>
				<a-form-item style="display:block;text-align:right;">
					<a-button style="margin-right:12px;" @click="handleCancel(4)">取消</a-button>
					<a-button type="primary" @click="termination">保存</a-button>
				</a-form-item>
			</a-form>
		</a-modal>
		<a-modal
			title="工单详情"
			:footer="null"
			width="800px"
			:visible="detailsVisible"
			@cancel="handleCancel(5)"
			:maskClosable="false"
		>
			<WorkOrderListDetails :detailsMsg="detailsMsg"></WorkOrderListDetails>
		</a-modal>
	</div>
</template>
<script>
import Vue from "vue";
import {
	Table,
	Pagination,
	Modal,
	Popover,
	Progress,
	Form,
	Input,
	Select
} from "ant-design-vue";
Vue.use(Table);
Vue.use(Pagination);
Vue.use(Select);
Vue.use(Modal);
Vue.use(Popover);
Vue.use(Progress);
Vue.use(Form);
Vue.use(Input);

import AddWorkOrder from "./AddWorkOrder";
import EditWorkOrder from "./EditWorkOrder";
import WorkOrderListDetails from "./WorkOrderListDetails";

const columns = [
	{
		dataIndex: "gongzuolingNo",
		key: "gongzuolingNo",
		title: "工作令",
		width: 100
	},
	{
		dataIndex: "workOrderNo",
		title: "工单号",
		width: 100,
		key: "workOrderNo"
	},
	{
		dataIndex: "workOrderTitle",
		title: "工单标题",
		width: 160,
		key: "workOrderTitle",
		scopedSlots: { customRender: "workOrderTitle" }
	},

	{
		dataIndex: "workOrderIsPriority",
		key: "workOrderIsPriority",
		title: "优先级",
		width: 80,
		scopedSlots: { customRender: "priority" }
	},
	{
		dataIndex: "workOrderState",
		key: "workOrderState",
		title: "生产状态",
		width: 80,
		scopedSlots: { customRender: "workOrderState" }
	},
	{
		dataIndex: "schedule",
		key: "schedule",
		title: "生产进度",
		width: 100,
		scopedSlots: { customRender: "schedule" }
	},
	{
		dataIndex: "workOrderRemark",
		key: "workOrderRemark",
		title: "备注",
		width: 100,
		scopedSlots: { customRender: "comment" }
	},
	{
		dataIndex: "hasWorkLoad",
		key: "hasWorkLoad",
		title: "工时定额",
		width: 100,
		scopedSlots: { customRender: "hasWorkLoad" }
	},
	// {
	// 	dataIndex: "createTime",
	// 	key: "createTime",
	// 	title: "创建时间",
	// 	width: 100
	// },
	{
		dataIndex: "gmtPlanCompleted",
		key: "gmtPlanCompleted",
		title: "计划完工时间",
		width: 120
	},
	{
		dataIndex: "detail",
		key: "detail",
		title: "工单明细",
		width: 80,
		scopedSlots: { customRender: "detail" }
	}
];
export default {
	inject: ["reload"],
	name: "orderList",
	data() {
		return {
			type: 1,
			form: this.$form.createForm(this),
			isHideList: this.$route.params.id !== undefined ? true : false,
			columns,
			data: [],
			current: 1,
			pageSize: 10,
			total: 50,
			editVisible: false,
			addVisible: false,
			state: -1,
			keyword: "",
			selectedRowKeys: [],
			selectedRows: [],
			pauseVisible: false,
			terminationVisible: false,
			detailsVisible: false,
			detailsMsg: {}
		};
	},
	methods: {
		select() {
			if (this.type == 1) {
				this.getList();
			}
			if (this.type == 0) {
				if (this.keyword == "" || this.keyword == null) {
					this.$message.error(`请输入图号`);
					return false;
				}
				sessionStorage.drawingNo = this.keyword;
				this.keyword = "";
				this.$router.push({
					path: "/WorkOrderList/WorkOrderDetailsList/" + 9527
				});
			}
		},
		showDetails(row) {
			this.detailsVisible = true;
			this.detailsMsg = row;
			console.log(row);
		},
		toInventory() {
			this.$router.push({
				path: "/WorkOrderList/Inventory/" + this.selectedRows[0].workOrderId
			});
		},
		toOrderPrice() {
			this.$router.push({
				path: "/WorkOrderList/OrderPrice/" + this.selectedRows[0].workOrderId
			});
		},
		//修改逻辑判断
		editShow() {
			if (this.selectedRows[0].workOrderState != 0) {
				this.$message.error(`只能对待产状态的订单进行修改！`);
			} else {
				this.editVisible = true;
			}
		},
		showDeleteConfirm() {
			let that = this;
			this.$confirm({
				title: "只能删除待产的工单,确定删除吗?",
				content: "",
				okText: "确定",
				okType: "danger",
				cancelText: "取消",
				onOk: function() {
					that.onDelete();
				},
				onCancel() {}
			});
		},
		onSelectChange(selectedRowKeys, a) {
			console.log(selectedRowKeys, a);
			this.selectedRowKeys = selectedRowKeys;
			this.selectedRows = a;
		},
		toWorkOrderDetailsList(row) {
			this.$router.push({
				path: "/WorkOrderList/WorkOrderDetailsList/" + row.workOrderId
			});
		},
		//删除
		onDelete() {
			if (
				this.selectedRows
					.map(item => {
						return item.workOrderState == 0;
					})
					.find(item => item == false) == undefined
			) {
				this.Axios(
					{
						url: "/api-workorder/workOrder/del",
						params: this.selectedRowKeys,
						type: "post",
						option: { successMsg: "删除成功！" },
						config: {
							headers: { "Content-Type": "application/json" }
						}
					},
					this
				).then(
					result => {
						if (result.data.code === 200) {
							this.getList();
							this.selectedRowKeys = [];
							this.selectedRows = [];
						}
					},
					({ type, info }) => {}
				);
			} else {
				this.$message.error("只能删除待产状态的工单，请重新选择！");
			}
		},
		//投产
		goIntoOperation() {
			if (
				this.selectedRows
					.map(item => {
						return item.isShooting == true;
					})
					.find(item => item == false) != undefined
			) {
				this.$message.error("没有完成工艺排配，不能进行投产！");
			} else if (
				this.selectedRows
					.map(item => {
						return item.workOrderState == 0;
					})
					.find(item => item == false) != undefined
			) {
				this.$message.error("只能对待产状态下的工单进行投产，请重新选择！");
			} else {
				this.Axios(
					{
						url: "/api-workorder/workOrder/goIntoOperation",
						params: this.selectedRowKeys,
						type: "post",
						option: { successMsg: "投产成功！" },
						config: {
							headers: { "Content-Type": "application/json" }
						}
					},
					this
				).then(
					result => {
						if (result.data.code === 200) {
							this.getList();
							this.selectedRowKeys = [];
							this.selectedRows = [];
						}
					},
					({ type, info }) => {}
				);
			}
		},
		//恢复
		regain() {
			if (
				this.selectedRows
					.map(item => {
						return item.workOrderState == 2;
					})
					.find(item => item == false) != undefined
			) {
				this.$message.error("只能对暂停状态下的工单进行恢复，请重新选择！");
			} else {
				this.Axios(
					{
						url: "/api-workorder/workOrder/regain",
						params: this.selectedRowKeys,
						type: "post",
						option: { successMsg: "恢复成功！" },
						config: {
							headers: { "Content-Type": "application/json" }
						}
					},
					this
				).then(
					result => {
						if (result.data.code === 200) {
							this.getList();
							this.selectedRowKeys = [];
							this.selectedRows = [];
						}
					},
					({ type, info }) => {}
				);
			}
		},
		//暂停
		pause() {
			this.form.validateFieldsAndScroll((err, values) => {
				console.log(values);
				if (!err) {
					let qs = require("qs");
					let data = qs.stringify({
						workOrderId: this.selectedRowKeys[0],
						reason: values.reason
					});
					this.Axios(
						{
							url: "/api-workorder/workOrder/pause",
							params: data,
							type: "post",
							option: { successMsg: "暂停成功！" }
							// config: {
							// 	headers: { "Content-Type": "application/json" }
							// }
						},
						this
					).then(
						result => {
							if (result.data.code === 200) {
								this.pauseVisible = false;
								this.getList();
								this.selectedRowKeys = [];
								this.selectedRows = [];
								this.form.resetFields();
							}
						},
						({ type, info }) => {}
					);
				}
			});
		},
		//终止
		termination() {
			this.form.validateFieldsAndScroll((err, values) => {
				console.log(values);
				if (!err) {
					let qs = require("qs");
					let data = qs.stringify({
						workOrderId: this.selectedRowKeys[0],
						reason: values.reason
					});
					this.Axios(
						{
							url: "/api-workorder/workOrder/termination",
							params: data,
							type: "post",
							option: { successMsg: "终止成功！" }
							// config: {
							// 	headers: { "Content-Type": "application/json" }
							// }
						},
						this
					).then(
						result => {
							if (result.data.code === 200) {
								this.terminationVisible = false;
								this.getList();
								this.selectedRowKeys = [];
								this.selectedRows = [];
								this.form.resetFields();
							}
						},
						({ type, info }) => {}
					);
				}
			});
		},
		pauseShow() {
			if (this.selectedRows[0].workOrderState != 1) {
				this.$message.error(`只能对生产中的订单进行暂停！`);
			} else {
				this.pauseVisible = true;
			}
		},
		terminationShow() {
			if (
				this.selectedRows[0].workOrderState != 1 &&
				this.selectedRows[0].workOrderState != 2
			) {
				this.$message.error(`只能对生产中或者暂停的订单进行终止！`);
			} else {
				this.terminationVisible = true;
			}
		},
		changeEditModal(params) {
			this.editVisible = params;
			this.getList();
			this.selectedRowKeys = [];
			this.selectedRows = [];
		},
		changeAddModal(params) {
			if (params.type == "Cancel") {
				this.addVisible = params.value;
			} else {
				this.addVisible = params.value;
				this.getList();
			}
		},
		handleCancel(a) {
			if (a == 1) {
				// this.addVisible = false;
				this.$refs.newWorkOrder.confirmCancel();
				// this.reload();
			}
			if (a == 2) {
				this.$refs.editWorkOrder.confirmCancel();
				// this.editVisible = false;
				// this.reload();
			}
			if (a == 3) {
				this.pauseVisible = false;
				this.form.resetFields();
			}
			if (a == 4) {
				this.terminationVisible = false;
				this.form.resetFields();
			}
			if (a == 5) {
				this.detailsVisible = false;
			}
		},
		moreOperation({ key }) {
			console.log(key);
		},
		confirm(e) {
			console.log(e);
			this.$message.success("Click on Yes");
		},
		cancel(e) {
			console.log(e);
			this.$message.error("Click on No");
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
		edit(record, text, index) {
			this.$router.push({ path: "/OrderList/OrderEdit/" + record.id });
		},
		getList() {
			this.Axios(
				{
					url: "/api-workorder/workOrder/list",
					params: {
						page: this.current,
						size: this.pageSize,
						state: this.state,
						keyword: this.keyword
					},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.data = result.data.data.data;
						this.total = result.data.data.totalElement;
					}
				},
				({ type, info }) => {}
			);
		}
	},
	created() {
		this.getList();
		let a = this.$route.matched.find(
			item => item.name === "WorkOrderDetailsList"
		)
			? true
			: false;
		let b = this.$route.params.id !== undefined ? true : false;
		this.isHideList = a || b ? true : false;
	},
	watch: {
		$route() {
			this.getList();
			let a = this.$route.matched.find(
				item => item.name === "WorkOrderDetailsList"
			)
				? true
				: false;
			let b = this.$route.params.id !== undefined ? true : false;
			this.isHideList = a || b ? true : false;
		}
	},
	components: {
		AddWorkOrder,
		EditWorkOrder,
		WorkOrderListDetails
	}
};
</script>
<style lang="less">
@import url("../../assets/layout.less");
.work_order_list {
}
</style>
