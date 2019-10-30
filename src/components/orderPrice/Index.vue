<template>
	<div class="order_price">
		<a-row style="padding: 20px;">
			<a-button @click="$router.back(-1)" icon="left">返回</a-button>
			<permission-button
				permCode="workorder_offer_lookup.workorder_offer_watch"
				banType="hide"
				@click="findOne"
			>
				<i class="iconfont" style="color:#1890ff;margin-right:8px;">&#xe60c;</i>打印预览
			</permission-button>
		</a-row>
		<a-form :form="form" layout="inline">
			<a-col :span="24">
				<a-form-item label="标题">
					<a-input
						maxlength="20"
						v-decorator="['title',{rules: [{ required: true, message: '请填写询价方' }]}]"
						style="width:390px"
					></a-input>
				</a-form-item>
				<a-form-item label="签订时间">
					<a-date-picker
						v-decorator="['offerDate']"
						@change="(e,d)=>handleTime(e,d,1)"
						format="YYYY/MM/DD"
						style="width:390px"
					/>
				</a-form-item>
			</a-col>
			<a-col :span="24">
				<a-form-item label="需方">
					<a-input
						v-decorator="['inquiry',{rules: [{ required: true, message: '请填写询价方' }]}]"
						style="width:390px"
					></a-input>
				</a-form-item>
				<a-form-item label="需方订单号">
					<a-input maxlength="20" v-decorator="['inquiryNo']" style="width:390px"></a-input>
				</a-form-item>
			</a-col>
			<a-col :span="24">
				<a-form-item label="供方">
					<a-input
						maxlength="20"
						v-decorator="['supplier',{rules: [{ required: true, message: '请填订单标题' }]}]"
						style="width:390px"
					></a-input>
				</a-form-item>
				<a-form-item label="供方订单号">
					<a-input maxlength="20" v-decorator="['supplierNo']" style="width:390px"></a-input>
				</a-form-item>
			</a-col>
			<a-col :span="24">
				<a-form-item label="项目名称">
					<a-input
						v-decorator="['projectName',{rules: [{ required: true, message: '请填写询价方' }]}]"
						style="width:390px"
					></a-input>
				</a-form-item>
				<a-form-item label="协议编号">
					<a-input v-decorator="['agreementNo',{rules: []}]" style="width:390px"></a-input>
				</a-form-item>
			</a-col>
			<!-- <a-col :span="24">
				<a-form-item label="报价人邮箱">
					<a-input
						maxlength="20"
						v-decorator="['baoMail' ,{rules: [{validator: chickMail}]}]"
						style="width:390px"
					></a-input>
				</a-form-item>
				<a-form-item label="报价有效期">
					<a-date-picker
						v-decorator="['validDate']"
						@change="(e,d)=>handleTime(e,d,2)"
						format="YYYY/MM/DD"
						style="width:390px"
					/>
				</a-form-item>
			</a-col>-->
			<a-col :span="24">
				<a-form-item label="备注">
					<a-textarea
						maxlength="500"
						v-decorator="['remark']"
						style="width:920px;"
						:autosize="{ minRows: 4, maxRows: 4 }"
					></a-textarea>
				</a-form-item>
			</a-col>
		</a-form>
		<a-col :span="24">
			<a-table
				:columns="columns"
				rowKey="drawingNo"
				:dataSource="tableData"
				bordered
				size="small"
				:pagination="false"
			>
				<template
					v-for="col in ['materialRealFee', 'processRealFee','biaochuRealFee','otherFee','remark']"
					:slot="col"
					slot-scope="text, record, index"
				>
					<div :key="col">
						<a-input
							v-if="record.editable"
							style="margin: -5px 0"
							:value="text"
							@change="e => handleChange(e.target.value, record.drawingNo, col)"
						/>
						<template v-else>{{text}}</template>
					</div>
				</template>
				<template slot="materialRealFee" slot-scope="text, record, index">
					<div>
						<a-input
							v-if="record.editable"
							style="margin: -5px 0"
							:value="text"
							@change="e => handleChange(e.target.value, record.drawingNo, 'materialRealFee')"
						/>
						<a-tooltip placement="top">
							<template slot="title">
								<span v-for="(item,index2) in record.materialItem" :key="index2">
									{{item}}
									<br />
								</span>
							</template>
							<div v-if="record.editable!=true">{{text}}</div>
						</a-tooltip>
					</div>
				</template>
				<template slot="processRealFee" slot-scope="text, record, index">
					<div>
						<a-input
							v-if="record.editable"
							style="margin: -5px 0"
							:value="text"
							@change="e => handleChange(e.target.value, record.drawingNo, 'processRealFee')"
						/>
						<a-tooltip placement="top">
							<template slot="title">
								<span v-for="(item,index1) in record.processItem" :key="index1">
									{{item}}
									<br />
								</span>
							</template>
							<div v-if="record.editable!=true">{{text}}</div>
						</a-tooltip>
					</div>
				</template>
				<template slot="biaochuRealFee" slot-scope="text, record, index">
					<div>
						<a-input
							v-if="record.editable"
							style="margin: -5px 0"
							:value="text"
							@change="e => handleChange(e.target.value, record.drawingNo, 'biaochuRealFee')"
						/>
						<a-tooltip placement="top">
							<template slot="title">
								<span v-for="(item,index2) in record.biaochuItem" :key="index2">
									{{item}}
									<br />
								</span>
								<!-- <span>{{record.biaochuItem}}</span> -->
							</template>
							<div v-if="record.editable!=true">{{text}}</div>
						</a-tooltip>
					</div>
				</template>
				<template slot="operation" slot-scope="text, record, index">
					<div class="editable-row-operations">
						<span v-if="record.editable">
							<a @click="() => save(record.drawingNo,index)">保存</a>
							<a-popconfirm title="确定取消吗?" @confirm="() => cancel(record.drawingNo)">
								<a>取消</a>
							</a-popconfirm>
						</span>
						<span v-else>
							<a @click="() => edit(record.drawingNo)">修改</a>
						</span>
					</div>
				</template>
			</a-table>
			<div style="line-height:50px;">
				<a-col :span="8">
					<!-- <a-button v-if="tableData.length>0" @click="uplodVisible=true">
						<a-icon type="upload" />重新导入
					</a-button>-->
				</a-col>
				<a-col :span="8">
					<!-- <div style="text-align:center;" v-if="tableData.length<1">
						还未导入需要报价的清单，
						<a href="javascript:" @click="uplodVisible=true">立即导入</a>
					</div>-->
				</a-col>
				<a-col :span="8">
					<div style="text-align:right;">
						合计：
						<span style="font-size:18px;color:red;">{{total}}</span>
					</div>
				</a-col>
			</div>
			<div style="line-height:60px;">
				<permission-button
					permCode="workorder_offer_lookup.workorder_offer_save"
					banType="hide"
					:loading="loadingShow"
					type="primary"
					@click="add"
					:disabled="tableData==null||tableData==[]||tableData==undefined||tableData==''"
				>保存修改</permission-button>
			</div>
		</a-col>
		<!-- <a-modal
			title="导入提示"
			:footer="null"
			width="420px"
			:visible="uplodVisible"
			@cancel="handleCancel(1)"
			:maskClosable="false"
		>
			<div>
				导入步骤：
				<br />1、下载模板
				<a href="http://119.3.255.22:8001/订单报价模板.xlsx">《订单报价模板.xlsx》</a>；
				<a href="http://114.116.238.150:8006/model/baojiadan.xlsx">《订单报价模板.xlsx》</a>；
				<br />2、按格式要求填写，请勿模板修改结构；
				<br />3、点击下方“选择文件”按钮导入数据；
				<br />4、校对并保存数据。
				<br />
				<span style="color:#999999">提示：重复导入时，已经有数据将会被清空。</span>
			</div>
			<div style="padding-top:12px;">
				<a-upload
					:action="API()"
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
		</a-modal>-->
	</div>
