<template>
	<div class="order_list">
		<router-view></router-view>
		<div :class="[{hide:isHideList}]">
			<a-row>
				<a-col :span="24" style="padding:0 20px;">
					<a-row>
						<div style="line-height:50px;">
							<a-col :span="8">
								<a-button @click="addVisible=true">
									<a-icon style="color:#1890ff;" type="plus"/>新增
								</a-button>
								<a-button @click="edit">
									<a-icon style="color:#1890ff;" type="edit"/>修改
								</a-button>
								<a-popconfirm title="确定删除吗?" @confirm="() => onDelete">
									<a-button>
										<a-icon style="color:#1890ff;" type="delete"/>删除
									</a-button>
								</a-popconfirm>
							</a-col>

							<a-col :span="16" style="text-align:right">
								<a-select placeholder="请选择" optionFilterProp="children" style="width:100px;">
									<a-select-option value="1">全部</a-select-option>
									<a-select-option value="2">待生产</a-select-option>
									<a-select-option value="3">生产中</a-select-option>
									<a-select-option value="4">暂停中</a-select-option>
									<a-select-option value="5">已终止</a-select-option>
									<a-select-option value="6">完成</a-select-option>
								</a-select>
								<a-input type="text" style="width:300px" placeholder="根据设备编号/标题/客户名称/备注"></a-input>
								<a-button type="primary">查询</a-button>
							</a-col>
						</div>
					</a-row>
					<a-row style="padding-top:10px;">
						<a-table
							rowKey="id"
							:columns="columns"
							:pagination="false"
							:dataSource="data"
							:rowSelection="rowSelection"
						>
							<template slot="deviceModel" slot-scope="text, record, index">
								<div>
									<template slot="content">
										<span>生产中</span>
									</template>
									<i v-if="text==0" class="iconfont" style="color:#10CF0C;">
										&#xe61d;
										<span style="font-size:14px;">生产中</span>
									</i>

									<template slot="content">
										<span>待生产</span>
									</template>
									<i v-if="text==1" class="iconfont" style="color:#F59A23;">
										&#xe600;
										<span style="font-size:14px;">待生产</span>
									</i>

									<template slot="content">
										<span>暂停</span>
									</template>
									<i v-if="text==2" class="iconfont" style="color:#027DB4;">
										&#xe6b4;
										<span style="font-size:14px;">暂停</span>
									</i>

									<template slot="content">
										<span>终止</span>
									</template>
									<i v-if="text==3" class="iconfont" style="color:#E02D2D;">
										&#xe61a;
										<span style="font-size:14px;">终止</span>
									</i>

									<template slot="content">
										<span>完成</span>
									</template>
									<i v-if="text==4" class="iconfont" style="color:#D8D8D8;">
										&#xe624;
										<span style="font-size:14px;">完成</span>
									</i>
								</div>
							</template>
							<template slot="workerNames" slot-scope="text, record, index">
								<div>
									<a-tag v-if="text==0" color="#F59A23">待审批</a-tag>
									<a-tag v-if="text==1" color="#D8D8D8">已审批</a-tag>
									<a-tag v-if="text==2" color="#8400FF">被驳回</a-tag>
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
		</div>
		<a-modal
			title="新增订单"
			:footer="null"
			width="1000px"
			:visible="addVisible"
			@cancel="handleCancel(1)"
			:maskClosable="false"
		>
			<add-order v-on:changeAddModal="changeAddModal"></add-order>
		</a-modal>
		<a-modal
			title="修改订单"
			:footer="null"
			width="1000px"
			:visible="editVisible"
			@cancel="handleCancel(2)"
			:maskClosable="false"
		>
			<edit-order v-on:changeEditModal="changeEditModal"></edit-order>
		</a-modal>
	</div>
</template>

