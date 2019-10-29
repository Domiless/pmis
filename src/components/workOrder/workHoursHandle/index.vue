<template>
	<div class="work_hours_handle">
		<a-row style="padding:0 20px;">
			<a-button @click="$router.back(-1)" icon="left">返回</a-button>
			<permission-button permCode banType="hide" @click="coefficientVisible=true">工时系数</permission-button>
			<permission-button
				permCode="workorder_worktime_lookup.workorder_workhour_save"
				banType="hide"
				@click="save"
			>
				<i class="iconfont" style="color:#1890ff;margin-right:8px;">&#xe60d;</i>保存修改
			</permission-button>
		</a-row>
		<a-row style="padding:20px 20px 0;" v-for="(item,index) in allMsg" :key="index">
			<div class="item_case">
				<a-col :span="24" class="item_title">{{item.drawing.name}}</a-col>
				<a-col :span="12" class="item_content">
					<span class="item_label">工作令号：</span>
					<span>{{item.drawing.workOrderDes.workOrder.gongzuolingNo}}</span>
				</a-col>
				<a-col :span="12" class="item_content">
					<span class="item_label">图号：</span>
					<span>{{item.drawing.drawingNo}}</span>
				</a-col>
				<a-col :span="12" class="item_content">
					<span class="item_label">计划编号：</span>
					<span>{{item.drawing.workOrderDes.planCode}}</span>
				</a-col>
				<a-col :span="12" class="item_content">
					<span class="item_label">名称：</span>
					<span>{{item.drawing.name}}</span>
				</a-col>
				<a-col :span="12" class="item_content">
					<span class="item_label">计划数量：</span>
					<span>{{item.drawing.workOrderDes.amount}}</span>
				</a-col>
				<a-col :span="12" class="item_content">
					<span class="item_label">每毛坯件数：</span>
					<span>{{item.drawing.inTheEmbryoComponents}}</span>
				</a-col>
				<a-col :span="12" class="item_content">
					<span class="item_label">材料名称：</span>
					<span>{{(item.drawing.rawMaterialDO.type==1?"板料":item.drawing.rawMaterialDO.type==2?"棒料":"型材")+' '+item.drawing.rawMaterialDO.name}}</span>
				</a-col>
				<a-col :span="12" class="item_content">
					<span class="item_label">毛坯外形尺寸：</span>
					<span>{{item.dimensions}}</span>
				</a-col>
				<a-col :span="12" class="item_content">
					<span class="item_label">工艺人员：</span>
					<span>{{item.drawing.modifiedBy}}</span>
				</a-col>
				<a-col :span="12" class="item_content">
					<span class="item_label">备注：</span>
					<span>{{item.drawing.workOrderDes.remark}}</span>
				</a-col>
				<a-col :span="24" style="padding:20px 12px;">
					<table class="table_style">
						<tr>
							<th>序号</th>
							<th>工种</th>
							<th>工序内容</th>
							<th>
								<span style="color:red;padding:0 4px">*</span>准备工时(分)
							</th>
							<th>
								<span style="color:red;padding:0 4px">*</span>单件工时(分)
							</th>
							<th>
								工时系数
								<a-tooltip placement="top">
									<template slot="title">
										<span>工时系数不填时，默认为系数1</span>
									</template>
									<a-icon type="info-circle" style="color:rgb(24, 144, 255)" />
								</a-tooltip>
							</th>
							<!-- <th>合格数</th>
							<th>加工者</th>
							<th>检验</th>-->
						</tr>
						<tr v-for="(i, index1) in tableData[index]" :key="index1">
							<td style="width:5%">{{index1+1}}</td>
							<td style="width:10%">{{i.workTypeName}}</td>
							<td style="width:25%">{{i.processInfo}}</td>
							<td style="width:15%;padding:4px;">
								<a-input
									type="number"
									v-model="i.preparationTime"
									onkeyup="if( ! /^(?:[1-9]\d*|0)(?:\.\d{1,2})?$/.test(this.value)){this.value='';}"
								></a-input>
							</td>
							<td style="width:15%;padding:4px;">
								<a-input
									type="number"
									v-model="i.itemWorkTime"
									onkeyup="if( ! /^(?:[1-9]\d*|0)(?:\.\d{1,2})?$/.test(this.value)){this.value=this.value.replace(/\.{2,}/g,'');}"
								></a-input>
							</td>
							<td style="width:15%;padding:4px;">
								<a-select
									allowClear
									style="width:100%;"
									v-model="i.coefficientDO.id"
									@change="(value)=>getCoefficientValue(value,index,index1)"
								>
									<a-select-option
										:value="item.id"
										v-for="(item,index3) in coefficientList"
										:key="index3"
									>{{item.range}}</a-select-option>
								</a-select>
							</td>
							<!-- <td style="width:10%">{{i.checkResultDO!=null?i.checkResultDO.result:""}}</td>
							<td
								style="width:10%"
							>{{i.executives.length>0?i.executives.find(item=>{return item.isExecution==true}).employeeName:""}}</td>
							<td style="width:10%"></td>-->
						</tr>
					</table>
				</a-col>
				<a-col :span="24" style="padding:0 12px 20px">
					<h3>历史工时信息</h3>
					<table class="table_style">
						<tr>
							<th>序号</th>
							<th>工种</th>
							<th>工序内容</th>
							<th>准备工时(分)</th>
							<th>单件工时(分)</th>
							<th>工时系数</th>
						</tr>
						<tr v-for="(i, index1) in item.history!=null?item.history:[]" :key="index1">
							<td style="width:5%">{{index1+1}}</td>
							<td style="width:10%">{{i.workTypeName}}</td>
							<td style="width:25%">{{i.processInfo}}</td>
							<td style="width:15%;">{{i.preparationTime}}</td>
							<td style="width:15%;">{{i.itemWorkTime}}</td>
							<td
								style="width:15%;"
							>{{i.coefficientDO!=null?i.coefficientDO.minValue+"~"+i.coefficientDO.maxValue+" 系数"+i.coefficientDO.coefficient:""}}</td>
						</tr>
					</table>
				</a-col>
			</div>
		</a-row>
		<a-row style="padding:20px 20px 0;">
			<permission-button
				permCode="workorder_worktime_lookup.workorder_workhour_save"
				banType="hide"
				@click="save"
			>
				<i class="iconfont" style="color:#1890ff;margin-right:8px;">&#xe60d;</i>保存修改
			</permission-button>
		</a-row>
		<a-modal
			title="工时系数配置"
			:footer="null"
			width="800px"
			:visible="coefficientVisible"
			@cancel="handleCancel()"
			:maskClosable="false"
		>
			<Coefficient></Coefficient>
			<div style="text-align:right;padding-top:20px;">
				<a-button type="primary" @click="coefficientVisible=false">关闭</a-button>
			</div>
		</a-modal>
	</div>
