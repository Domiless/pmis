<template>
	<div class="historical_quote">
		<div style="line-height:50px;">
			<a-button @click="findById" :disabled="selectedRowKeys.length<1">
				<i class="iconfont" style="color:#1890ff;margin-right:8px;">&#xe60c;</i>预览
			</a-button>
		</div>
		<a-table
			rowKey="id"
			:columns="columns"
			:pagination="false"
			:rowSelection="{selectedRowKeys:selectedRowKeys,onChange: onSelectChange}"
			:dataSource="data"
		></a-table>
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
	</div>
</template>
<script>
import Vue from "vue";
import { Table, Pagination } from "ant-design-vue";
Vue.use(Pagination);
Vue.use(Table);
const columns = [
	{
		dataIndex: "offerNo",
		title: "报价单号",
		width: "10%",
		key: "offerNo"
	},
	{
		dataIndex: "address",
		key: "address",
		title: "项目名称",
		width: "10%"
	},
	{
		dataIndex: "inquiry",
		key: "inquiry",
		title: "询价方",
		width: "15%"
	},
	{
		dataIndex: "inquiryName",
		key: "inquiryName",
		title: "联系人",
		width: "10%"
	},
	{
		dataIndex: "inquiryPhone",
		key: "inquiryPhone",
		title: "联系电话",
		width: "10%"
	},
	{
		dataIndex: "validDate",
		key: "validDate",
		title: "报价有效期",
		width: "15"
	},
	{
		dataIndex: "remark",
		key: "remark",
		title: "备注",
		width: "10%"
	},
	{
		dataIndex: "baoName",
		key: "baoName",
		title: "报价人",
		width: "10%"
	},
	{
		dataIndex: "gmtCreate",
		key: "gmtCreate",
		title: "创建时间",
		width: "10%"
	}
];
export default {
	data() {
		return {
			columns,
			data: [],
			current: 1,
			pageSize: 10,
			total: 0,
			selectedRowKeys: []
		};
	},
	methods: {
		onSelectChange(selectedRowKeys, a) {
			console.log(selectedRowKeys, a);
			this.selectedRowKeys = selectedRowKeys;
			// this.selectedRows = a;
		},
		onShowSizeChange(current, pageSize) {
			this.pageSize = pageSize;
			this.current = 1;
			this.getList();
		},
		onChange(current, pageNumber) {
			console.log("Page: ", pageNumber);
			console.log("第几页: ", current);
			this.current = current;
			this.getList();
		},
		getList() {
			this.Axios(
				{
					url: "/api-workorder/offer/list",
					params: {
						page: this.current,
						size: this.pageSize
					},
					type: "get",
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
		findById() {
			this.Axios(
				{
					url: "/api-workorder/offer/findone",
					params: { id: this.selectedRowKeys.join(",") },
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						sessionStorage.priview = JSON.stringify(result.data.data);
						sessionStorage.priviewType = 2;
						window.open("/priview.html", "_blank");
					}
				},
				({ type, info }) => {}
			);
		}
	},
	created() {
		this.getList();
	}
};
</script>
<style lang="less">
.historical_quote {
}
</style>