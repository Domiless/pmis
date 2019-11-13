<template>
	<div class="declaration_list">
		<a-row style="line-height:50px;">
			<permission-button permCode banType="hide" :disabled="selectedRowKeys.length<1">新增</permission-button>
			<permission-button permCode banType="hide">提交审批</permission-button>
		</a-row>
		<a-row style="margin-bottom: 10px;">
			<a-col :span="24">
				<span>日期 :</span>
				<a-range-picker style="width:240px" @change="onChangeRange" format="YYYY/MM/DD"></a-range-picker>
				<span>关键词 :</span>
				<a-input
					placeholder="项目订单编号/设计单号/部件名称/图号/设计负责人"
					style="width: 350px"
					v-model="keyWords"
					@keyup.enter.native="getList"
				></a-input>
				<a-button @click="getList">搜索</a-button>
			</a-col>
		</a-row>
		<a-row>
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
		</a-row>
	</div>
</template>
<script>
const columns = [
	{
		title: "报审单编号",
		key: "no",
		dataIndex: "no",
		width: "14%"
	},
	{
		title: "标题",
		key: "daringNo",
		dataIndex: "daringNo",
		width: "20%"
	},
	{
		title: "拟制",
		key: "name",
		dataIndex: "name",
		width: "8%"
	},
	{
		title: "填报日期",
		key: "number",
		dataIndex: "number",
		width: "12%"
	},
	{
		title: "审批状态",
		key: "brand",
		dataIndex: "brand",
		width: "10%"
	},
	{
		title: "备注",
		key: "stylist ",
		dataIndex: "stylist ",
		width: 200,
		scopedSlots: { customRender: "operation" }
	}
];
export default {
	data() {
		return {
			columns,
			data: [],
			total: 0,
			current: 1,
			selectedRowKeys: [],
			keyWords: ""
		};
	},
	methods: {
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
		onSelectChange(a, b) {
			this.selectedRowKeys = a;
		},
		onChangeRange(date, datestring) {
			console.log(datestring);
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
		}
	},
	created() {}
};
</script>
<style lang="less">
.declaration_list {
	overflow: hidden;
	padding: 0 20px;
}
</style>