</template>
<script>
import Vue from "vue";
import {
	Col,
	Row,
	Modal,
	Icon,
	Input,
	Form,
	Table,
	Popconfirm,
	Tooltip
} from "ant-design-vue";
Vue.use(Col);
Vue.use(Table);
Vue.use(Row);
Vue.use(Form);
Vue.use(Icon);
Vue.use(Input);
Vue.use(Popconfirm);
Vue.use(Tooltip);

import moment from "moment";
const columns = [
	{
		title: "序号",
		dataIndex: "no",
		width: "3%",
		scopedSlots: { customRender: "no" },
		align: "center"
	},
	{
		title: "图纸号",
		dataIndex: "drawingNo",
		width: "10%",
		scopedSlots: { customRender: "drawingNo" }
	},
	{
		title: "名称",
		dataIndex: "name",
		width: "10%",
		scopedSlots: { customRender: "name" }
	},
	{
		title: "数量",
		dataIndex: "number",
		width: "5%",
		scopedSlots: { customRender: "number" }
	},
	{
		title: "材料单价",
		dataIndex: "materialPrice",
		width: "5%",
		scopedSlots: { customRender: "materialPrice" }
	},
	{
		title: "材料费(元)",
		dataIndex: "materialRealFee",
		width: "8%",
		scopedSlots: { customRender: "materialRealFee" }
	},
	{
		title: "加工费(元)",
		dataIndex: "processRealFee",
		width: "8%",
		scopedSlots: { customRender: "processRealFee" }
	},
	// {
	// 	title: "表处类型",
	// 	dataIndex: "type",
	// 	width: "5%",
	// 	scopedSlots: { customRender: "type" }
	// },
	// {
	// 	title: "表处单价",
	// 	dataIndex: "price",
	// 	width: "5%",
	// 	scopedSlots: { customRender: "price" }
	// },
	{
		title: "表处费(元)",
		dataIndex: "biaochuRealFee",
		width: "6%",
		scopedSlots: { customRender: "biaochuRealFee" }
	},
	{
		title: "其他费用(元)",
		dataIndex: "otherFee",
		width: "8%",
		scopedSlots: { customRender: "otherFee" }
	},
	{
		title: "单价",
		dataIndex: "realUnitPrice",
		width: "5%",
		scopedSlots: { customRender: "unitPrice" }
	},
	{
		title: "小计(元)",
		dataIndex: "realAddFee",
		width: "6%",
		scopedSlots: { customRender: "addFee" }
	},
	{
		title: "备注",
		dataIndex: "remark",
		width: "8%",
		scopedSlots: { customRender: "remark" }
	},
	{
		title: "操作",
		width: "6%",
		dataIndex: "operation",
		scopedSlots: { customRender: "operation" }
	}
];
const tableData = [];
export default {
	data() {
		this.cacheData = tableData.map(item => ({ ...item }));
		return {
			remark: "",
			loadingShow: false,
			form: this.$form.createForm(this),
			columns,
			tableData,
			uplodVisible: false,
			headers: {
				token: sessionStorage.getItem("token")
			},
			fileList: [],
			offerDate: new Date().toLocaleString("chinese", { hour12: false }),
			validDate: "",
			NowDate: new Date().toLocaleString("chinese", { hour12: false }),
			userMsg: JSON.parse(sessionStorage.getItem("user")),
			total: 0
		};
	},
	methods: {
		chickPhone(rule, value, callback) {
			if (
				/^1[23456789]\d{9}$/.test(value) == false &&
				value != "" &&
				value != null
			) {
				callback(new Error("请输入正确的电话号码"));
			} else {
				callback();
			}
		},
		chickMail(rule, value, callback) {
			if (
				/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(
					value
				) == false &&
				value != "" &&
				value != null
			) {
				callback(new Error("请输入正确格式的邮箱"));
			} else {
				callback();
			}
		},
		moment,
		handleTime(e, d, a) {
			if (a == 1) {
				this.offerDate = d;
			}
			if (a == 2) {
				this.validDate = d;
			}
		},
		add() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					console.log(values);
					this.loadingShow = true;
					let newData = [...this.tableData];
					console.log(newData);
					let data = {
						workOrderId: this.$route.params.id,
						title: values.title,
						offerDate: this.offerDate,
						inquiry: values.inquiry,
						inquiryNo: values.inquiryNo,
						supplier: values.supplier,
						supplierNo: values.supplierNo,
						projectName: values.projectName,
						agreementNo: values.agreementNo,
						remark: values.remark,
						total: this.total,
						offerDesDTOList: newData.map(item => {
							console.log(item.biaochuItem);
							return {
								realAddFee: item.realAddFee,
								addFee: item.addFee,
								biaochuFee: item.biaochuFee,
								biaochuItem:
									item.biaochuItem != null && item.biaochuItem != ""
										? item.biaochuItem.join(",")
										: null,
								biaochuRealFee: item.biaochuRealFee,
								drawingNo: item.drawingNo,
								materialFee: item.materialFee,
								materialItem:
									item.materialItem != null && item.materialItem != ""
										? item.materialItem.join(",")
										: null,
								materialPrice: item.materialPrice,
								materialRealFee: item.materialRealFee,
								name: item.name,
								no: item.no,
								number: item.number,
								otherFee: item.otherFee,
								price: item.price,
								processFee: item.processFee,
								processItem:
									item.processItem != null && item.processItem != ""
										? item.processItem.join(",")
										: "",
								processRealFee: item.processRealFee,
								remark: item.remark,
								type: item.type,
								unitPrice: item.unitPrice,
								realUnitPrice: item.realUnitPrice
							};
						})
					};
					console.log(data);
					this.Axios(
						{
							url: "/api-workorder/offer/save",
							params: data,
							type: "post",
							option: { successMsg: "生成成功！" },
							config: {
								headers: { "Content-Type": "application/json" }
							}
						},
						this
					).then(
						result => {
							if (result.data.code === 200) {
								console.log(result);
								this.loadingShow = false;
								// this.$router.push({ path: "/HistoricalQuote" });
							}
						},
						({ type, info }) => {}
					);
				}
			});
		},
		API() {
			let url = this.global.apiSrc + "/zuul/api-workorder/offer/reckon";
			return url;
		},
		handleCancel() {
			this.uplodVisible = false;
		},
		handleChange(value, key, column) {
			console.log(key);
			const newData = [...this.tableData];
			const target = newData.filter(item => key === item.drawingNo)[0];
			if (target) {
				target[column] = value;
				this.tableData = newData;
			}
		},
		edit(key) {
			const newData = [...this.tableData];
			const target = newData.filter(item => key === item.drawingNo)[0];
			if (target) {
				target.editable = true;
				this.tableData = newData;
			}
		},
		save(key, index) {
			const newData = [...this.tableData];
			const target = newData.filter(item => key === item.drawingNo)[0];
			if (target) {
				delete target.editable;
				this.tableData = newData;
				this.cacheData = newData.map(item => ({ ...item }));
				this.tableData[index].realAddFee =
					(this.tableData[index].materialRealFee != null &&
					this.tableData[index].materialRealFee != ""
						? parseFloat(this.tableData[index].materialRealFee)
						: 0) +
					(this.tableData[index].processRealFee != null &&
					this.tableData[index].processRealFee != ""
						? parseFloat(this.tableData[index].processRealFee)
						: 0) +
					(this.tableData[index].biaochuRealFee != null &&
					this.tableData[index].biaochuRealFee != ""
						? parseFloat(this.tableData[index].biaochuRealFee)
						: 0) +
					(this.tableData[index].otherFee != null &&
					this.tableData[index].otherFee != ""
						? parseFloat(this.tableData[index].otherFee)
						: 0);
				this.tableData[index].realUnitPrice = (
					this.tableData[index].realAddFee / this.tableData[index].number
				).toFixed(2);
				this.total = 0;
				for (let i = 0; i < this.tableData.length; i++) {
					this.total += parseFloat(
						this.tableData[i].realAddFee != "" &&
							this.tableData[i].realAddFee != null
							? this.tableData[i].realAddFee
							: 0
					);
				}
				this.total = this.total.toFixed(2);
			}
		},
		cancel(key) {
			const newData = [...this.tableData];
			const target = newData.filter(item => key === item.drawingNo)[0];
			if (target) {
				Object.assign(
					target,
					this.cacheData.filter(item => key === item.drawingNo)[0]
				);
				delete target.editable;
				this.tableData = newData;
			}
		},
		getById() {
			let qs = require("qs");
			let data = qs.stringify({
				workOrderId: this.$route.params.id
			});
			this.Axios(
				{
					url: "/api-workorder/offer/reckon",
					params: data,
					type: "post",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result.data.data);
						if (result.data.data) {
							this.tableData = result.data.data.offerDes;
							this.form.setFieldsValue({
								title:
									result.data.data.title != undefined &&
									result.data.data.title != null &&
									result.data.data.title != ""
										? result.data.data.title
										: this.userMsg.enterpriseName + "报价单",
								inquiry: result.data.data.inquiry,
								inquiryNo: result.data.data.inquiryNo,
								supplier: result.data.data.supplier,
								supplierNo: result.data.data.supplierNo,
								projectName: result.data.data.projectName,
								agreementNo: result.data.data.agreementNo,
								offerDate:
									result.data.data.offerDate != null &&
									result.data.data.offerDate != ""
										? moment(result.data.data.offerDate, "YYYY/MM/DD")
										: moment(this.NowDate, "YYYY/MM/DD"),

								remark: result.data.data.remark
							});
						}
						if (result.data.data.offerDesDTOS) {
							this.tableData = result.data.data.offerDesDTOS;
						}

						// this.tableData = result.data.data.offerDes;
						for (let i = 0; i < this.tableData.length; i++) {
							this.tableData[i].biaochuItem =
								this.tableData[i].biaochuItem != null
									? this.tableData[i].biaochuItem.split(",")
									: "";
							this.tableData[i].materialItem =
								this.tableData[i].materialItem != null
									? this.tableData[i].materialItem.split(",")
									: "";
							this.tableData[i].processItem =
								this.tableData[i].processItem != null
									? this.tableData[i].processItem.split(",")
									: "";
							this.tableData[i].processItem =
								this.tableData[i].processItem != null &&
								this.tableData[i].processItem != ""
									? this.tableData[i].processItem.map(item => {
											return item;
									  })
									: "";
							this.total +=
								this.tableData[i].realAddFee != "" &&
								this.tableData[i].realAddFee != null
									? this.tableData[i].realAddFee
									: 0;
						}
						this.total = this.total.toFixed(2);
					}
				},
				({ type, info }) => {}
			);
		},
		findOne() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					let newData = [...this.tableData];
					let data = {
						title: values.title,
						offerDate: this.offerDate,
						inquiry: values.inquiry,
						inquiryNo: values.inquiryNo,
						supplier: values.supplier,
						supplierNo: values.supplierNo,
						projectName: values.projectName,
						agreementNo: values.agreementNo,
						remark: values.remark,
						total: this.total,
						offerDes: newData.map(item => {
							console.log(item.biaochuItem);
							return {
								realAddFee: item.realAddFee,
								addFee: item.addFee,
								biaochuFee: item.biaochuFee,
								biaochuItem:
									item.biaochuItem != null && item.biaochuItem != ""
										? item.biaochuItem.join(",")
										: null,
								biaochuRealFee: item.biaochuRealFee,
								drawingNo: item.drawingNo,
								materialFee: item.materialFee,
								materialItem:
									item.materialItem != null && item.materialItem != ""
										? item.materialItem.join(",")
										: null,
								materialPrice: item.materialPrice,
								materialRealFee: item.materialRealFee,
								name: item.name,
								no: item.no,
								number: item.number,
								otherFee: item.otherFee,
								price: item.price,
								processFee: item.processFee,
								processItem:
									item.processItem != null && item.processItem != ""
										? item.processItem.join(",")
										: "",
								processRealFee: item.processRealFee,
								remark: item.remark,
								type: item.type,
								unitPrice: item.unitPrice,
								realUnitPrice: item.realUnitPrice
							};
						})
					};
					let arr = new Array();
					arr.push(data);
					sessionStorage.priview = JSON.stringify(arr);
					sessionStorage.priviewType = 2;
					window.open("/priview.html", "_blank");
				}
			});
			// this.Axios(
			// 	{
			// 		url: "/api-workorder/offer/findone",
			// 		params: { id: this.$route.params.id },
			// 		type: "get",
			// 		option: { enableMsg: false }
			// 	},
			// 	this
			// ).then(
			// 	result => {
			// 		if (result.data.code === 200) {
			// 			console.log(result);
			// 			sessionStorage.priview = JSON.stringify(result.data.data);
			// 			sessionStorage.priviewType = 2;
			// 			window.open("/priview.html", "_blank");
			// 		}
			// 	},
			// 	({ type, info }) => {}
			// );
		}
	},
	created() {
		setTimeout(() => {
			this.form.setFieldsValue({
				title: this.userMsg.enterpriseName + "报价单",
				offerDate: moment(this.NowDate, "YYYY/MM/DD")
			});
		}, 100);
		this.getById();
	}
};
</script>
<style lang="less">
.order_price {
	.ant-form-item-label {
		width: 120px;
	}
	.ant-form-item {
		margin-bottom: 16px;
	}
}
</style>