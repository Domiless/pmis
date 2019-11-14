<template>
	<div class="declaration_list">
		<a-row style="line-height:50px;">
			<permission-button permCode banType="hide" @click="addVisible=true">
				<a-icon style="color:#1890ff;" type="plus" />新增
			</permission-button>
			<permission-button permCode banType="hide" :disabled="selectedRowKeys.length!=1">
				<a-icon style="color:#1890ff;" type="edit" />修改
			</permission-button>
			<permission-button permCode banType="hide" :disabled="selectedRowKeys.length<1">提交审批</permission-button>
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
				<template slot="titleName" slot-scope="text, record, index">
					<a href="javascript:">{{text}}</a>
				</template>
				<template slot="remark" slot-scope="text, record, index">
					<div class="content_style" style="max-width:200px;">{{text}}</div>
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
			title="新增"
			:footer="null"
			width="1200px"
			:visible="addVisible"
			@cancel="handleCancel(1)"
			:maskClosable="false"
		>
			<add v-on:addModal="addModal" ref="addEnquiry"></add>
		</a-modal>
		<a-modal
			title="修改"
			:footer="null"
			width="1200px"
			:visible="editVisible"
			@cancel="handleCancel(2)"
			:maskClosable="false"
		>
			<add v-on:addModal="addModal"></add>
		</a-modal>
		<a-modal
			title="详情"
			:footer="null"
			width="1200px"
			:visible="detailsVisible"
			@cancel="handleCancel(3)"
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
		title: "报审单编号",
		key: "no",
		dataIndex: "no",
		width: "18%"
	},
	{
		title: "标题",
		key: "title",
		dataIndex: "title",
		width: "30%",
		scopedSlots: { customRender: "titleName" }
	},
	{
		title: "拟制",
		key: "name",
		dataIndex: "name",
		width: "8%"
	},
	{
		title: "填报日期",
		key: "time",
		dataIndex: "number",
		width: "13%"
	},
	{
		title: "审批状态",
		key: "state",
		dataIndex: "state",
		width: "10%"
	},
	{
		title: "备注",
		key: "remark",
		dataIndex: "remark ",
		width: "16%",
		scopedSlots: { customRender: "remark" }
	}
];
export default {
	data() {
		return {
			addVisible: false,
			editVisible: false,
			detailsVisible: false,
			columns,
			data: [{ no: 111, title: 222 }],
			total: 0,
			current: 1,
			selectedRowKeys: [],
			keyWords: ""
		};
	},
	methods: {
		addModal() {
			this.addVisible = false;
		},
		handleCancel(a) {
			if (a == 1) {
				this.addVisible = false;
			}
			if (a == 2) {
			}
			if (a == 3) {
			}
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
	created() {},
	components: {
		add
	}
};
</script>
<style lang="less">
.declaration_list {
	overflow: hidden;
	padding: 0 20px;
}
</style>