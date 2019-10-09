<template>
	<div class="inventory">
		<a-row style="line-height:50px;">
			<a-button @click="$router.back(-1)" icon="left">返回</a-button>
			<permission-button
				permCode="workorder_partlist_lookup.partlist_save"
				banType="hide"
				@click="save"
			>保存</permission-button>
			<permission-button
				permCode="workorder_partlist_lookup.workorder_partlist_watch"
				banType="hide"
				@click="getPreviewList"
			>
				<i class="iconfont" style="color:#1890ff;margin-right:8px;">&#xe60c;</i>打印预览
			</permission-button>
		</a-row>
		<a-row>
			<a-col :span="24" style="padding:20px 0;">
				<h2 style="text-align:center;">{{new Date().getFullYear()+'年'}}{{enterpriseName}}外购物资清单</h2>
			</a-col>
			<a-col :span="24">
				<a-form :form="form" layout="inline">
					<a-col :span="8">
						<a-form-item label="申请部门">
							<a-input v-decorator="['department']" style="width:280px;"></a-input>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="需求编号">
							<a-input v-decorator="['no']" style="width:280px;"></a-input>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="申请人">
							<a-input v-decorator="['demander']" style="width:280px;"></a-input>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="项目订单号">
							<a-input v-decorator="['order']" style="width:280px;"></a-input>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="项目名称">
							<a-input v-decorator="['project']" style="width:280px;"></a-input>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="申请日期">
							<a-date-picker
								v-decorator="['filing',{initialValue:moment(date, 'YYYY/MM/DD')}]"
								style="width:280px;"
								@change="(a,b)=>onChangeDate(a,b)"
								format="YYYY/MM/DD"
							/>
						</a-form-item>
					</a-col>
				</a-form>
			</a-col>
			<a-col :span="24" style="padding:20px 12px;">
				<a-table
					:columns="columns"
					:dataSource="data"
					bordered
					size="small"
					:pagination="false"
					rowKey="id"
				>
					<template
						v-for="col in [ 'materialCode', 'units','weight','number','recommend','manufacturers','way','remark']"
						:slot="col"
						slot-scope="text, record, index"
					>
						<div :key="col">
							<a-input
								style="margin: -5px 0"
								:value="text"
								@change="e => handleChange(e.target.value, record.id, col)"
							/>
						</div>
					</template>
					<template slot="time" slot-scope="text, record, index">
						<a-date-picker
							:defaultValue="text!=''?moment(text, 'YYYY/MM/DD'):undefined"
							style="width:130px;"
							@change="(a,b)=>onTableChangeDate(a,b,index)"
							format="YYYY/MM/DD"
						/>
					</template>
					<template slot="no" slot-scope="text, record, index">
						<span>{{index+1}}</span>
					</template>
					<template slot="detail" slot-scope="text, record, index">
						<permission-button permCode banType="hide" class="button_text" @click="del(index)">删除</permission-button>
						<!-- <span style="color:#1890ff;cursor: pointer;" @click="technologyModalShow(record)">工艺排配</span> -->
					</template>
					<!-- <template slot="materials" slot-scope="text, record, index">
						<span>{{index+1}}</span>
					</template>-->
				</a-table>
				<!-- <div style="line-height:50px;">提示：以上数据仅临时存储，离开该页将自动清空。</div> -->
			</a-col>
		</a-row>
	</div>
</template>
<script>
import Vue from "vue";
import {
	Table,
	Col,
	Row,
	Form,
	Pagination,
	DatePicker,
	Input
} from "ant-design-vue";
Vue.use(Pagination);
Vue.use(Table);
Vue.use(Col);
Vue.use(Row);
Vue.use(Form);
Vue.use(DatePicker);
Vue.use(Input);
import moment from "moment";
const columns = [
	{
		title: "序号",
		dataIndex: "no",
		width: 50,
		align: "center",
		scopedSlots: { customRender: "no" }
	},
	{
		title: "物料代码",
		dataIndex: "materialCode",
		width: 100,
		scopedSlots: { customRender: "materialCode" }
	},
	// {
	// 	title: "图号",
	// 	dataIndex: "drawingNo",
	// 	width: 140
	// },
	// {
	// 	title: "名称",
	// 	dataIndex: "name",
	// 	width: 140
	// },
	{
		title: "材料规格",
		dataIndex: "rawInfoStr",
		width: 120
	},
	{
		title: "所需物资",
		dataIndex: "materials",
		width: 120,
		scopedSlots: { customRender: "materials" }
	},
	{
		title: "计量单位",
		dataIndex: "units",
		width: 80,
		scopedSlots: { customRender: "units" }
	},
	{
		title: "需求重量",
		dataIndex: "weight",
		width: 100,
		scopedSlots: { customRender: "weight" }
	},
	{
		title: "需求数量",
		dataIndex: "number",
		width: 100,
		scopedSlots: { customRender: "number" }
	},
	{
		title: "推荐厂家",
		dataIndex: "recommend",
		width: 120,
		scopedSlots: { customRender: "recommend" }
	},
	{
		title: "指定厂家",
		dataIndex: "manufacturers",
		width: 120,
		scopedSlots: { customRender: "manufacturers" }
	},
	{
		title: "需求时间",
		dataIndex: "time",
		width: 130,
		scopedSlots: { customRender: "time" }
	},
	{
		title: "需求方式",
		dataIndex: "way",
		width: 100,
		scopedSlots: { customRender: "way" }
	},
	{
		title: "备注",
		dataIndex: "remark",
		width: 100,
		scopedSlots: { customRender: "remark" }
	},
	{
		dataIndex: "detail",
		key: "detail",
		title: "操作",
		width: 80,
		scopedSlots: { customRender: "detail" }
	}
];

