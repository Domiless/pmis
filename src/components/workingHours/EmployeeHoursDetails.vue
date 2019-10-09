<template>
	<div class="employee_hours_details">
		<a-row>
			员工：
			<a-input
				style="width:200px;margin-right:20px;"
				:value="employeeId!=null?employeeId.empName:''"
				disabled
			></a-input>时间：
			<a-range-picker @change="getTime" format="YYYY/MM/DD" />
			<a-button @click="getList">查询</a-button>
		</a-row>
		<a-row style="padding-top:10px;">
			<a-table :columns="columns" :pagination="false" :dataSource="data" rowKey="gmtCreated">
				<template slot="operation" slot-scope="text, record, index">
					<div>
						<a href="javascript:">查看明细</a>
					</div>
				</template>
			</a-table>
			<a-pagination
				style="padding-top:12px;text-align: right;"
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
import Vue from "vue";
import {
	Table,
	Row,
	Modal,
	Pagination,
	Input,
	DatePicker
} from "ant-design-vue";
Vue.use(Pagination);
Vue.use(Table);
Vue.use(Row);
Vue.use(Modal);
Vue.use(Input);
Vue.use(DatePicker);
const columns = [
	{
		dataIndex: "empNo",
		title: "员工编号",
		width: "10%",
		key: "empNo"
	},
	{
		dataIndex: "empName",
		title: "员工姓名",
		width: "10%",
		key: "empName"
	},
	{
		dataIndex: "title",
		key: "title",
		title: "工单标题",
		width: "10%"
	},
	{
		dataIndex: "name",
		key: "name",
		title: "名称",
		width: "10%"
	},
	{
		dataIndex: "process",
		key: "process",
		title: "工序",
		width: "10%"
	},
	{
		dataIndex: "workLoad",
		key: "workLoad",
		title: "工时",
		width: "10%"
	},
	{
		dataIndex: "gmtCreated",
		key: "gmtCreated",
		title: "时间",
		width: "15%"
	}
];
export default {
	props: {
		employeeId: {
			default: null
		}
	},
	data() {
		return {
			value: undefined,
			columns,
			data: [],
			current: 1,
			pageSize: 10,
			total: 0,
			startTime: null,
			endTime: null
		};
	},
	methods: {
		getTime(a, b) {
			console.log(b);
			this.startTime = b[0];
			this.endTime = b[1];
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
					url: "/api-workorder/workLoadCounting/employeeDetail",
					params: {
						page: this.current,
						size: this.pageSize,
						employeeId: this.employeeId.empId,
						startTime: this.startTime != "" ? this.startTime : null,
						endTime: this.endTime != "" ? this.endTime : null
					},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.data = result.data.data.data;
						this.total = result.data.data.totalElement;
					}
				},
				({ type, info }) => {}
			);
		}
	},
	watch: {
		value(value) {
			console.log(value);
		},
		employeeId() {
			if (this.employeeId != null) {
				this.getList();
			}
		}
	},
	created() {
		this.getList();
	}
};
</script>