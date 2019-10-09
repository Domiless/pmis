<template>
	<div class="work_order_details_list">
		<router-view></router-view>
		<div :class="[{hide:isHideList}]">
			<a-row>
				<a-col :span="24" style="padding:0 20px;">
					<a-row>
						<div style="line-height:50px;">
							<a-col :span="12">
								<a-button @click="$router.back(-1)" icon="left" style="margin-right:20px;">返回</a-button>
								<permission-button
									permCode="workorder_detail_lookup.workorder_detail_add"
									banType="hide"
									@click="addShow"
								>
									<a-icon style="color:#1890ff;" type="plus" />新增
								</permission-button>
								<permission-button
									permCode="workorder_detail_lookup.workorder_detail_update"
									banType="hide"
									@click="editShow"
									:disabled="selectedRowKeys.length!=1"
								>
									<a-icon style="color:#1890ff;" type="edit" />修改
								</permission-button>

								<permission-button
									permCode="workorder_detail_lookup.workorder_detail_delete"
									banType="hide"
									@click="showDeleteConfirm"
									:disabled="selectedRowKeys.length!=1"
								>
									<a-icon style="color:#1890ff;" type="delete" />删除
								</permission-button>
								<permission-button
									permCode
									banType="hide"
									@click="toworkHoursHandle"
									:disabled="selectedRowKeys.length<1"
								>
									<i class="iconfont" style="color:#1890ff;margin-right:8px;">&#xea06;</i>工时管理
								</permission-button>
								<permission-button
									permCode="workorder_detail_lookup.workorder_detail_watch"
									banType="hide"
									@click="toPriview"
									:disabled="selectedRowKeys.length<1"
								>
									<i class="iconfont" style="color:#1890ff;margin-right:8px;">&#xe60c;</i>预览
								</permission-button>
							</a-col>
						</div>
					</a-row>
					<a-row style="padding-top:10px;">
						<a-table
							rowKey="workOrderDesId"
							:columns="columns"
							:pagination="false"
							:dataSource="data"
							:rowSelection="{selectedRowKeys:selectedRowKeys,onChange: onSelectChange}"
						>
							<template slot="isShooting" slot-scope="text, record, index">
								<div>
									<a-icon type="close" v-if="text==false" style="color:red;font-size: 16px;" />
									<a-icon type="check" v-if="text==true" style="color:green;font-size: 16px;" />
								</div>
							</template>
							<template slot="hasWorkLoad" slot-scope="text, record, index">
								<div>
									<a-icon type="close" v-if="text==false" style="color:red;font-size: 16px;" />
									<a-icon type="check" v-if="text==true" style="color:green;font-size: 16px;" />
								</div>
							</template>
							<template slot="schedule" slot-scope="text, record, index">
								<div>
									<a-popover title placement="right">
										<template slot="content">
											<span>当前进度：{{record.scheduleName}}</span>
										</template>
										<a-progress
											:percent="text==null?0:parseInt(text*100)"
											v-if="record.schedule!=1"
											status="active"
										/>
									</a-popover>
									<a-progress
										:percent="text==null?0:parseInt(text*100)"
										strokeColor="#10CF0C"
										v-if="record.schedule==1"
									/>
								</div>
							</template>
							<template slot="detail" slot-scope="text, record, index">
								<permission-button
									permCode="workorder_detail_lookup.workorder_paipei"
									banType="disabled"
									class="button_text btn_disabled"
									@click="technologyModalShow(record)"
								>工艺排配</permission-button>
								<!-- <span style="color:#1890ff;cursor: pointer;" @click="technologyModalShow(record)">工艺排配</span> -->
							</template>
						</a-table>
					</a-row>
				</a-col>
				<a-col :span="24" style="padding-top:12px;padding-left:20px;">提示：以上信息全部完成排配后，工单才能投产。</a-col>
			</a-row>
		</div>

		<a-modal
			title="新增工单明细"
			width="800px"
			:visible="addVisible"
			@cancel="handleCancel(1)"
			:maskClosable="false"
			class="modal_form_style"
			:footer="null"
		>
			<a-form
				:form="form"
				layout="inline"
				style="overflow:hidden"
				@keyup.enter.native="add"
				size="small"
			>
				<a-col :span="12">
					<a-form-item label="图纸号">
						<a-input
							maxlength="20"
							v-decorator="['drawingNo',{rules: [{ required: true, message: '请填写图纸号' }]}]"
							style="width:240px;"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="名称">
						<a-input
							maxlength="20"
							v-decorator="['name',{rules: [{ required: true, message: '请填写名称' }]}]"
							style="width:240px;"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="数量">
						<a-input
							type="number"
							oninput="if(value.length>10)value=value.slice(0,10)"
							v-decorator="['amount',{rules: [{ required: true, message: '请填写数量' },{validator: chickNumber}]}]"
							style="width:240px;"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="要求完成时间">
						<a-date-picker
							v-decorator="['gmtRequestCompletion',{rules: [{ required: true, message: '请选择要求完成时间' }]}]"
							style="width:240px"
							@change="(a,b)=>changeTime(a,b,1)"
							format="YYYY/MM/DD"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="24">
					<a-form-item label="序号">
						<a-input
							type="number"
							oninput="if(value.length>10)value=value.slice(0,10)"
							v-decorator="['serialNo',{rules: [{validator: chickNumber}]}]"
							style="width:240px;"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col :span="24">
					<a-form-item label="备注">
						<a-textarea
							maxlength="50"
							v-decorator="['remark']"
							style="width:615px;"
							:autosize="{ minRows: 4, maxRows: 4 }"
						></a-textarea>
					</a-form-item>
				</a-col>
				<a-col :span="24">
					<a-form-item style="display:block;text-align:right;margin-bottom:0">
						<a-button @click="handleCancel(1)" style="margin-right:12px;">取消</a-button>
						<a-button type="primary" @click="add">保存</a-button>
					</a-form-item>
				</a-col>
			</a-form>
		</a-modal>
		<a-modal
			title="修改工单明细"
			:footer="null"
			width="800px"
			:visible="editVisible"
			@cancel="handleCancel(2)"
			:maskClosable="false"
			class="modal_form_style"
		>
			<a-form :form="form" layout="inline" style="overflow:hidden" @keyup.enter.native="edit">
				<a-col :span="12">
					<a-form-item label="图纸号">
						<a-input
							maxlength="20"
							v-decorator="['drawingNo',{rules: [{ required: true, message: '请填写图纸号' }]}]"
							style="width:240px;"
							:disabled="desState==1"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="名称">
						<a-input
							maxlength="20"
							v-decorator="['name',{rules: [{ required: true, message: '请填写名称' }]}]"
							style="width:240px;"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="数量">
						<a-input
							type="number"
							oninput="if(value.length>10)value=value.slice(0,10)"
							v-decorator="['amount',{rules: [{ required: true, message: '请填写数量' },{validator: chickNumber}]}]"
							style="width:240px;"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="要求完成时间">
						<a-date-picker
							v-decorator="['gmtRequestCompletion',{rules: [{ required: true, message: '请选择要求完成时间' }]}]"
							style="width:240px"
							@change="(a,b)=>changeTime(a,b,2)"
							format="YYYY/MM/DD"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="24">
					<a-form-item label="序号">
						<a-input
							type="number"
							oninput="if(value.length>10)value=value.slice(0,10)"
							v-decorator="['serialNo',{rules: [{validator: chickNumber}]}]"
							style="width:240px;"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col :span="24">
					<a-form-item label="备注">
						<a-textarea
							maxlength="50"
							v-decorator="['remark']"
							style="width:615px;"
							:autosize="{ minRows: 4, maxRows: 4 }"
						></a-textarea>
					</a-form-item>
				</a-col>
				<a-col :span="24">
					<a-form-item style="display:block;text-align:right;margin-bottom:0">
						<a-button @click="handleCancel(2)" style="margin-right:12px;">取消</a-button>
						<a-button type="primary" @click="edit">保存</a-button>
					</a-form-item>
				</a-col>
			</a-form>
		</a-modal>
		<a-modal
			title="新增工艺排配"
			width="1200px"
			:visible="technologyAddVisible"
			@cancel="handleCancel(3)"
			:maskClosable="false"
			:footer="null"
		>
			<technology-add
				:drawingMsg="drawingMsg"
				v-on:addTechnology="addTechnology"
				:chicker="chicker"
				:employeeList="employeeList"
			></technology-add>
		</a-modal>
		<a-modal
			title="修改工艺排配"
			:footer="null"
			width="1200px"
			:visible="technologyEditVisible"
			@cancel="handleCancel(4)"
			:maskClosable="false"
		>
			<technology-edit
				:drawingMsg="drawingEditMsg"
				v-on:editTechnology="editTechnology"
				:chicker="chicker"
				:employeeList="employeeList"
			></technology-edit>
		</a-modal>
		<a-modal
			title="工艺排配详情"
			:footer="null"
			width="800px"
			:visible="technologyDetailsVisible"
			@cancel="handleCancel(5)"
			:maskClosable="false"
		>
			<Details :drawingDetails="drawingDetails"></Details>
		</a-modal>
	</div>
