<template>
	<div class="add_work_order">
		<a-form :form="form" layout="inline" @keyup.enter.native="add">
			<a-tabs v-model="tabsDefaultValue">
				<a-tab-pane tab="基础信息" key="1">
					<a-form-item label="工单号">
						<a-input
							maxlength="16"
							v-decorator="['no',{rules: [{ required: true, message: '请填写工单号' }]}]"
							style="width:335px;"
							placeholder="保存后将无法修改"
						></a-input>
					</a-form-item>
					<a-form-item label="工作令号">
						<a-input
							maxlength="16"
							v-decorator="['gongzuolingNo',{rules: [{ required: true, message: '请填写工作令号' }]}]"
							style="width:335px;"
							placeholder="保存后将无法修改"
						></a-input>
					</a-form-item>
					<a-form-item label="工单标题">
						<a-input
							maxlength="20"
							v-decorator="['title',{rules: [{ required: true, message: '请填写工单标题' }]}]"
							style="width:335px;"
						></a-input>
					</a-form-item>
					<a-form-item label="客户名称">
						<a-select
							showSearch
							v-decorator="['client']"
							placeholder
							optionFilterProp="children"
							style="width: 335px"
							:filterOption="filterOption"
						>
							<a-select-option
								:value="item.name"
								v-for="item in cooperatorList"
								:key="item.id"
							>{{item.name}}</a-select-option>
						</a-select>
					</a-form-item>
					<a-form-item label="总数量">
						<a-input
							v-decorator="['planAmount',{rules: [{validator: chickNumber}]}]"
							type="number"
							style="width:335px;"
							oninput="if(value.length>20)value=value.slice(0,20)"
						></a-input>
					</a-form-item>
					<a-form-item label="承制单位">
						<a-select
							showSearch
							v-decorator="['contractingUnits']"
							placeholder
							optionFilterProp="children"
							style="width: 335px"
							:filterOption="filterOption"
						>
							<a-select-option
								:value="item.name"
								v-for="item in enterpriseList"
								:key="item.id"
							>{{item.name}}</a-select-option>
						</a-select>
					</a-form-item>
					<a-form-item label="计划开工时间">
						<a-date-picker
							v-decorator="['gmtPlanStart',{rules: [{ required: true, message: '请填写计划开工时间' }]}]"
							style="width:335px;"
							@change="(a,b)=>onChangeDate(a,b,1)"
							format="YYYY/MM/DD HH:mm:ss"
							:showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
						/>
					</a-form-item>
					<a-form-item label="实际开工时间">
						<a-input style="width:335px;" disabled></a-input>
					</a-form-item>
					<a-form-item label="计划完工时间">
						<a-date-picker
							v-decorator="['gmtPlanCompleted',{rules: [{ required: true, message: '请填写计划完工时间' }]}]"
							style="width:335px;"
							@change="(a,b)=>onChangeDate(a,b,2)"
							format="YYYY/MM/DD HH:mm:ss"
							:showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
						/>
					</a-form-item>
					<a-form-item label="实际完工时间">
						<a-input style="width:335px;" disabled></a-input>
					</a-form-item>
					<a-form-item label="优先级">
						<a-radio-group v-model="isPriority">
							<a-radio :value="false">正常</a-radio>
							<a-radio :value="true">优先</a-radio>
						</a-radio-group>
					</a-form-item>
					<a-form-item label="备注">
						<a-textarea
							maxlength="50"
							v-decorator="['remark']"
							style="width:809px;"
							:autosize="{ minRows: 4, maxRows: 4 }"
						></a-textarea>
					</a-form-item>
				</a-tab-pane>
				<a-tab-pane tab="工单明细" key="2" forceRender>
					<div style="text-align:right;padding-bottom:12px;">
						<a-button type="primary" @click="addVisible=true">批量导入</a-button>
					</div>
					<a-table :pagination="false" :columns="columns" :dataSource="data" bordered rowKey="id">
						<template
							v-for="col in ['serialNo','drawingNo', 'name','amount','gmtRequestCompletion', 'remark']"
							:slot="col"
							slot-scope="text, record, index"
						>
							<div :key="col">
								<a-input
									maxlength="20"
									style="margin: -5px 0"
									:defaultValue="text"
									@change="e => handleChangeTable(e.target.value, record.id, col)"
								/>
							</div>
						</template>
						<template slot="amount" slot-scope="text, record, index">
							<div>
								<a-input
									style="margin: -5px 0"
									:defaultValue="text"
									type="number"
									oninput="if(value.length>10)value=value.slice(0,10)"
									@change="e => handleChangeTable(e.target.value, record.id, 'amount')"
								/>
							</div>
						</template>
						<template slot="serialNo" slot-scope="text, record, index">
							<span>{{index+1}}</span>
						</template>
						<template slot="gmtRequestCompletion" slot-scope="text, record, index">
							<div>
								<a-date-picker
									@change="(e,d)=>handleTime(e,d,index)"
									:defaultValue="text!=''&&text!=null?moment(text, 'YYYY/MM/DD'):undefined"
									format="YYYY/MM/DD"
									style="width:100%"
								/>
							</div>
						</template>
						<template slot="operation" slot-scope="text, record, index">
							<div class="editable-row-operations">
								<span class="handle_style">
									<a-popconfirm title="确定删除吗？" @confirm="onDelete(index)" okText="确定" cancelText="取消">
										<a-popover placement="top">
											<template slot="content">
												<span>删除</span>
											</template>
											<a-icon type="delete" style="color:red;" />
										</a-popover>
									</a-popconfirm>
								</span>
							</div>
						</template>
					</a-table>
					<div
						@click="handleAdd"
						style=" cursor: pointer;color:#1890ff;margin-top:12px;display:inline-block;"
						class="handle_table"
					>
						<a-icon type="plus-circle" />&nbsp;添加一行
					</div>
				</a-tab-pane>
			</a-tabs>

			<a-form-item style="display:block;text-align:right;">
				<a-button style="margin-right:12px;" @click="confirmCancel">取消</a-button>
				<a-button type="primary" @click="add">保存</a-button>
			</a-form-item>
		</a-form>
		<a-modal
			title="导入提示"
			:footer="null"
			width="420px"
			:visible="addVisible"
			@cancel="handleCancel(1)"
			:maskClosable="false"
		>
			<div>
				导入步骤：
				<br />1、下载模板
				<!-- <a
					href="http://119.3.255.22:8030/template/%E5%B7%A5%E5%8D%95%E6%98%8E%E7%BB%86%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xls"
				>《工单明细模板.xls》</a>；-->
				<a href="http://114.116.238.150:8006/model/gongdanmingxi.xlsx">《工单明细模板.xlsx》</a>；
				<br />2、按格式要求填写，请勿模板修改结构；
				<br />3、点击下方“选择文件”按钮导入数据；
				<br />4、校对并保存数据。
				<br />
				<span style="color:#999999">提示：重复导入时，已经有数据将会被清空。</span>
			</div>
			<div style="padding-top:12px;">
				<a-upload
					:action="ApiSrc()"
					:multiple="true"
					:fileList="fileList"
					@change="handleChangeUpload"
					:headers="headers"
					:showUploadList="false"
				>
					<a-button type="primary">
						<a-icon type="upload" />选择文件
					</a-button>
				</a-upload>
			</div>
		</a-modal>
	</div>
