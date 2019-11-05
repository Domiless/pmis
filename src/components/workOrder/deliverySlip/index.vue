<template>
	<div class="delivery_slip">
		<a-row>
			<a-col :span="24" style="padding:0 20px;">
				<a-row>
					<div style="line-height:50px;">
						<a-col :span="15">
							<permission-button
								permCode="workorder_manage_lookup.workorder_manager_add"
								banType="hide"
								@click="addVisible=true"
							>
								<a-icon style="color:#1890ff;" type="plus" />新增
							</permission-button>
							<permission-button
								permCode="workorder_manage_lookup.workorder_manager_update"
								banType="hide"
								@click="editVisible=true"
								:disabled="selectedRowKeys.length!=1"
							>
								<a-icon style="color:#1890ff;" type="edit" />修改
							</permission-button>
							<permission-button
								permCode="workorder_manage_lookup.workorder_manager_delete"
								banType="hide"
								@click="showDeleteConfirm"
								:disabled="selectedRowKeys.length<1"
							>
								<a-icon style="color:#1890ff;" type="delete" />删除
							</permission-button>
							<permission-button
								permCode
								banType="hide"
								@click="download"
								:disabled="selectedRowKeys.length!=1"
							>
								<i class="iconfont" style="color:#1890ff;margin-right:8px;">&#xe60c;</i>导出送货单
							</permission-button>
						</a-col>
					</div>
				</a-row>
				<a-row style="padding-top:10px;">
					<a-table
						:columns="columns"
						:pagination="false"
						:dataSource="data"
						:rowSelection="{selectedRowKeys:selectedRowKeys,onChange: onSelectChange}"
						rowKey="id"
					>
						<template slot="title11" slot-scope="text, record, index">
							<div>
								<!-- <a-button class="button_text" @click="showDetails(record)">{{text}}</a-button> -->
								<a href="jsvascript:" @click="showDetails(record)">{{text}}</a>
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
			</a-col>
		</a-row>
		<a-modal
			title="新增"
			:footer="null"
			width="1000px"
			:visible="addVisible"
			@cancel="handleCancel(1)"
			:maskClosable="false"
		>
			<add v-on:addModal="addModal" ref="addref"></add>
		</a-modal>
		<a-modal
			title="修改"
			:footer="null"
			width="1000px"
			:visible="editVisible"
			@cancel="handleCancel(2)"
			:maskClosable="false"
		>
			<edit v-on:editModal="editModal" :msg="selectedRowKeys[0]" ref="editref"></edit>
		</a-modal>
		<a-modal
			title="详情"
			:footer="null"
			width="1000px"
			:visible="detailsVisible"
			@cancel="handleCancel(3)"
			:maskClosable="false"
		>
			<div style="overflow:hidden;">
				<a-col :span="24">
					<a-col :span="12">
						<span class="details_label">单据编号：</span>
						<span>{{detailsMsg.docNo}}</span>
					</a-col>
					<a-col :span="12">
						<span class="details_label">标题：</span>
						<span>{{detailsMsg.title}}</span>
					</a-col>
				</a-col>
				<a-col :span="24">
					<a-col :span="12">
						<span class="details_label">收货单位：</span>
						<span>{{detailsMsg.receivingUnit}}</span>
					</a-col>
					<a-col :span="12">
						<span class="details_label">送货单位：</span>
						<span>{{detailsMsg.deliveryUnit}}</span>
					</a-col>
				</a-col>
				<a-col :span="24">
					<a-col :span="12">
						<span class="details_label">收货人：</span>
						<span>{{detailsMsg.receivingPerson}}</span>
					</a-col>
					<a-col :span="12">
						<span class="details_label">送货人：</span>
						<span>{{detailsMsg.deliveryPerson}}</span>
					</a-col>
				</a-col>
				<a-col :span="24" style="margin-top:20px;">
					<a-table
						:scroll="{ y: 400 }"
						size="small"
						rowKey="workOrderDesId"
						:columns="columns1"
						:pagination="false"
						:dataSource="data1"
					></a-table>
				</a-col>
			</div>
		</a-modal>
	</div>
