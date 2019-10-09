<template>
	<div class="employee_hours">
		<a-row>
			员工：
			<a-input style="width:200px;margin-right:20px;" v-model="employeeName"></a-input>时间：
			<a-range-picker @change="getTime" format="YYYY/MM/DD" />
			<a-button @click="getList">查询</a-button>
			<permission-button
				permCode="workhours_lookup.workhour_daochu"
				banType="hide"
				@click="download"
			>导出</permission-button>
		</a-row>
		<a-row style="padding-top:10px;">
			<a-table :columns="columns" :pagination="false" :dataSource="data" rowKey="empNo">
				<template slot="operation" slot-scope="text, record, index">
					<div>
						<a href="javascript:" @click="showDetails(record)">查看明细</a>
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
		<a-modal
			title="员工工时明细"
			:footer="null"
			width="1000px"
			:visible="detailsVisible"
			@cancel="handleCancel()"
			:maskClosable="false"
		>
			<EmployeeHoursDetails :employeeId="employeeId" ref="workHoursDetails"></EmployeeHoursDetails>
		</a-modal>
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
import EmployeeHoursDetails from "./EmployeeHoursDetails";
const columns = [
	{
		dataIndex: "empNo",
		title: "员工编号",
		width: "15%",
		key: "empNo"
	},
	{
		dataIndex: "empName",
		title: "员工姓名",
		width: "10%",
		key: "empName"
	},
	{
		dataIndex: "workLoad",
		key: "workLoad",
		title: "总工时(H)",
		width: "25%"
	},
	{
		dataIndex: "operation",
		key: "operation",
		title: "操作",
		width: "10%",
		scopedSlots: { customRender: "operation" }
	}
];
export default {
	data() {
		return {
			detailsVisible: false,
			value: undefined,
			columns,
			data: [],
			current: 1,
			pageSize: 10,
			total: 0,
			employeeName: "",
			startTime: null,
			endTime: null,
			employeeId: null
		};
	},
	methods: {
		download() {
			let qs = require("qs");
			let value = qs.stringify({
				startTime: this.startTime != "" ? this.startTime : null,
				endTime: this.endTime != "" ? this.endTime : null
			});
			this.$axios
				.post(
					this.global.apiSrc + "/api-workorder/workLoadCounting/exportExcel",
					{
						startTime: this.startTime != "" ? this.startTime : null,
						endTime: this.endTime != "" ? this.endTime : null
					},
					{
						responseType: "blob", // 设置响应数据类型
						headers: { "Content-Type": "application/json" }
					}
				)
				.then(res => {
					if (res.status == 200) {
						console.log(res);
						var blob = new Blob([res.data], {
							type:
								"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
						});
						var downloadElement = document.createElement("a");
						var href = window.URL.createObjectURL(blob); //创建下载的链接
						downloadElement.href = href;
						let fileName;
						console.log(this.startTime, this.endTime);
						if (
							this.startTime != "" &&
							this.startTime != null &&
							this.endTime != "" &&
							this.endTime != null
						) {
							fileName =
								this.startTime.replace(/\//g, "") +
								"~" +
								this.endTime.replace(/\//g, "");
						} else if (
							(this.startTime == "" || this.startTime == null) &&
							(this.endTime != "" && this.endTime != null)
						) {
							fileName = this.endTime.replace(/\//g, "") + "之前所有";
						} else if (
							this.startTime != "" &&
							this.startTime != null &&
							(this.endTime == "" || this.endTime == null)
						) {
							fileName = this.startTime.replace(/\//g, "") + "至今所有";
						} else if (
							(this.startTime == "" || this.startTime == null) &&
							(this.endTime == "" || this.endTime == null)
						) {
							fileName = "所有";
						}
						downloadElement.download = fileName + "工时统计.xlsx"; //下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); //点击下载
						document.body.removeChild(downloadElement); //下载完成移除元素
						window.URL.revokeObjectURL(href); //释放掉blob对象
					}
				});
		},
		getTime(a, b) {
			console.log(b);
			this.startTime = b[0];
			this.endTime = b[1];
		},
		showDetails(row) {
			console.log(row);
			this.employeeId = row;
			this.detailsVisible = true;
		},
		handleCancel() {
			this.detailsVisible = false;
			this.employeeId = null;
			this.$refs.workHoursDetails.current = 1;
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
					url: "/api-workorder/workLoadCounting/employeeWorkLoad",
					params: {
						page: this.current,
						size: this.pageSize,
						employeeName: this.employeeName,
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
		}
	},
	components: {
		EmployeeHoursDetails
	},
	created() {
		this.getList();
	}
};
</script>