<script>
import AddOrder from "./OrderAdd";
import EditOrder from "./OrderEdit";
const columns = [
	{
		dataIndex: "deviceNo",
		title: "订单编号",
		width: 90,
		key: "deviceNo"
	},
	{
		dataIndex: "deviceName",
		title: "订单标题",
		width: 120,
		key: "deviceName"
	},
	{
		dataIndex: "deviceCategoryName",
		key: "deviceCategoryName",
		title: "生产进度",
		width: 70
	},
	{
		dataIndex: "organizeName",
		key: "organizeName",
		title: "订单类型",
		width: 160
	},
	{
		dataIndex: "deviceModel",
		key: "deviceModel",
		title: "客户名称",
		width: 70,
		scopedSlots: { customRender: "deviceModel" }
	},
	{
		dataIndex: "deviceState",
		key: "deviceState",
		title: "风险预警",
		width: 80,
		scopedSlots: { customRender: "deviceState" }
	},
	{
		dataIndex: "locationNo",
		key: "locationNo",
		title: "备注",
		width: 120
	},
	{
		dataIndex: "location",
		key: "location",
		title: "创建时间",
		width: 80
	}
];
const data = [
	{
		id: "0",
		deviceNo: "111",
		deviceName: "11",
		deviceState: "11",
		organizeName: "11",
		location: "11",
		locationNo: "11",
		deviceCategoryName: "11",
		deviceModel: "1",
		workerNames: "0"
	},
	{
		id: "1",
		deviceNo: "111",
		deviceName: "11",
		deviceState: "11",
		organizeName: "11",
		location: "11",
		locationNo: "11",
		deviceCategoryName: "11",
		deviceModel: "3",
		workerNames: "2"
	},
	{
		id: "2",
		deviceNo: "111",
		deviceName: "11",
		deviceState: "11",
		organizeName: "11",
		location: "11",
		locationNo: "11",
		deviceCategoryName: "11",
		deviceModel: "0",
		workerNames: "1"
	}
];
const rowSelection = {
	onChange: (selectedRowKeys, selectedRows) => {
		console.log(
			`selectedRowKeys: ${selectedRowKeys}`,
			"selectedRows: ",
			selectedRows
		);
	},
	onSelect: (record, selected, selectedRows) => {
		console.log(record, selected, selectedRows);
	},
	onSelectAll: (selected, selectedRows, changeRows) => {
		console.log(selected, selectedRows, changeRows);
	}
};
export default {
	name: "orderList",
	data() {
		return {
			rowSelection,
			addVisible: false,
			editVisible: false,
			form: this.$form.createForm(this),
			isHideList: this.$route.params.id !== undefined ? true : false,
			columns,
			data,
			current: 1,
			pageSize: 10,
			total: 50
		};
	},
	methods: {
		onDelete() {},
		changeEditModal(params) {
			this.editVisible = params;
		},
		changeAddModal(params) {
			this.addVisible = params;
		},
		handleCancel(a) {
			if (a == 1) {
				this.addVisible = false;
			}
			if (a == 2) {
				this.editVisible = false;
			}
		},
		moreOperation({ key }) {
			console.log(key);
		},
		confirm(e) {
			console.log(e);
			this.$message.success("Click on Yes");
		},
		cancel(e) {
			console.log(e);
			this.$message.error("Click on No");
		},
		onShowSizeChange(current, pageSize) {
			this.pageSize = pageSize;
		},
		onChange(current, pageNumber) {
			console.log("Page: ", pageNumber);
			console.log("第几页: ", current);
			this.current = current;
		},
		edit() {
			// this.$router.push({ path: "/OrderList/OrderEdit/" + record.id });
			this.editVisible = true;
		}
	},
	created() {
		let a = this.$route.matched.find(item => item.name === "OrderAdd")
			? true
			: false;
		let b = this.$route.params.id !== undefined ? true : false;
		this.isHideList = a || b ? true : false;
	},
	watch: {
		$route() {
			let a = this.$route.matched.find(item => item.name === "OrderAdd")
				? true
				: false;
			let b = this.$route.params.id !== undefined ? true : false;
			this.isHideList = a || b ? true : false;
		}
	},
	components: {
		AddOrder,
		EditOrder
	}
};
</script>
<style lang="less">
.order_list {
	i {
		font-size: 16px;
	}
	a {
		&:hover {
			text-decoration: underline;
		}
	}
}
</style>