</template>
<script>
import Vue from "vue";
import { Col, Row, Modal, Input } from "ant-design-vue";
Vue.use(Input);
Vue.use(Col);
Vue.use(Row);
Vue.use(Modal);
import Coefficient from "./Coefficient";
export default {
	data() {
		return {
			coefficientVisible: false,
			allMsg: [],
			tableData: [],
			getData: [],
			coefficientList: []
		};
	},
	methods: {
		getCoefficientValue(value, index, index1) {
			console.log(value);
			console.log(index);
			console.log(index1);
		},
		handleCancel() {
			this.coefficientVisible = false;
		},
		getPreviewList() {
			this.Axios(
				{
					url: "/api-workorder/WorkLoadManage/list",
					params: this.$route.params.id.split(","),
					type: "post",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						let a = result.data.data.map(item => {
							return {
								...item,
								drawing: {
									...item.drawing,
									process: item.drawing.process.map(i => {
										return {
											...i,
											coefficientDO:
												i.coefficientDO != null ? i.coefficientDO : { id: "" }
										};
									})
								}
							};
						});
						this.allMsg = a;
						console.log(this.allMsg);
						this.tableData = this.allMsg.map(item1 => {
							return item1.drawing.process.map(item => {
								return {
									...item,
									itemWorkTime:
										item.itemWorkTime != null ? item.itemWorkTime : 0,
									preparationTime:
										item.preparationTime != null ? item.preparationTime : 0
								};
							});
						});
						this.tableData;
						console.log(this.tableData);
					}
				},
				({ type, info }) => {}
			);
		},
		save() {
			console.log(this.tableData);
			let value = new Array();
			this.getData = this.tableData.map(item => {
				return item.map(i => {
					return {
						processId: i.id,
						itemWorkTime: i.itemWorkTime,
						preparationTime: i.preparationTime,
						coefficientId: i.coefficientDO.id
					};
				});
			});
			value = this.getData.reduce(function(a, b) {
				return a.concat(b);
			});
			if (
				value
					.map(item => {
						return (
							/^(?:[1-9]\d*|0)(?:\.\d{1,2})?$/.test(item.itemWorkTime) &&
							/^(?:[1-9]\d*|0)(?:\.\d{1,2})?$/.test(item.preparationTime)
						);
					})
					.find(item => item == false) != undefined
			) {
				this.$message.error(
					"单件工时、准备工时只能是大于等于0的且保留两位小数"
				);
			} else if (
				value
					.map(item => {
						return (
							item.itemWorkTime !== "" &&
							item.itemWorkTime !== null &&
							(item.preparationTime !== "" && item.preparationTime !== null)
						);
					})
					.find(item => item == false) != undefined
			) {
				this.$message.error("单件工时、准备工时不能为空");
			} else {
				this.Axios(
					{
						url: "/api-workorder/WorkLoadManage/save",
						params: value,
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
							console.log(result);
							this.$router.back(-1);
							// this.data = [];
							// let params = {
							// 	type: "affirm",
							// 	value: false
							// };
							// this.$emit("addTechnology", params);
						}
					},
					({ type, info }) => {}
				);
			}
		},
		getList() {
			this.Axios(
				{
					url: "/api-workorder/coefficient/list",
					params: {},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result.data.data);
						if (result.data.data != null && result.data.data != []) {
							this.coefficientList = result.data.data.map(item => {
								return {
									range:
										item.minValue +
										"~" +
										item.maxValue +
										" 系数" +
										item.coefficient,
									id: item.id
								};
							});
						}
					}
				},
				({ type, info }) => {}
			);
		}
	},
	created() {
		this.getPreviewList();
		this.getList();
	},
	components: {
		Coefficient
	}
};
</script>
<style lang="less">
.work_hours_handle {
	overflow: hidden;
	.item_case {
		border: 1px solid #e8e8e8;
		width: 80%;
		overflow: hidden;
		.item_title {
			background-color: #f2f2f2;
			line-height: 40px;
			padding: 0 12px;
			font-weight: 600;
			font-size: 16px;
		}
		.item_label {
			display: inline-block;
			width: 120px;
			text-align: right;
		}
		.item_content {
			line-height: 32px;
		}
		.table_style {
			width: 100%;
			border: 1px solid #dde2eb;
			border-collapse: collapse;
			tr {
				width: 100%;
				th {
					text-align: center;
					border: 1px solid #dde2eb;
					line-height: 28px;
				}
				td {
					text-align: center;
					border: 1px solid #dde2eb;
					line-height: 28px;
				}
			}
		}
	}
}
</style>