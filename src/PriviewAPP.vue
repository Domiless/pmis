<template>
	<div class="case">
		<div v-if="priviewType==1">
			<div class="content_case" v-for="(item,index) in Msg" :key="index">
				<div>
					<table class="table_style">
						<tr>
							<td colspan="2" style="width:20%">工作令号</td>
							<td style="width:15%">计划编号</td>
							<td style="width:15%">计划数量</td>
							<td rowspan="2" style="width:20%">
								<h3>加工工艺过程卡片</h3>
							</td>
							<td colspan="3" style="width:30%">
								<tr style="display: block;overflow: hidden;">
									<td class="td_style" style="border-left:none;">名称</td>
									<td class="td_style" style="border-left:1px solid #000000;">图号</td>
								</tr>
							</td>
							<!-- <td colspan="2" style="width:20%">图号</td> -->
						</tr>
						<tr>
							<td colspan="2" style="width:20%">{{item.drawingDO.workOrder.gongzuolingNo}}</td>
							<td style="width:15%">{{item.workOrderDesDO.planCode}}</td>
							<td style="width:15%">{{item.workOrderDesDO.amount}}</td>
							<td colspan="3" style="width:30%">
								<tr style="display: block;overflow: hidden;">
									<td class="td_style" style="border-left:none;">{{item.workOrderDesDO.name}}</td>
									<td
										class="td_style"
										style="border-left:1px solid #000000;"
									>{{item.workOrderDesDO.drawingNo}}</td>
								</tr>
							</td>
							<!-- <td colspan="2" style="width:20%">{{item.workOrderDesDO.drawingNo}}</td> -->
						</tr>
						<tr>
							<td colspan="2" style="width:20%">材料名称、牌号</td>
							<td colspan="2" style="width:30%">毛坯外形尺寸</td>
							<td style="width:20%">毛坯数量</td>
							<td colspan="3" style="width:30%">
								<tr style="display: block;overflow: hidden;">
									<td class="td_style" style="border-left:none;">单件零件重量</td>
									<td class="td_style" style="border-left:1px solid #000000;">单件表面积</td>
								</tr>
							</td>
						</tr>
						<tr>
							<td
								colspan="2"
								style="width:20%"
							>{{(item.drawingDO.rawMaterialDO.type==1?"板料":item.drawingDO.rawMaterialDO.type==2?"棒料":"型材")+' '+item.drawingDO.rawMaterialDO.name}}</td>
							<td colspan="2" style="width:30%">{{item.dimensions}}</td>
							<td
								style="width:20%"
							>{{Math.ceil(item.workOrderDesDO.amount/item.drawingDO.inTheEmbryoComponents)}}</td>
							<td colspan="3" style="width:30%">
								<tr style="display: block;overflow: hidden;">
									<td class="td_style" style="border-left:none;">{{item.weightAndArea.weight}}</td>
									<td
										class="td_style"
										style="border-left:1px solid #000000;"
									>{{item.weightAndArea.surfaceArea}}</td>
								</tr>
							</td>
						</tr>
						<tr>
							<td style="width:10%">序号</td>
							<td style="width:10%">工序</td>
							<td colspan="3" style="width:50%">工序内容</td>
							<td style="width:10%">合格数</td>
							<td style="width:10%">加工者</td>
							<td style="width:10%">检验</td>
						</tr>
						<tr v-for="(i,j) in item.drawingDO.process" :key="j+111">
							<td style="width:10%;height:42px;">{{j+1}}</td>
							<td style="width:10%;height:42px;">{{i.workTypeName}}</td>
							<td colspan="3" style="width:50%;height:42px;text-align:left;">{{i.processInfo}}</td>
							<!-- <td style="width:10%;height:42px;"></td> -->
							<td style="width:10%;height:42px;">{{i.checkResultDO!=null?i.checkResultDO.result:""}}</td>
							<td
								style="width:10%;height:42px;"
							>{{i.executives.length>0?i.executives.find(item=>{return item.isExecution==true}).employeeName:""}}</td>
							<td style="width:10%;height:42px;"></td>
						</tr>
						<tr
							v-for="(z,k) in 12-(item.drawingDO.process.length!=0?item.drawingDO.process.length:0)"
							:key="k+22222"
						>
							<td style="width:10%;height:42px;">{{z+item.drawingDO.process.length}}</td>
							<td style="width:10%;height:42px;"></td>
							<td colspan="3" style="width:40%"></td>
							<!-- <td style="width:10%;height:42px;"></td> -->
							<td style="width:10%;height:42px;"></td>
							<td style="width:10%;height:42px;"></td>
							<td style="width:10%;height:42px;"></td>
						</tr>
					</table>
					<div style="margin-top:20px;">
						<a-col :span="5">
							<div>
								<img :src="item.qrCode" alt style="width:120px;" />
							</div>
						</a-col>
						<a-col :span="12" style="line-height:24px;">
							<p>
								<span class="label_style">关联工单：</span>
								<span>{{item.workOrderDesDO.workOrder.no}}</span>
							</p>
							<p>
								<span class="label_style">单位名称：</span>
								<span>{{enterpriseName}}</span>
							</p>
						</a-col>
						<a-col :span="7">
							<p>
								<span class="label_style">拟制：</span>
								<span>{{userNmae}}</span>
							</p>
							<p>
								<span class="label_style">审核：</span>
								<span></span>
							</p>
						</a-col>
					</div>
				</div>
			</div>
		</div>
		<div v-if="priviewType==2">
			<div class="content_case" v-for="(item,index) in priceMsg" :key="index+66666">
				<div style="text-align:center;">
					<h2>{{item.title}}</h2>
				</div>
				<a-col :span="24">
					<a-col :span="12">
						<span class="label_style">需方：</span>
						<span>{{item.inquiry}}</span>
					</a-col>
					<a-col :span="12">
						<span class="label_style">需方订单号：</span>
						<span>{{item.inquiryNo}}</span>
					</a-col>
					<a-col :span="12">
						<span class="label_style">供方：</span>
						<span>{{item.supplier}}</span>
					</a-col>
					<a-col :span="12">
						<span class="label_style">供方订单号：</span>
						<span>{{item.supplierNo}}</span>
					</a-col>
					<a-col :span="12">
						<span class="label_style">项目名称：</span>
						<span>{{item.projectName}}</span>
					</a-col>
					<a-col :span="12">
						<span class="label_style">协议编号：</span>
						<span>{{item.agreementNo}}</span>
					</a-col>
					<a-col :span="24">
						<span class="label_style">签订时间：</span>
						<span>{{item.offerDate}}</span>
					</a-col>
					<!-- <table class="table_style1">
						<tr>
							<td style="width:15%">询价方</td>
							<td style="width:35%">{{item.inquiry}}</td>
							<td style="width:15%">联系人</td>
							<td style="width:35%">{{item.inquiryName}}</td>
						</tr>
						<tr>
							<td style="width:15%">联系电话</td>
							<td style="width:35%">{{item.inquiryPhone}}</td>
							<td style="width:15%">电子邮箱</td>
							<td style="width:35%">{{item.inquiryMail}}</td>
						</tr>
						<tr>
							<td style="width:15%">详情地址</td>
							<td colspan="3">{{item.address}}</td>
						</tr>
					</table>-->
				</a-col>
				<a-col :span="24" style="margin:24px 0 12px;">需求方购买产品如下：</a-col>
				<a-col :span="24">
					<table class="table_style">
						<tr style="background-color:#f1f1f1;color:#333333 ;font-weight:normal;">
							<td style="width:5%">序号</td>
							<td style="width:15%">图号</td>
							<td style="width:15%">名称</td>
							<td style="width:5%">单位</td>
							<td style="width:10%">数量</td>
							<td style="width:10%">单价(不含税：元)</td>
							<td style="width:10%">总价(不含税：元)</td>

							<td style="width:10%">备注</td>
						</tr>
						<tr v-for="(i,index) in item.offerDes" :key="index+555555">
							<td style="width:5%">{{index+1}}</td>
							<td style="width:15%">{{i.drawingNo}}</td>
							<td style="width:15%">{{i.name}}</td>
							<td style="width:5%"></td>
							<td style="width:10%">{{i.number}}</td>
							<td style="width:10%">{{i.realUnitPrice}}</td>
							<td style="width:10%">{{i.realAddFee}}</td>

							<td style="width:10%">{{i.remark}}</td>
						</tr>
					</table>
					<div style="line-height:32px;">
						<span style="text-align:right;width:100px;display:inline-block;">合计(不含税)：</span>
						<span style="font-size:18px;color:red;padding-right:12px;">{{item.total}}</span>
						<p>
							<span style="text-align:right;width:100px;display:inline-block;">大写(不含税)：</span>
							<span style="font-size:18px;color:red;padding-right:12px;">{{number_chinese(item.total)}}</span>
						</p>
					</div>
					<div style="padding:0 0 12px;overflow:hidden;">
						<a-col :span="12" style="text-align:center">
							<span>供方：</span>
							<span
								style="display:inline-block;width:200px;border-bottom:1px solid #000000;height:24px;vertical-align: top;"
							></span>
						</a-col>
						<a-col :span="12">
							<span>需方：</span>
							<span
								style="display:inline-block;width:200px;border-bottom:1px solid #000000;height:24px;vertical-align: top;"
							></span>
						</a-col>
					</div>
				</a-col>
				<a-col :span="24">
					<span style>注：</span>
					<span style="display:inline-block;vertical-align: top;width:97%;">
						<pre>{{item.remark}}</pre>
					</span>
				</a-col>
				<!-- <a-col :span="24" style="border:1px solid #dde2eb;padding:4px 0;border-top:none;">
					<a-col :span="12">
						<span class="left_label">报价人：</span>
						<span class="right_content">{{item.baoName}}</span>
					</a-col>
					<a-col :span="12">
						<span class="left_label">审核人：</span>
						<span class="right_content">{{item.audit}}</span>
					</a-col>
					<a-col :span="12">
						<span class="left_label">报价人电话：</span>
						<span class="right_content">{{item.baoPhone}}</span>
					</a-col>
					<a-col :span="12">
						<span class="left_label">报价日期：</span>
						<span class="right_content">{{item.offerDate}}</span>
					</a-col>
					<a-col :span="12">
						<span class="left_label">报价人邮箱：</span>
						<span class="right_content">{{item.baoMail}}</span>
					</a-col>
					<a-col :span="12">
						<span class="left_label">报价有效期：</span>
						<span class="right_content">{{item.validDate}}</span>
					</a-col>
				</a-col>-->
			</div>
		</div>
		<div v-if="priviewType==3">
			<div class="content_case">
				<div style="text-align:center;">
					<h2>{{new Date().getFullYear()+'年'}}{{enterpriseName}}外购物资需求表</h2>
				</div>
				<div>
					<a-col :span="24">
						<a-col :span="8">
							<span class="label_style">申请部门：</span>
							<span>{{demand.workOrder.department}}</span>
						</a-col>
						<a-col :span="8">
							<span class="label_style">需求编号：</span>
							<span>{{demand.workOrder.no}}</span>
						</a-col>
						<a-col :span="8">
							<span class="label_style">申请人：</span>
							<span>{{demand.workOrder.demander}}</span>
						</a-col>
						<a-col :span="8">
							<span class="label_style">项目订单号：</span>
							<span>{{demand.workOrder.order}}</span>
						</a-col>
						<a-col :span="8">
							<span class="label_style">项目名称：</span>
							<span>{{demand.workOrder.project}}</span>
						</a-col>
						<a-col :span="8">
							<span class="label_style">申请日期：</span>
							<span>{{demand.workOrder.filing}}</span>
						</a-col>
					</a-col>
				</div>
				<a-col :span="24" style="margin-top:20px;">
					<table class="table_style">
						<tr style="background-color:#f1f1f1;color:#333333 ;font-weight:normal;">
							<th style="width:3%">序号</th>
							<th style="width:8%">物料代码</th>
							<th style="width:10%">材料规格</th>
							<th style="width:8%">所需物资</th>
							<th style="width:4%">计量单位</th>
							<th style="width:4%">需求重量</th>
							<th style="width:4%">需求数量</th>
							<th style="width:10%">推荐厂家</th>
							<th style="width:10%">指定厂家</th>
							<th style="width:10%">需求时间</th>
							<th style="width:10%">需求方式</th>
							<th style="width:10%">备注</th>
						</tr>
						<tr v-for="(item,i) in demand.rawInfo" :key="i+8888">
							<td style="width:3%">{{i+1}}</td>
							<td style="width:8%">{{item.materialCode}}</td>
							<td style="width:10%">{{item.rawInfoStr}}</td>
							<td style="width:8%">{{item.materials}}</td>
							<td style="width:4%">{{item.units}}</td>
							<td style="width:4%">{{item.weight}}</td>
							<td style="width:4%">{{item.number}}</td>
							<td style="width:10%">{{item.recommend}}</td>
							<td style="width:10%">{{item.manufacturers}}</td>
							<td style="width:10%">{{item.time}}</td>
							<td style="width:10%">{{item.way}}</td>
							<td style="width:10%">{{item.remark}}</td>
						</tr>
					</table>
				</a-col>
				<!-- <div style="line-height:60px;padding-right:12px;">
					<a-col :span="6">部门主管：</a-col>
					<a-col :span="6">库管员：</a-col>
					<a-col :span="6">项目审核：</a-col>
					<a-col :span="6">项目经办：</a-col>
				</div>-->
			</div>
		</div>
	</div>