</template>
<script>
import Vue from "vue";
import {
	Table,
	Col,
	Row,
	Modal,
	Popover,
	Progress,
	Form,
	Input,
	DatePicker
} from "ant-design-vue";
Vue.use(Table);
Vue.use(Col);
Vue.use(Row);
Vue.use(Modal);
Vue.use(Popover);
Vue.use(Progress);
Vue.use(Form);
Vue.use(Input);
Vue.use(DatePicker);

import moment from "moment";
import TechnologyAdd from "./TechnologyAdd";
import TechnologyEdit from "./TechnologyEdit";
import Details from "./Details";
const columns = [
	{
		dataIndex: "planCode",
		title: "计划编号",
		width: 60,
		key: "planCode"
	},
	{
		dataIndex: "drawingNo",
		title: "图号",
		width: 100,
		key: "drawingNo"
	},
	{
		dataIndex: "name",
		title: "名称",
		width: 100,
		key: "name"
	},
	{
		dataIndex: "num",
		key: "num",
		title: "数量",
		width: 80
	},
	{
		dataIndex: "gmtRequestCompletion",
		key: "gmtRequestCompletion",
		title: "要求完成时间",
		width: 80,
		scopedSlots: { customRender: "priority" }
	},
	{
		dataIndex: "schedule",
		key: "schedule",
		title: "生产进度",
		width: 100,
		scopedSlots: { customRender: "schedule" }
	},

	{
		dataIndex: "remark",
		key: "remark",
		title: "备注",
		width: 160,
		scopedSlots: { customRender: "comment" }
	},
	{
		dataIndex: "hasWorkLoad",
		key: "hasWorkLoad",
		title: "工时定额",
		width: 100,
		scopedSlots: { customRender: "hasWorkLoad" }
	},
	{
		dataIndex: "isShooting",
		key: "isShooting",
		title: "工艺排配",
		width: 120,
		scopedSlots: { customRender: "isShooting" }
	},
	{
		dataIndex: "detail",
		key: "detail",
		title: "更多操作",
		width: 80,
		scopedSlots: { customRender: "detail" }
	}
];
export default {
	data() {
		return {
			isHideList: this.$route.params.id !== undefined ? false : true,
			columns,
			data: [],
			addVisible: false,
			editVisible: false,
			technologyAddVisible: false,
			technologyEditVisible: false,
			technologyDetailsVisible: false,
			form: this.$form.createForm(this),
			selectedRowKeys: [],
			selectedRows: [],
			getTime: "",
			desState: null,
			workOrderDesId: "",
			drawingMsg: "",
			drawingEditMsg: "",
			chicker: {},
			employeeList: [],
			drawingDetails: {}
		};
	},
	methods: {
		chickNumber(rule, value, callback) {
			if (
				/^\+?[1-9]\d*$/.test(value) == false &&
				value != "" &&
				value != null
			) {
				callback(new Error("只能输入大于0的整数"));
			} else {
				callback();
			}
		},
		addTechnology(params) {
			if (params.type == "Cancel") {
				this.technologyAddVisible = params.value;
			}
			if (params.type == "affirm") {
				this.technologyAddVisible = params.value;
				this.getList(this.$route.params.id);
				this.selectedRows = [];
				this.selectedRowKeys = [];
			}
		},
		editTechnology(params) {
			console.log(params);
			if (params.type == "Cancel") {
				this.technologyEditVisible = params.value;
			}
			if (params.type == "affirm") {
				this.technologyEditVisible = params.value;
				this.getList(this.$route.params.id);
				this.selectedRows = [];
				this.selectedRowKeys = [];
			}
		},
		technologyModalShow(row) {
			console.log(row);
			if (row.state != 0) {
				this.technologyDetailsVisible = true;
				this.drawingDetails = row;
				return false;
			}
			if (row.isShooting == false) {
				this.technologyAddVisible = true;
				this.drawingMsg = row;
				return false;
			}
			if (row.isShooting == true) {
				this.technologyEditVisible = true;
				this.drawingEditMsg = row;
				return false;
			}
		},
		onDelete() {
			if (this.data[0].state != 0) {
				this.$message.error(`工单当前状态无法进行删除操作`);
			} else {
				let qs = require("qs");
				let data = qs.stringify({
					workOrderDesId: this.selectedRowKeys[0]
				});
				this.Axios(
					{
						url: "/api-workorder/workOrderDes/del",
						params: data,
						type: "post",
						option: { successMsg: "删除成功！" }
						// config: {
						// 	headers: { "Content-Type": "application/json" }
						// }
					},
					this
				).then(
					result => {
						if (result.data.code === 200) {
							this.getList(this.$route.params.id);
							this.selectedRowKeys = [];
							this.selectedRows = [];
						}
					},
					({ type, info }) => {}
				);
			}
		},
		showDeleteConfirm() {
			let that = this;
			this.$confirm({
				title: "确定删除吗?",
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
		moment,
		addShow() {
			if (this.data[0] == undefined) {
				this.addVisible = true;
			} else if (this.data[0].state != 0) {
				this.$message.error(`工单当前状态无法进行新增操作`);
			} else {
				this.addVisible = true;
			}
		},
		add() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					let qs = require("qs");
					let data = qs.stringify({
						workOrderId: this.$route.params.id,
						serialNo: values.serialNo,
						drawingNo: values.drawingNo,
						name: values.name,
						amount: values.amount,
						gmtRequestCompletion: this.getTime,
						remark: values.remark
					});
					this.Axios(
						{
							url: "/api-workorder/workOrderDes/add",
							params: data,
							type: "post",
							option: { successMsg: "添加成功！" }
							// config: {
							// 	headers: { "Content-Type": "application/json" }
							// }
						},
						this
					).then(
						result => {
							if (result.data.code === 200) {
								console.log(result);
								this.addVisible = false;
								this.getList(this.$route.params.id);
								this.form.resetFields();
								this.selectedRowKeys = [];
								this.selectedRows = [];
							}
						},
						({ type, info }) => {}
					);
				}
			});
		},
		edit() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					let qs = require("qs");
					let data = qs.stringify({
						workOrderId: this.$route.params.id,
						workOrderDesId: this.workOrderDesId,
						serialNo: values.serialNo,
						drawingNo: values.drawingNo,
						name: values.name,
						amount: values.amount,
						gmtRequestCompletion: this.getTime,
						remark: values.remark
					});
					this.Axios(
						{
							url: "/api-workorder/workOrderDes/update",
							params: data,
							type: "post",
							option: { successMsg: "修改成功！" }
							// config: {
							// 	headers: { "Content-Type": "application/json" }
							// }
						},
						this
					).then(
						result => {
							if (result.data.code === 200) {
								console.log(result);
								this.editVisible = false;
								this.form.resetFields();
								this.getList(this.$route.params.id);
								this.selectedRowKeys = [];
								this.selectedRows = [];
							}
						},
						({ type, info }) => {}
					);
				}
			});
		},
		editShow() {
			if (this.selectedRows[0].state == 0) {
				this.editVisible = true;
				this.findOne();
			} else {
				this.$message.error(`工单当前状态无法进行修改操作`);
			}
		},
		onSelectChange(selectedRowKeys, a) {
			console.log(selectedRowKeys, a);
			this.selectedRowKeys = selectedRowKeys;
			this.selectedRows = a;
		},
		changeTime(a, b, c) {
			if (c == 1) {
				this.getTime = b;
				console.log(this.getTime);
			}
		},
		handleCancel(a) {
			if (a == 1) {
				this.addVisible = false;
				this.form.resetFields();
			}
			if (a == 2) {
				this.editVisible = false;
				// this.form.resetFields();
			}
			if (a == 3) {
				this.technologyAddVisible = false;
			}
			if (a == 4) {
				this.technologyEditVisible = false;
			}
			if (a == 5) {
				this.technologyDetailsVisible = false;
			}
		},
		toPriview() {
			if (
				this.selectedRows
					.map(item => {
						return item.isShooting == true;
					})
					.find(item => item == false) == undefined
			) {
				this.getPreviewList();
			} else {
				this.$message.error("有未完成工艺排配的图纸，不能预览");
			}

			// sessionStorage.priview = JSON.stringify(this.selectedRowKeys);
			// window.open("/priview.html", "_blank");
		},
		getPreviewList() {
			this.Axios(
				{
					url: "/api-workorder/workOrderDes/preview",
					params: this.selectedRowKeys,
					type: "post",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result.data.data);
						// for (let i = 0; i < result.data.data.length; i++) {
						// 	result.data.data[i].qrCode = result.data.data[i].qrCode.replace(
						// 		// "D:/pms",
						// 		"/usr/local/nginx/html/pms",
						// 		this.global.erweima
						// 	);
						// }
						sessionStorage.priview = JSON.stringify(result.data.data);
						sessionStorage.priviewType = 1;
						console.log(result.data.data);
						window.open("/priview.html", "_blank");
					}
				},
				({ type, info }) => {}
			);
		},
		getList(id) {
			this.Axios(
				{
					url: "/api-workorder/workOrderDes/list",
					params: {
						workOrderId: id
					},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.data = result.data.data;
						// this.total = result.data.data.totalElement;
					}
				},
				({ type, info }) => {}
			);
		},
		findOne() {
			this.Axios(
				{
					url: "/api-workorder/workOrderDes/getOne",
					params: {
						workOrderDesId: this.selectedRowKeys[0]
					},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.workOrderDesId = result.data.data.id;
						this.getTime = result.data.data.gmtRequestCompletion;
						this.desState = result.data.data.state;
						setTimeout(() => {
							this.form.setFieldsValue({
								drawingNo: result.data.data.drawingNo,
								name: result.data.data.name,
								amount: result.data.data.amount,
								gmtRequestCompletion: moment(
									result.data.data.gmtRequestCompletion,
									"YYYY/MM/DD"
								),
								serialNo: result.data.data.serialNo,
								remark: result.data.data.remark
							});
						}, 100);
					}
				},
				({ type, info }) => {}
			);
		},
		findChicker() {
			this.Axios(
				{
					url: "/api-platform/employee/findChecker",
					params: {},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						// console.log(result.data.data);
						if (result.data.data == null) {
							// this.$message.warning("请先添加检验人员后再操作。", 5);
						} else {
							this.chicker = result.data.data;
						}
					}
				},
				({ type, info }) => {}
			);
		},
		findAllLeader() {
			this.Axios(
				{
					url: "/api-platform/employee/allLeader",
					params: {},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result.data.data);
						this.employeeList = result.data.data;
						// if (result.data.data == null) {
						// 	// this.$message.warning("请先添加检验人员后再操作。", 5);
						// } else {
						// 	this.chicker = result.data.data;
						// }
					}
				},
				({ type, info }) => {}
			);
		},
		toworkHoursHandle() {
			if (
				this.selectedRows
					.map(item => {
						return item.isShooting == true;
					})
					.find(item => item == false) == undefined
			) {
				this.$router.push({
					path:
						this.$router.history.current.path +
						"/WorkHoursHandle/" +
						this.selectedRowKeys.join(",")
				});
			} else {
				this.$message.error("有未完成工艺排配的图纸，不能进行工时管理");
			}
		}
	},
	components: {
		TechnologyAdd,
		TechnologyEdit,
		Details
	},
	created() {
		this.getList(this.$route.params.id);
		this.findChicker();
		this.findAllLeader();
		// console.log(this.$router.history.current.path);
		let a = this.$route.matched.find(item => item.name === "WorkHoursHandle")
			? true
			: false;
		let b = this.$route.params.id !== undefined ? false : true;
		this.isHideList = a || b ? true : false;
	},
	watch: {
		$route() {
			this.getList(this.$route.params.id);
			let a = this.$route.matched.find(item => item.name === "WorkHoursHandle")
				? true
				: false;
			let b = this.$route.params.id !== undefined ? false : true;
			this.isHideList = a || b ? true : false;
		}
	}
};
</script>

<style lang="less">
.work_order_details_list {
	.ant-table-thead > tr > th,
	.ant-table-tbody > tr > td {
		padding: 6px 16px;
	}
}
.modal_form_style {
	.ant-form-inline .ant-form-item > .ant-form-item-label {
		width: 120px;
	}
	.ant-form-inline .ant-form-item {
		margin-bottom: 20px;
	}
	.ant-input-number-handler-wrap {
		display: none;
	}
}
</style>
