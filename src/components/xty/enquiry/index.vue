<template>
	<div class="enquiry_list">
		<a-row style="line-height:50px;">
			<permission-button
				v-if="activeKey==1"
				permCode
				banType="hide"
				:disabled="selectedRowKeys.length<1"
				@click="add(selectedRowKeys)"
			>批量询价</permission-button>
			<permission-button
				v-if="activeKey==2"
				permCode
				banType="hide"
				:disabled="selectedRowKeys1.length<1"
				@click="eidt(selectedRowKeys1)"
			>批量修改</permission-button>
		</a-row>
		<a-row style="margin-bottom: 10px;">
			<a-col :span="24">
				<span>日期 :</span>
				<a-range-picker style="width:240px" @change="onChangeRange" format="YYYY/MM/DD"></a-range-picker>
				<span>关键词 :</span>
				<a-input
					:placeholder="activeKey==1?'项目订单编号/图号/需求名称/设计师/任务指派人':'项目订单编号/图号/需求名称/供应商名称'"
					style="width: 350px"
					v-model="keyWords"
					@keyup.enter.native="getList"
				></a-input>
				<a-button @click="getList">搜索</a-button>
			</a-col>
		</a-row>
		<a-row>
			<a-tabs :activeKey="activeKey" @change="callback">
				<a-tab-pane tab="待询价" key="1">
					<a-table
						rowKey="id"
						:columns="columns"
						:dataSource="data"
						:pagination="false"
						:rowSelection="{selectedRowKeys:selectedRowKeys,onChange: onSelectChange}"
					>
						<template slot="operation" slot-scope="text, record, index">
							<div>
								<a-button class="button_text" @click="add(record.id)">询价</a-button>
							</div>
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
				</a-tab-pane>
				<a-tab-pane tab="已询价" key="2" forceRender>
					<a-table
						:scroll="{ x: 2270}"
						rowKey="id"
						:columns="columns1"
						:dataSource="data1"
						:pagination="false"
						:rowSelection="{selectedRowKeys:selectedRowKeys1,onChange: onSelectChange1}"
					>
						<a-button
							slot="operation"
							slot-scope="text, record, index"
							class="button_text"
							@click="eidt(record.id)"
						>修改</a-button>
					</a-table>
					<a-pagination
						style="padding-top:12px;text-align: right;"
						showQuickJumper
						:defaultCurrent="current1"
						:total="total1"
						@change="onChange1"
						showSizeChanger
						:pageSizeOptions="['10','20','30']"
						@showSizeChange="onShowSizeChange1"
						:showTotal="total => `共 ${total} 条`"
					/>
				</a-tab-pane>
			</a-tabs>
		</a-row>
		<a-modal
			title="询价"
			:footer="null"
			width="1200px"
			:visible="addVisible"
			@cancel="handleCancel(1)"
			:maskClosable="false"
		>
			<add v-on:addModal="addModal" ref="addEnquiry"></add>
		</a-modal>
		<a-modal
			title="询价修改"
			:footer="null"
			width="1200px"
			:visible="editVisible"
			@cancel="handleCancel(2)"
			:maskClosable="false"
		>
			<add v-on:addModal="addModal"></add>
		</a-modal>
	</div>
