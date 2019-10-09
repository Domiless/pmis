<template>
	<div class="details">
		<a-row>
			<h3>
				<i class="iconfont" style="font-size:16px;color:#1890ff">&#xe61b;</i>基础信息
			</h3>
		</a-row>
		<a-form :form="form" layout="inline" style="voerflow:hidden;" @keyup.enter.native="update">
			<a-col :span="12">
				<a-form-item label="关联工单">
					<span>{{formMsg.workOrderNo}}</span>
				</a-form-item>
			</a-col>
			<a-col :span="12">
				<a-form-item label="工作令号">
					<span>{{formMsg.gongzuolingNo}}</span>
				</a-form-item>
			</a-col>
			<a-col :span="12">
				<a-form-item label="名称">
					<span>{{formMsg.name}}</span>
				</a-form-item>
			</a-col>
			<a-col :span="12">
				<a-form-item label="图号">
					<span>{{formMsg.drawingNo}}</span>
				</a-form-item>
			</a-col>
			<a-col :span="12">
				<a-form-item label="原料类型">
					<span>{{detailsMsg.rawMaterialDO.type==1?'板料':detailsMsg.rawMaterialDO.type==2?'棒料':"型材"}}</span>
				</a-form-item>
			</a-col>
			<a-col :span="12">
				<a-form-item label="选择原料">
					<span>{{detailsMsg.rawMaterialDO.name}}</span>
				</a-form-item>
			</a-col>
			<a-col :span="12">
				<a-form-item label="计划数量">
					<span>{{formMsg.num}}</span>
				</a-form-item>
			</a-col>
			<a-col :span="12">
				<a-form-item label="毛坯数量">
					<span>{{detailsMsg.embryoNum}}</span>
				</a-form-item>
			</a-col>
			<a-col :span="12">
				<a-form-item label="每毛坯件数">
					<span>{{detailsMsg.inTheEmbryoComponents}}</span>
				</a-form-item>
			</a-col>
			<a-col :span="24" v-if="materialVlaue==1||materialVlaue==null">
				<a-col :span="12">
					<a-form-item label="毛坯外形尺寸长">
						<span>{{detailsMsg.lengthOrRadius}}</span>&nbsp;±
						<span>{{detailsMsg.lengthOrRadiusError}}</span>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="毛坯外形尺寸宽">
						<span>{{detailsMsg.widthOrRadius}}</span>&nbsp;±
						<span>{{detailsMsg.widthOrRadiusError}}</span>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="毛坯外形尺寸高">
						<span>{{detailsMsg.heightOrLength}}</span>&nbsp;±
						<span>{{detailsMsg.heightOrLengthError}}</span>
					</a-form-item>
				</a-col>
			</a-col>
			<a-col :span="24" v-if="materialVlaue==2">
				<a-col :span="12">
					<a-form-item label="毛坯外形尺寸半径">
						<span>{{detailsMsg.lengthOrRadius}}</span>&nbsp;±
						<span>{{detailsMsg.lengthOrRadiusError}}</span>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="毛坯外形尺寸长度">
						<span>{{detailsMsg.lengthOrRadius}}</span>&nbsp;±
						<span>{{detailsMsg.lengthOrRadiusError}}</span>
					</a-form-item>
				</a-col>
			</a-col>
			<a-col :span="24" v-if="materialVlaue==3">
				<a-col :span="12">
					<a-form-item label="毛坯外形尺寸长度">
						<span>{{detailsMsg.lengthOrRadius}}</span>&nbsp;±
						<span>{{detailsMsg.lengthOrRadiusError}}</span>
					</a-form-item>
				</a-col>
			</a-col>
			<a-col :span="24">
				<a-form-item label="备注">
					<span>{{detailsMsg.remarks}}</span>
				</a-form-item>
			</a-col>
			<a-col :span="24">
				<h3>
					<i class="iconfont" style="font-size:16px;color:#1890ff">&#xe603;</i>排配信息
				</h3>
			</a-col>
			<a-col :span="24">
				<a-table :pagination="false" :columns="columns" :dataSource="data" bordered rowKey="id">
					<template slot="serialNo" slot-scope="text, record, index">
						<span class="serial_number">{{index+1}}</span>
					</template>
				</a-table>
			</a-col>
		</a-form>
	</div>
</template>
<script>
import Vue from "vue";
import { Col, Row, Form } from "ant-design-vue";
Vue.use(Col);
Vue.use(Row);
Vue.use(Form);
const columns = [
	{
		dataIndex: "serialNo",
		title: "序号",
		width: 30,
		key: "serialNo",
		align: "center",
		scopedSlots: { customRender: "serialNo" }
	},
	{
		dataIndex: "workTypeName",
		title: "工序",
		width: 60,
		key: "workTypeName",
		scopedSlots: { customRender: "workTypeId" }
	},
	{
		dataIndex: "processInfo",
		key: "processInfo",
		title: "工序内容",
		width: 120,
		scopedSlots: { customRender: "processInfo" }
	},
	{
		dataIndex: "principalEmployeeName",
		key: "principalEmployeeName",
		title: "班组长",
		width: 80,
		scopedSlots: { customRender: "employeeId" }
	},
	{
		dataIndex: "checkerName",
		key: "checkerName",
		title: "检验人",
		width: 80,
		scopedSlots: { customRender: "chick" }
	},
	{
		dataIndex: "remarks",
		key: "remarks",
		title: "备注",
		width: 60,
		scopedSlots: { customRender: "remarks" }
	}
];
export default {
	props: {
		drawingDetails: {
			default: null
		}
	},
	data() {
		return {
			form: this.$form.createForm(this),
			formMsg: {},
			columns,
			data: [],
			materialVlaue: "",
			detailsMsg: {}
		};
	},
	methods: {
		getOneDetails(id) {
			this.Axios(
				{
					url: "/api-workorder/drawing/detail",
					params: {
						workOrderDesId: id
					},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.detailsMsg = result.data.data;
						this.data = result.data.data.process;
						this.materialVlaue = result.data.data.rawMaterialDO.type;
					}
				},
				({ type, info }) => {}
			);
		}
	},
	created() {
		this.formMsg = { ...this.drawingDetails };
		this.getOneDetails(this.drawingDetails.workOrderDesId);
	},
	watch: {
		drawingDetails() {
			if (this.drawingDetails != null && this.drawingDetails != "") {
				this.formMsg = { ...this.drawingDetails };
				this.getOneDetails(this.drawingDetails.workOrderDesId);
			}
		}
	}
};
</script>
<style lang="less">
.details {
	overflow: hidden;
	.ant-form-inline .ant-form-item > .ant-form-item-label {
		width: 134px;
	}
	.ant-table-thead > tr > th,
	.ant-table-tbody > tr > td {
		padding: 8px 4px;
	}
}
</style>