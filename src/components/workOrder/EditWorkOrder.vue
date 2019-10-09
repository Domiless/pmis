<template>
	<div class="edit_work_order">
		<a-form :form="form" layout="inline" @keyup.enter.native="update">
			<a-tabs defaultActiveKey="1">
				<a-tab-pane tab="基础信息" key="1">
					<a-form-item label="工单号">
						<a-input
							v-decorator="['no',{rules: [{ required: true, message: '请填写工单号' }]}]"
							style="width:335px;"
							placeholder="保存后将无法修改"
							disabled
						></a-input>
					</a-form-item>
					<a-form-item label="工作令号">
						<a-input
							v-decorator="['gongzuolingNo',{rules: [{ required: true, message: '请填写工作令号' }]}]"
							style="width:335px;"
							placeholder="保存后将无法修改"
							disabled
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
							oninput="if(value.length>20)value=value.slice(0,20)"
							style="width:335px;"
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
					<div>
						如需查看或管理，请切换至
						<span
							style="cursor: pointer;color:#1890ff;text-decoration: underline;"
							@click="$router.push({path:'/WorkOrderList/WorkOrderDetailsList/'+workOrderId});$emit('changeEditModal', false);"
						>工单明细列表</span>
					</div>
				</a-tab-pane>
			</a-tabs>

			<a-form-item style="display:block;text-align:right;">
				<a-button style="margin-right:12px;" @click="confirmCancel">取消</a-button>
				<a-button type="primary" @click="update">保存</a-button>
			</a-form-item>
		</a-form>
	</div>
</template>
<script>
import Vue from "vue";
import {
	Table,
	Tabs,
	Modal,
	Form,
	Input,
	DatePicker,
	Select,
	Radio
} from "ant-design-vue";
Vue.use(Table);
Vue.use(Tabs);
Vue.use(Select);
Vue.use(Modal);
Vue.use(Form);
Vue.use(Input);
Vue.use(DatePicker);
Vue.use(Radio);
import moment from "moment";
import OrderSelect from "../public/OrderSelect";
export default {
	props: {
		woekOrderId: {
			default: null
		}
	},
	data() {
		return {
			count: 1,
			radioValue: 1,
			form: this.$form.createForm(this),
			cooperatorList: [],
			enterpriseList: [],
			isPriority: false,
			gmtPlanStart: "",
			gmtPlanCompleted: "",
			workOrderId: ""
		};
	},
	methods: {
		chickNumber(rule, value, callback) {
			if (
				(/^\d+(\.\d{0,2})?$/.test(value) == false || value <= 0) &&
				value != "" &&
				value != null
			) {
				callback(new Error("只能输入大于0,且只能保留两位小数"));
			} else {
				callback();
			}
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
		moment,
		confirmCancel() {
			this.form.resetFields();
			this.$emit("changeEditModal", false);
		},
		//单个查询
		findOne() {
			this.Axios(
				{
					url: "/api-workorder/workOrder/findOne",
					params: {
						workOrderId: this.woekOrderId
					},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.workOrderId = result.data.data.workOrder.id;
						this.isPriority = result.data.data.workOrder.isPriority;
						this.gmtPlanStart = result.data.data.workOrder.gmtPlanStart;
						this.gmtPlanCompleted = result.data.data.workOrder.gmtPlanCompleted;
						setTimeout(() => {
							this.form.setFieldsValue({
								no: result.data.data.workOrder.no,
								gongzuolingNo: result.data.data.workOrder.gongzuolingNo,
								title: result.data.data.workOrder.title,
								client: result.data.data.workOrder.client,
								planAmount: result.data.data.workOrder.planAmount,
								contractingUnits: result.data.data.workOrder.contractingUnits,
								gmtPlanStart: moment(
									result.data.data.workOrder.gmtPlanStart,
									"YYYY/MM/DD HH:mm:ss"
								),
								gmtPlanCompleted: moment(
									result.data.data.workOrder.gmtPlanCompleted,
									"YYYY/MM/DD HH:mm:ss"
								),
								remark: result.data.data.workOrder.remark
							});
						}, 100);
					}
				},
				({ type, info }) => {}
			);
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
		},
		filterOption(input, option) {
			return (
				option.componentOptions.children[0].text
					.toLowerCase()
					.indexOf(input.toLowerCase()) >= 0
			);
		},
		//修改
		update() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					console.log(values);
					if (
						Date.parse(this.gmtPlanStart) - Date.parse(this.gmtPlanCompleted) >=
						0
					) {
						this.$message.error("计划完工时间不能小于计划开工时间");
						return false;
					}
					let qs = require("qs");
					let data = qs.stringify({
						workOrderId: this.woekOrderId,
						no: values.no,
						gongzuolingNo: values.gongzuolingNo,
						title: values.title,
						client: values.client,
						planAmount: values.planAmount,
						contractingUnits: values.contractingUnits,
						gmtPlanStart: this.gmtPlanStart,
						gmtPlanCompleted: this.gmtPlanCompleted,
						isPriority: this.isPriority,
						remark: values.remark
					});
					this.Axios(
						{
							url: "/api-workorder/workOrder/update",
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
								this.$emit("changeEditModal", false);
							}
						},
						({ type, info }) => {}
					);
				}
			});
		}
	},
	components: {
		OrderSelect
	},
	created() {
		this.findOne();
		this.getSubcontractList();
	},
	watch: {
		woekOrderId() {
			if (this.woekOrderId != "" && this.woekOrderId != null) {
				this.findOne();
			}
		}
	}
};
</script>
<style lang="less">
.edit_work_order {
	.ant-form-item-label {
		width: 120px;
	}
	.ant-form-item {
		margin-bottom: 20px;
	}
}
</style>