</template>
<script>
import Vue from "vue";
import {
	Table,
	Tabs,
	Modal,
	Popover,
	Progress,
	Form,
	Input,
	DatePicker,
	Upload,
	Select,
	Radio
} from "ant-design-vue";
Vue.use(Table);
Vue.use(Tabs);
Vue.use(Select);
Vue.use(Modal);
Vue.use(Popover);
Vue.use(Progress);
Vue.use(Form);
Vue.use(Input);
Vue.use(DatePicker);
Vue.use(Upload);
Vue.use(Radio);

import OrderSelect from "../public/OrderSelect";
import moment from "moment";
const columns = [
	{
		dataIndex: "serialNo",
		title: "序号",
		width: 60,
		key: "serialNo",
		scopedSlots: { customRender: "serialNo" }
	},
	{
		dataIndex: "drawingNo",
		title: "图号",
		width: 140,
		key: "drawingNo",
		scopedSlots: { customRender: "drawingNo" }
	},
	{
		dataIndex: "name",
		key: "name",
		title: "名称",
		width: 100,
		scopedSlots: { customRender: "name" }
	},
	{
		dataIndex: "amount",
		key: "amount",
		title: "数量",
		width: 80,
		scopedSlots: { customRender: "amount" }
	},
	{
		dataIndex: "gmtRequestCompletion",
		key: "gmtRequestCompletion",
		title: "要求完成时间",
		width: 120,
		scopedSlots: { customRender: "gmtRequestCompletion" }
	},
	{
		dataIndex: "remark",
		key: "remark",
		title: "备注",
		width: 120,
		scopedSlots: { customRender: "remark" }
	},
	{
		dataIndex: "operation",
		key: "operation",
		title: "操作",
		width: 40,
		align: "center",
		scopedSlots: { customRender: "operation" }
	}
];
export default {
	inject: ["reload"],
	data() {
		return {
			tabsDefaultValue: "1",
			columns,
			data: [],
			count: 200000,
			isPriority: false,
			form: this.$form.createForm(this),
			fileList: [],
			addVisible: false,
			headers: {
				token: sessionStorage.getItem("token")
				// encType: "multipart/form-data"
			},
			cooperatorList: [],
			enterpriseList: [],
			gmtPlanStart: "",
			gmtPlanCompleted: ""
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
		getCurrentData(index) {
			let toDay = new Date().toLocaleDateString();
			console.log(toDay);

			return this.data[index].gmtRequestCompletion != ""
				? this.data[index].gmtRequestCompletion
				: toDay;
		},
		moment,
		add() {
			console.log(this.data.length);
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					// console.log(values);
					if (
						Date.parse(this.gmtPlanStart) - Date.parse(this.gmtPlanCompleted) >=
						0
					) {
						this.$message.error("计划完工时间不能小于计划开工时间");
						return false;
					}
					if (this.data.length == 0 || this.data == null) {
						this.$message.error(`请填写工单明细`);
						return false;
					}
					if (
						this.data
							.map(item => {
								return item.drawingNo != "";
							})
							.find(item => item == false) != undefined
					) {
						this.$message.error(`工单明细中有未填写图纸号`);
						return false;
					}
					if (
						this.data
							.map(item => {
								return item.name != "";
							})
							.find(item => item == false) != undefined
					) {
						this.$message.error(`工单明细中有未填写名称`);
						return false;
					}
					if (
						this.data
							.map(item => {
								return item.amount != "";
							})
							.find(item => item == false) != undefined
					) {
						this.$message.error(`工单明细中有未填写总数量`);
						return false;
					}
					if (
						this.data
							.map(item => {
								return item.amount > 0;
							})
							.find(item => item == false) != undefined
					) {
						this.$message.error(`工单明细中总数量必须大于0`);
						return false;
					}
					if (
						this.data
							.map(item => {
								return item.gmtRequestCompletion != "";
							})
							.find(item => item == false) != undefined
					) {
						this.$message.error(`工单明细中有未选择要求完成时间`);
						return false;
					}
					let qs = require("qs");
					let data = {
						no: values.no,
						gongzuolingNo: values.gongzuolingNo,
						title: values.title,
						client: values.client,
						planAmount: values.planAmount,
						contractingUnits: values.contractingUnits,
						gmtPlanStart: this.gmtPlanStart,
						gmtPlanCompleted: this.gmtPlanCompleted,
						isPriority: this.isPriority,
						remark: values.remark,
						workOrderDesDTOS: this.data.map(item => {
							return {
								serialNo: item.serialNo,
								drawingNo: item.drawingNo,
								name: item.name,
								amount: item.amount,
								gmtRequestCompletion: item.gmtRequestCompletion,
								remark: item.remark
							};
						})
					};
					console.log(data);
					this.Axios(
						{
							url: "/api-workorder/workOrder/add",
							params: data,
							type: "post",
							option: { successMsg: "添加成功！" },
							config: {
								headers: { "Content-Type": "application/json" }
							}
						},
						this
					).then(
						result => {
							if (result.data.code === 200) {
								console.log(result);
								this.form.resetFields();
								this.tabsDefaultValue = "1";
								this.data = [];
								let params = {
									type: "affirm",
									value: false
								};
								this.$emit("changeAddModal", params);
							}
						},
						({ type, info }) => {}
					);
				}
			});
		},
		onChangeDate(date, dateString, a) {
			if (a == 1) {
				this.gmtPlanStart = dateString;
			}
			if (a == 2) {
				this.gmtPlanCompleted = dateString;
			}
			console.log(a);
		},
		filterOption(input, option) {
			return (
				option.componentOptions.children[0].text
					.toLowerCase()
					.indexOf(input.toLowerCase()) >= 0
			);
		},
		ApiSrc() {
			return this.global.apiImport;
		},
		handleChangeUpload(info) {
			console.log(info);
			info.fileList = info.fileList.slice(-1);
			this.fileList = info.fileList;
			if (info.file.status !== "uploading") {
				// console.log(info.file, info.fileList);
			}
			if (info.file.response.code === 200) {
				this.$message.success("上传成功！");
				// console.log(info);
				this.data = info.fileList[0].response.data;
				console.log(this.data);
				this.addVisible = false;
			} else if (info.file.response.code != 200) {
				this.$message.error(info.file.response.msg);
			}
		},
		handleTime(e, d, index) {
			this.data[index].gmtRequestCompletion = d;
		},
		handleChangeTable(value, key, column) {
			const newData = [...this.data];
			const target = newData.filter(item => key === item.id)[0];
			if (target) {
				target[column] = value;
				this.data = newData;
			}
		},
		handleAdd() {
			const { count, data } = this;
			const newData = {
				id: count,
				serialNo: "",
				drawingNo: "",
				name: "",
				amount: "",
				gmtRequestCompletion: "",
				remark: ""
			};
			this.data = [...data, newData];
			this.count = count + 1;
		},
		onDelete(key) {
			this.data.splice(key, 1);
		},
		handleCancel(a) {
			this.addVisible = false;
		},
		showAddOrder() {
			this.addVisible = true;
		},
		confirmCancel() {
			this.form.resetFields();
			this.data = [];
			let params = {
				type: "Cancel",
				value: false
			};
			this.$emit("changeAddModal", params);
			// this.reload();
		},
		getSubcontractList() {
			this.Axios(
				{
					url: "/api-platform/collaborationUnit/list",
					params: {
						page: 1,
						size: -1
					},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						if (result.data.data.length < 1) {
							this.cooperatorList = [];
							this.enterpriseList = [];
						} else {
							if (
								result.data.data.find(item => item.type == 1) == null ||
								result.data.data.find(item => item.type == 1) == []
							) {
								this.cooperatorList = [];
							} else {
								this.cooperatorList = result.data.data.filter(
									item => item.type == 1
								);
							}
							if (
								result.data.data.find(item => item.type == 2) == null ||
								result.data.data.find(item => item.type == 2) == []
							) {
								this.enterpriseList = [];
							} else {
								this.enterpriseList = result.data.data.filter(
									item => item.type == 2
								);
							}
						}
					}
				},
				({ type, info }) => {}
			);
		}
	},
	created() {
		this.getSubcontractList();
	},
	components: {
		OrderSelect
	}
};
</script>
<style lang="less">
.add_work_order {
	.ant-form-item-label {
		width: 120px;
	}
	.ant-form-item {
		margin-bottom: 20px;
	}
	.table_style {
		padding-left: 20px;
		span {
			display: inline-block;
		}
		.serial_number {
			width: 25px;
			height: 25px;
			border-radius: 50%;
			background-color: #f2f2f2f2;
			line-height: 25px;
			text-align: center;
		}
	}
}
</style>