</template>
<script>
import add from "./add";
const columns = [
	{
		title: "项目订单编号",
		key: "no",
		dataIndex: "no",
		width: "12%"
	},
	{
		title: "图号",
		key: "daringNo",
		dataIndex: "daringNo",
		width: "15%"
	},
	{
		title: "需求名称",
		key: "name",
		dataIndex: "name",
		width: "15%"
	},
	{
		title: "需求数量",
		key: "number",
		dataIndex: "number",
		width: "8%"
	},
	{
		title: "指定品牌",
		key: "brand",
		dataIndex: "brand",
		width: "10%"
	},
	{
		title: "设计师",
		key: "stylist ",
		dataIndex: "stylist ",
		width: "8%"
	},
	{
		title: "任务指派人",
		key: "person",
		dataIndex: "person",
		width: "8%"
	},
	{
		title: "任务指派时间",
		key: "time",
		dataIndex: "time",
		width: "11%"
	},
	{
		title: "操作",
		key: "operation",
		dataIndex: "operation",
		width: "8%",
		scopedSlots: { customRender: "operation" }
	}
];
const columns1 = [
	{
		title: "项目订单编号",
		key: "no",
		dataIndex: "no",
		width: 150,
		fixed: "left"
	},
	{
		title: "图号",
		key: "daringNo",
		dataIndex: "daringNo",
		width: 150,
		fixed: "left"
	},
	{
		title: "名称",
		key: "name",
		dataIndex: "name",
		width: 150,
		fixed: "left"
	},
	{
		title: "需求数量",
		key: "number",
		dataIndex: "number",
		width: 80
	},
	{
		title: "指定品牌",
		key: "brand",
		dataIndex: "brand",
		width: 110
	},
	{
		title: "设计师",
		key: "stylist ",
		dataIndex: "stylist ",
		width: 80
	},
	{
		title: "采购名称",
		key: "person",
		dataIndex: "person",
		width: 120
	},
	{
		title: "订单数量",
		key: "time",
		dataIndex: "time",
		width: 80
	},
	{
		title: "订单单位",
		key: "dingdandanwei",
		dataIndex: "dingdandanwei",
		width: 80
	},
	{
		title: "交货日期",
		key: "jiaohuoriqi",
		dataIndex: "jiaohuoriqi",
		width: 100
	},
	{
		title: "第1供应商",
		key: "diyigongyingshang",
		dataIndex: "diyigongyingshang",
		width: 120
	},
	{
		title: "第1报价(元)",
		key: "diyibaojia",
		dataIndex: "diyibaojia",
		width: 90
	},
	{
		title: "第2供应商",
		key: "diergongyingshang",
		dataIndex: "diyigongyingshang",
		width: 120
	},
	{
		title: "第2报价(元)",
		key: "dierbaojia",
		dataIndex: "diyibaojia",
		width: 90
	},
	{
		title: "第3供应商",
		key: "disangongyingshang",
		dataIndex: "diyigongyingshang",
		width: 120
	},
	{
		title: "第3报价(元)",
		key: "disanbaojia",
		dataIndex: "diyibaojia",
		width: 90
	},
	{
		title: "价格单位",
		key: "jiagedanwei",
		dataIndex: "jiagedanwei",
		width: 80
	},
	{
		title: "货币类型",
		key: "type",
		dataIndex: "type",
		width: 80
	},
	{
		title: "备注",
		key: "beizhu",
		dataIndex: "beizhu",
		width: 140
	},
	{
		title: "小计",
		key: "xiaoji",
		dataIndex: "xiaoji",
		width: 80
	},
	{
		title: "操作",
		key: "operation",
		width: 80,
		scopedSlots: { customRender: "operation" },
		fixed: "right"
	}
];
export default {
	data() {
		return {
			editVisible: false,
			addVisible: false,
			activeKey: "1",
			columns,
			total: 0,
			current: 1,
			data: [
				{
					name: 111,
					id: 1
				}
			],
			columns1,
			total1: 0,
			current1: 1,
			data1: [
				{
					name: 111,
					id: 1
				}
			],
			keyWords: "",
			start: "",
			end: "",
			selectedRowKeys: [],
			selectedRowKeys1: []
		};
	},
	methods: {
		addModal() {
			this.addVisible = false;
		},
		handleCancel(a) {
			if (a == 1) {
				this.$refs.addEnquiry.quxiao();
				// this.addVisible = false;
			}
			if (a == 2) {
				this.editVisible = false;
			}
		},
		callback(key) {
			this.activeKey = key;
			console.log(this.activeKey);
		},
		onSelectChange(a, b) {
			this.selectedRowKeys = a;
		},
		onSelectChange1(a, b) {
			this.selectedRowKeys1 = a;
		},
		onChangeRange(date, datestring) {
			console.log(datestring);
		},
		onChange(current, pageNumber) {
			console.log("Page: ", pageNumber);
			console.log("第几页: ", current);
			this.current = current;
			this.getList();
		},
		onShowSizeChange(current, pageSize) {
			this.pageSize = pageSize;
			this.current = 1;
			this.getList();
		},
		onChange1(current, pageNumber) {
			console.log("Page: ", pageNumber);
			console.log("第几页: ", current);
			this.current = current;
			this.getList();
		},
		onShowSizeChange1(current, pageSize) {
			this.pageSize = pageSize;
			this.current = 1;
			this.getList();
		},
		getList() {
			this.Axios(
				{
					url: "/api-order/purchase/list",
					type: "get",
					params: {
						page: this.current,
						size: this.pageSize,
						auditState: this.reviewSchedule != -1 ? this.reviewSchedule : null,
						keyword: this.keyWords,
						start: this.dateValue[0] != "" ? this.dateValue[0] : null,
						end: this.dateValue[1] != "" ? this.dateValue[1] : null
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
					}
				},
				({ type, info }) => {}
			);
		},
		add(key) {
			this.addVisible = true;
		},
		eidt(key) {
			console.log(key);
			this.editVisible = true;
		}
	},
	created() {},
	components: {
		add
	}
};
</script>
<style lang="less">
.enquiry_list {
	overflow: hidden;
	padding: 0 20px;
}
</style>