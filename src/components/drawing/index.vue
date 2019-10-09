<template>
	<div class="drawing_list">
		<router-view></router-view>
		<div :class="[{hide:isHideList}]">
			<a-row>
				<a-col :span="24" style="padding:0 20px;">
					<a-row>
						<div style="line-height:50px;">
							<a-col :span="8">
								<permission-button
									permCode="drawing_drawing_lookup.drawing_drawing_add"
									banType="hide"
									@click="addVisible=true"
								>
									<a-icon style="color:#1890ff;" type="plus" />新增
								</permission-button>
								<permission-button
									permCode="drawing_drawing_lookup.drawing_drawing_update"
									banType="hide"
									@click="showEdit"
									:disabled="selectedRowKeys.length!=1"
								>
									<a-icon style="color:#1890ff;" type="edit" />修改
								</permission-button>
								<!-- <a-button @click="showDeleteConfirm" :disabled="selectedRowKeys.length!=1">
									<a-icon style="color:#1890ff;" type="delete" />删除
								</a-button>-->
							</a-col>
							<a-col :span="16" style="text-align:right">
								<a-input type="text" v-model="keyword" style="width:300px" placeholder="图纸号/图纸名称"></a-input>
								<a-button type="primary" @click="getList">查询</a-button>
							</a-col>
						</div>
					</a-row>
					<a-row style="padding-top:10px;">
						<a-table
							rowKey="id"
							:columns="columns"
							:pagination="false"
							:dataSource="data"
							:rowSelection="{selectedRowKeys:selectedRowKeys,onChange: onSelectChange}"
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
					</a-row>
				</a-col>
			</a-row>
		</div>
		<a-modal
			title="新增图纸"
			:footer="null"
			width="1000px"
			:visible="addVisible"
			@cancel="handleCancel(1)"
			:maskClosable="false"
		>
			<add ref="addChild" v-on:addModal="addModal"></add>
		</a-modal>
		<a-modal
			title="修改图纸"
			:footer="null"
			width="1000px"
			:visible="editVisible"
			@cancel="handleCancel(2)"
			:maskClosable="false"
		>
			<edit ref="editChild" v-on:editModal="editModal" :id="selectedRows[0]"></edit>
		</a-modal>
	</div>
</template>
<script>
import Vue from "vue";
import { Table, Col, Row, Modal, Pagination } from "ant-design-vue";
Vue.use(Pagination);
Vue.use(Table);
Vue.use(Col);
Vue.use(Row);
Vue.use(Modal);
import add from "./Add";
import edit from "./Edit";
const columns = [
	{
		dataIndex: "drawingNo",
		title: "图纸号",
		width: "25%",
		key: "drawingNo"
	},
	{
		dataIndex: "name",
		key: "name",
		title: "图纸名称",
		width: "25%"
	},
	{
		dataIndex: "createdBy",
		key: "createdBy",
		title: "录入人",
		width: "10%"
	},
	{
		dataIndex: "remarks",
		key: "remarks",
		title: "备注",
		width: "25%"
	},
	{
		dataIndex: "gmtCreated",
		key: "gmtCreated",
		title: "创建时间",
		width: "15%"
	}
];
export default {
	inject: ["reload"],
	data() {
		return {
			addVisible: false,
			editVisible: false,
			isHideList: this.$route.params.id !== undefined ? true : false,
			columns,
			data: [],
			current: 1,
			pageSize: 10,
			total: 0,
			selectedRowKeys: [],
			keyword: "",
			selectedRows: []
		};
	},
	methods: {
		showEdit() {
			this.editVisible = true;
			// this.$refs.editChild.findOne();
		},
		showDeleteConfirm() {
			let that = this;
			this.$confirm({
				title: "确定删除吗?",
				content: "",
				okText: "确定",
				okType: "danger",
				cancelText: "取消",
				onOk: function() {
					that.onDelete();
				},
				onCancel() {}
			});
		},
		addModal(params) {
			if (params.type == "取消") {
				this.addVisible = params.value;
				this.getList();
			} else {
				this.addVisible = params.value;
				this.getList();
				this.reload();
			}
		},
		editModal(params) {
			if (params.type == "Cancel") {
				this.editVisible = params.value;
			} else {
				this.editVisible = params.value;
				this.selectedRowKeys = [];
				this.selectedRows = [];
				this.getList();
			}
		},
		onDelete() {
			let qs = require("qs");
			let data = qs.stringify({
				drawingId: this.selectedRowKeys[0]
			});
			this.Axios(
				{
					url: "/api-workorder/drawing/lib/delDrawing",
					params: data,
					type: "post",
					option: { successMsg: "删除成功！" }
					// config: {
					// 	headers: { "Content-Type": "application/json" }
					// }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						this.getList();
						this.selectedRowKeys = [];
						this.selectedRows = [];
					}
				},
				({ type, info }) => {}
			);
		},
		handleCancel(a) {
			if (a == 1) {
				this.addVisible = false;
				this.$refs.addChild.resetForm();
			}
			if (a == 2) {
				this.$refs.editChild.resetForm();
				this.editVisible = false;
			}
		},
		onSelectChange(selectedRowKeys, b) {
			// console.log("selectedRowKeys changed: ", selectedRowKeys);
			this.selectedRowKeys = selectedRowKeys;
			console.log(this.selectedRowKeys);
			this.selectedRows = b;
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
					url: "/api-workorder/drawing/lib/listAll",
					params: {
						page: this.current,
						size: this.pageSize,
						param: this.keyword
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
		}
	},
	components: {
		add,
		edit
	},
	created() {
		this.getList();
	}
};
</script>