</template>
<script>
import add from "./Add";
import edit from "./Edit";
const columns = [
	{
		dataIndex: "docNo",
		key: "docNo",
		title: "单据编号",
		width: "20%"
	},
	{
		dataIndex: "title",
		title: "标题",
		width: "20%",
		key: "title",
		scopedSlots: { customRender: "title11" }
	},
	{
		dataIndex: "deliveryUnit",
		title: "收货单位",
		width: "20%",
		key: "deliveryUnit"
	},

	{
		dataIndex: "receivingPerson",
		key: "receivingPerson",
		title: "收货人",
		width: "20%"
	},
	{
		dataIndex: "gmtCreated",
		key: "gmtCreated",
		title: "创建时间",
		width: "20%"
	}
	// {
	// 	dataIndex: "schedule",
	// 	key: "schedule",
	// 	title: "备注",
	// 	width: 120
	// }
];
let columns1 = [
	{
		dataIndex: "planCode",
		key: "planCode",
		title: "计划编号",
		width: 80
	},
	{
		dataIndex: "gongZuoLingNo",
		key: "gongZuoLingNo",
		title: "工作令",
		width: 120
	},
	{
		dataIndex: "drawingNo",
		key: "drawingNo",
		title: "图号",
		width: 120
	},
	{
		dataIndex: "drawingName",
		key: "drawingName",
		title: "名称",
		width: 120
	},
	{
		dataIndex: "amount",
		key: "amount",
		title: "数量",
		width: 80
	}
];
export default {
	data() {
		return {
			columns1,
			detailsVisible: false,
			editVisible: false,
			addVisible: false,
			columns,
			data: [],
			data1: [],
			current: 1,
			pageSize: 10,
			total: 0,
			selectedRowKeys: [],
			selectedRows: [],
			detailsMsg: {}
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
					this.global.apiSrc +
						"/api-workorder/delivery/exportExcel/" +
						this.selectedRowKeys[0],
					{},
					{
						responseType: "blob", // 设置响应数据类型
						headers: { "Content-Type": "application/json" }
					}
				)
				.then(res => {
					if (res.status == 200) {
						// console.log(res);
						var blob = new Blob([res.data], {
							type:
								"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
						});
						var downloadElement = document.createElement("a");
						var href = window.URL.createObjectURL(blob); //创建下载的链接
						downloadElement.href = href;
						let fileName;
						downloadElement.download =
							this.selectedRows[0].title + "送货单.xlsx"; //下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); //点击下载
						document.body.removeChild(downloadElement); //下载完成移除元素
						window.URL.revokeObjectURL(href); //释放掉blob对象
					}
				});
		},
		addModal(params) {
			this.addVisible = false;
			this.selectedRowKeys = [];
			this.getList();
		},
		editModal(params) {
			this.editVisible = false;
			this.selectedRowKeys = [];
			this.getList();
		},
		handleCancel(a) {
			if (a == 1) {
				// this.addVisible = false;
				this.$refs.addref.cancle();
			}
			if (a == 2) {
				// this.editVisible = false;
				this.$refs.editref.cancle();
			}
			if (a == 3) {
				this.detailsVisible = false;
			}
		},
		showDetails(row) {
			console.log(row);
			this.findOne(row);
		},
		findOne(row) {
			this.Axios(
				{
					url: "/api-workorder/delivery/findOne/" + row.id,
					params: {
						// deliveryNoteId: this.msg
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
						this.data1 = result.data.data.deliveryNoteItems;
						this.detailsVisible = true;
					}
				},
				({ type, info }) => {}
			);
		},
		onSelectChange(selectedRowKeys, a) {
			console.log(selectedRowKeys, a);
			this.selectedRowKeys = selectedRowKeys;
			this.selectedRows = a;
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
		onDelete() {
			this.Axios(
				{
					url: "/api-workorder/delivery/del",
					params: { data: this.selectedRowKeys },
					type: "delete",
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
					url: "/api-workorder/delivery/list",
					params: {
						page: this.current,
						size: this.pageSize,
						state: this.state,
						keyword: this.keyword
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
	created() {
		this.getList();
	},
	components: {
		add,
		edit
	}
};
</script>
<style lang="less">
.delivery_slip {
	overflow: hidden;
}
.details_label {
	display: inline-block;
	width: 120px;
	text-align: right;
}
</style>