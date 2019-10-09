<template>
	<div class="authority_list">
		<router-view></router-view>
		<div :class="[{hide:isHideList}]">
			<a-col :span="24" style="padding:0 20px;">
				<a-row>
					<div style="line-height:50px;">
						<a-col :span="8">
							<!-- <a-button type="primary" @click="$router.push({path:'/Authority/AddAuthority'})">
								<a-icon type="plus-circle"/>新增
							</a-button>-->
							<permission-button
								permCode
								banType="hide"
								@click="$router.push({path:'/Authority/AddAuthority'})"
							>
								<a-icon style="color:#1890ff;" type="plus" />新增
							</permission-button>
							<permission-button
								permCode
								banType="hide"
								@click="edit"
								:disabled="selectedRowKeys.length!=1"
							>
								<a-icon style="color:#1890ff;" type="edit" />修改
							</permission-button>
							<permission-button
								permCode="system_role_list_lookup.system_role_delete"
								banType="hide"
								:disabled="selectedRowKeys.length!=1"
								@click="showDeleteConfirm"
							>
								<a-icon style="color:#1890ff;" type="delete" />删除
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
		</div>
	</div>
</template>
<script>
import Vue from "vue";
import { Table, Col, Row, Pagination } from "ant-design-vue";
Vue.use(Pagination);
Vue.use(Table);
Vue.use(Col);
Vue.use(Row);
const columns = [
	{
		dataIndex: "name",
		title: "角色名称",
		width: "60%",
		key: "name"
	},
	{
		dataIndex: "description",
		title: "备注",
		width: "35%",
		key: "description"
	}
];
const data = [
	{
		key: "0",
		deviceNo: "111",
		deviceName: "11",
		deviceState: "11",
		organizeName: "11",
		location: "11",
		state: "1",
		deviceCategoryName: "11",
		deviceModel: "11",
		workerNames: "11"
	},
	{
		key: "1",
		deviceNo: "111",
		deviceName: "11",
		deviceState: "11",
		organizeName: "11",
		location: "11",
		state: "0",
		deviceCategoryName: "11",
		deviceModel: "11",
		workerNames: "11"
	},
	{
		key: "2",
		deviceNo: "111",
		deviceName: "11",
		deviceState: "11",
		organizeName: "11",
		location: "11",
		state: "0",
		deviceCategoryName: "11",
		deviceModel: "11",
		workerNames: "11"
	}
];

export default {
	data() {
		return {
			isHideList: this.$route.params.id !== undefined ? true : false,
			columns,
			data: [],
			current: 1,
			pageSize: 10,
			total: 50,
			selectedRowKeys: []
		};
	},
	methods: {
		onSelectChange(selectedRowKeys) {
			this.selectedRowKeys = selectedRowKeys;
			console.log(this.selectedRowKeys);
		},
		onDelete(e) {
			let qs = require("qs");
			let data = qs.stringify({
				roleId: this.selectedRowKeys[0]
			});
			this.Axios(
				{
					url: "/api-sso/role/delRole",
					params: data,
					type: "post",
					option: { successMsg: "删除成功！" }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.getList();
						this.selectedRowKeys = [];
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
		edit(record, text, index) {
			this.$router.push({
				path: "/Authority/EditAuthority/" + this.selectedRowKeys[0]
			});
		},
		getList() {
			this.Axios(
				{
					url: "/api-sso/role/roleList",
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
						this.data = result.data.data.content;
						this.total = result.data.data.totalElement;
					}
				},
				({ type, info }) => {}
			);
		},
		showDeleteConfirm() {
			let that = this;
			this.$confirm({
				title: "确定删除吗？",
				content: "",
				okText: "确定",
				okType: "danger",
				cancelText: "取消",
				onOk: function() {
					that.onDelete();
				},
				onCancel() {}
			});
		}
	},
	created() {
		this.getList();
		let a = this.$route.matched.find(item => item.name === "AddAuthority")
			? true
			: false;
		let b = this.$route.params.id !== undefined ? true : false;
		this.isHideList = a || b ? true : false;
	},
	watch: {
		$route() {
			this.getList();
			this.selectedRowKeys = [];
			let a = this.$route.matched.find(item => item.name === "AddAuthority")
				? true
				: false;
			let b = this.$route.params.id !== undefined ? true : false;
			this.isHideList = a || b ? true : false;
		}
	}
};
</script>