const data = [];
export default {
	inject: ["reload"],
	data() {
		this.cacheData = data.map(item => ({ ...item }));
		return {
			form: this.$form.createForm(this),
			columns,
			data,
			date: new Date().toLocaleDateString(),
			inventory: {},
			enterpriseName: JSON.parse(sessionStorage.getItem("user")).enterpriseName,
			workOrderId: "",
			id: ""
		};
	},
	methods: {
		del(index) {
			this.data.splice(index, 1);
		},
		moment,
		onChangeDate(date, dateString) {},
		onTableChangeDate(date, dateString, index) {
			this.data[index].time = dateString;
		},
		handleChange(value, key, column) {
			const newData = [...this.data];
			const target = newData.filter(item => key === item.id)[0];
			if (target) {
				target[column] = value;
				this.data = newData;
			}
		},
		//原材料需求表
		getPreviewList() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					values.filing = this.date;
					let params = {
						workOrder: values,
						rawInfo: this.data
					};
					console.log(params);
					this.$info({
						title: "温馨提示",
						content: "打印时，请在打印设置中将“布局”设置为“横向”",
						onOk() {
							sessionStorage.priview = JSON.stringify(params);
							sessionStorage.priviewType = 3;
							window.open("/priview.html", "_blank");
						}
					});
				}
			});
		},
		findOne() {
			this.Axios(
				{
					url: "/api-workorder/workOrder/rawMaterialDetail",
					params: {
						workOrderId: this.$route.params.id
					},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.id = result.data.data.id;
						this.workOrderId = result.data.data.workOrderDO.id;
						this.data = result.data.data.quotationItems.map((item, index) => {
							return {
								id: index,
								materialCode:
									item.materialCode != undefined &&
									item.materialCode != null &&
									item.materialCode != ""
										? item.materialCode
										: "",
								rawInfoStr: item.rawInfoStr,
								materials:
									(item.rawMaterial.type == 1
										? "板料"
										: item.rawMaterial.type == 2
										? "棒料"
										: "型材") +
									" " +
									item.rawMaterial.name,
								units: "EA",
								weight: item.weight,
								number: item.rawNum,
								recommend:
									item.recommendFirm != undefined &&
									item.recommendFirm != null &&
									item.recommendFirm != ""
										? item.recommendFirm
										: "",
								manufacturers:
									item.realFirm != undefined &&
									item.realFirm != null &&
									item.realFirm != ""
										? item.realFirm
										: "",
								time:
									item.demandTime != undefined &&
									item.demandTime != null &&
									item.demandTime != ""
										? item.demandTime
										: "",
								way:
									item.demandWay != undefined &&
									item.demandWay != null &&
									item.demandWay != ""
										? item.demandWay
										: "",
								remark:
									item.note != undefined && item.note != null && item.note != ""
										? item.note
										: "",
								rawMaterialId: item.rawMaterial.id
							};
						});
						setTimeout(() => {
							this.form.setFieldsValue({
								filing: moment(this.date, "YYYY/MM/DD"),
								department: result.data.data.organizeName,
								no: result.data.data.code,
								demander: JSON.parse(sessionStorage.getItem("user")).userName,
								order: result.data.data.workOrderDO.gongzuolingNo,
								project: result.data.data.workOrderDO.title
							});
						}, 100);
					}
				},
				({ type, info }) => {}
			);
		},
		save() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					console.log(values);
					console.log(this.data);
					this.Axios(
						{
							url: "/api-workorder/quotation/add",
							params: {
								id: this.id,
								code: values.no,
								organizeName: values.department,
								workOrderId: this.workOrderId,
								quotations: this.data.map(item => {
									return {
										demandTime: item.time,
										demandWay: item.way,
										materialCode: item.materialCode,
										note: item.remark,
										num: item.number,
										rawMaterialId: item.rawMaterialId,
										realFirm: item.manufacturers,
										recommendFirm: item.recommend,
										unit: item.units,
										weight: item.weight
									};
								})
							},
							type: "post",
							option: { successMsg: "保存成功！" },
							config: {
								headers: { "Content-Type": "application/json" }
							}
						},
						this
					).then(
						result => {
							if (result.data.code === 200) {
								this.reload();
							}
						},
						({ type, info }) => {}
					);
				}
			});
		}
	},
	created() {
		this.findOne();
	}
};
</script>
<style lang="less">
.inventory {
	.ant-form-item-label {
		width: 100px;
	}
}
</style>