</template>
<script>
import Vue from "vue";
import { Table, Col, Row, Form, Input, Icon } from "ant-design-vue";
Vue.use(Table);
Vue.use(Col);
Vue.use(Row);
Vue.use(Form);
Vue.use(Input);
Vue.use(Icon);
export default {
	data() {
		return {
			Msg: [
				{
					drawingDO: {
						rawMaterialDO: { type: 2 }
					}
				}
			],
			NowDate: new Date().toLocaleString("chinese", { hour12: false }),
			priviewType: null,
			priceMsg: [],
			demand: [],
			enterpriseName: JSON.parse(sessionStorage.getItem("user")).enterpriseName,
			userNmae: JSON.parse(sessionStorage.getItem("user")).userName
		};
	},
	methods: {
		number_chinese(str) {
			var num = parseFloat(str);
			var strOutput = "",
				strUnit = "仟佰拾亿仟佰拾万仟佰拾元角分";
			num += "00";
			var intPos = num.indexOf(".");
			if (intPos >= 0) {
				num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
			}
			strUnit = strUnit.substr(strUnit.length - num.length);
			for (var i = 0; i < num.length; i++) {
				strOutput +=
					"零壹贰叁肆伍陆柒捌玖".substr(num.substr(i, 1), 1) +
					strUnit.substr(i, 1);
			}
			return strOutput
				.replace(/零角零分$/, "整")
				.replace(/零[仟佰拾]/g, "零")
				.replace(/零{2,}/g, "零")
				.replace(/零([亿|万])/g, "$1")
				.replace(/零+元/, "元")
				.replace(/亿零{0,3}万/, "亿")
				.replace(/^元/, "零元");
		}
	},
	created() {
		console.log(JSON.parse(sessionStorage.getItem("user")).userName);
		this.priviewType = sessionStorage.getItem("priviewType");
		// this.priviewType = 3;
		if (this.priviewType == 1) {
			this.Msg = JSON.parse(sessionStorage.getItem("priview"));
			console.log(this.Msg);
		}
		if (this.priviewType == 2) {
			this.priceMsg = JSON.parse(sessionStorage.getItem("priview"));
			console.log(this.priceMsg);
		}
		if (this.priviewType == 3) {
			this.demand = JSON.parse(sessionStorage.getItem("priview"));
			console.log(this.demand);
		}
	}
};
</script>
<style lang="less">
.case {
	font-size: 14px;
	color: #333333;
	background-color: #f0f2f5;
	padding: 8px;
	.content_case {
		background-color: white;
		padding: 10px;
		overflow: hidden;
		margin-bottom: 10px;
		page-break-after: always;
		.label_style {
			display: inline-block;
			width: 100px;
			text-align: right;
		}
		.ant-col-12 {
			// margin-bottom: 20px;
		}
		.table_style {
			width: 100%;
			border: 1px solid #000000;
			border-collapse: collapse;
			tr {
				width: 100%;
				th {
					text-align: center;
					border: 1px solid #000000;
					line-height: 28px;
				}
				td {
					text-align: center;
					border: 1px solid #000000;
					line-height: 28px;
				}
			}
		}
		.table_style1 {
			width: 100%;
			border: 1px solid #000000;
			border-collapse: collapse;
			tr {
				width: 100%;
				td {
					text-align: left;
					border: 1px solid #000000;
					line-height: 50px;
					padding: 0 8px;
				}
			}
		}
		.left_label {
			display: inline-block;
			width: 35%;
			text-align: right;
		}
		.right_content {
			display: inline-block;
			width: 60%;
		}
	}
	.td_style {
		// display: inline-block;
		border-right: none !important;
		border-top: none !important;
		border-bottom: none !important;
		word-break: break-all;
		width: 49%;
		margin-bottom: -1000px;
		padding-bottom: 1000px;
		float: left;
	}
}
pre {
	white-space: pre-wrap; /* css3.0 */
	white-space: -moz-pre-wrap; /* Firefox */
	white-space: -pre-wrap; /* Opera 4-6 */
	white-space: -o-pre-wrap; /* Opera 7 */
	word-wrap: break-word; /* Internet Explorer 5.5+ */
}
</style>
