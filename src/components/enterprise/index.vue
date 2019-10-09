<template>
	<div class="enterprise_list">
		<router-view></router-view>
		<div :class="[{hide:isHideList}]">
			<a-row>
				<a-col :span="24" style="padding:0 20px;">
					<a-row>
						<div style="line-height:50px;">
							<a-col :span="8">
								<a-button @click="addVisible=true">
									<a-icon style="color:#1890ff;" type="plus" />新增
								</a-button>
								<a-button @click="edit" :disabled="selectedRowKeys.length!=1">
									<a-icon style="color:#1890ff;" type="edit" />修改
								</a-button>
								<!-- <a-popconfirm title="确定删除吗?" @confirm="() => onDelete">
									<a-button>
										<a-icon style="color:#1890ff;" type="delete"/>删除
									</a-button>
								</a-popconfirm>-->
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
						>
							<template slot="deviceState" slot-scope="text, record, index">
								<a-switch
									checkedChildren="启用"
									unCheckedChildren="禁用"
									:defaultChecked="text==0"
									@change="changeState(record,index)"
								/>
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
			title="新增企业"
			:footer="null"
			width="600px"
			:visible="addVisible"
			@cancel="handleCancel(1)"
			:maskClosable="false"
		>
			<add-enterprise v-on:changeAddModal="changeAddModal" ref="addEnterprise"></add-enterprise>
		</a-modal>
		<a-modal
			title="修改企业"
			:footer="null"
			width="600px"
			:visible="editVisible"
			@cancel="handleCancel(2)"
			:maskClosable="false"
		>
			<edit-enterprise v-on:changeEditModal="changeEditModal" :msg="getOneMsg" ref="editEnterprise"></edit-enterprise>
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
import md5 from "js-md5/src/md5.js";
import CryptoJS from "crypto-js/crypto-js.js";
const columns = [
	{
		dataIndex: "enterpriseName",
		title: "企业名称",
		width: 180,
		key: "enterpriseName"
	},
	{
		dataIndex: "contact",
		key: "contact",
		title: "联系人",
		width: 90
	},
	{
		dataIndex: "phone",
		key: "phone",
		title: "手机号",
		width: 120
	},
	{
		dataIndex: "account",
		key: "account",
		title: "企业账号",
		width: 120
	},
	{
		dataIndex: "state",
		key: "state",
		title: "启用状态",
		width: 80,
		scopedSlots: { customRender: "deviceState" }
	},
	{
		dataIndex: "expireDate",
		key: "expireDate",
		title: "过期时间",
		width: 120
	},
	{
		dataIndex: "gmtCreate",
		key: "gmtCreate",
		title: "创建时间",
		width: 120
	}
];
const data = [
	{
		id: "0",
		deviceNo: "111",
		deviceName: "11",
		deviceState: "1",
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
		return selectedRowKeys;
		// this.selectedRowKey = selectedRowKeys;
		// console.log(this.selectedRowKey);
	},
	onSelect: (record, selected, selectedRows) => {
		// console.log(record, selected, selectedRows);
	},
	onSelectAll: (selected, selectedRows, changeRows) => {
		// console.log(selected, selectedRows, changeRows);
	}
};
import AddEnterprise from "./Add";
import EditEnterprise from "./edit";
export default {
	inject: ["reload"],
	name: "orderList",
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
			getOneMsg: {}
		};
	},
	methods: {
		onSelectChange(selectedRowKeys) {
			// console.log("selectedRowKeys changed: ", selectedRowKeys);
			this.selectedRowKeys = selectedRowKeys;
			console.log(this.selectedRowKeys);
		},
		onDelete() {},
		changeEditModal(params) {
			this.editVisible = params;
			this.getList();
		},
		changeAddModal(params) {
			if (params.type == "cancel") {
				this.addVisible = params.visible;
			} else {
				this.AddEnterpriseMsg(params);
			}
		},
		handleCancel(a) {
			if (a == 1) {
				// this.addVisible = false;
				this.$refs.addEnterprise.confirmCancel();
			}
			if (a == 2) {
				// this.editVisible = false;
				this.$refs.editEnterprise.confirmCancel();
			}
		},
		changeState(row, index) {
			let urlStr;
			if (row.state == 0) {
				urlStr = "/api-platform/enterprise/stop";
			} else {
				urlStr = "/api-platform/enterprise/start";
			}
			let qs = require("qs");
			let data = qs.stringify({
				enterpriseId: row.id
			});
			this.Axios(
				{
					url: urlStr,
					params: data,
					type: "post",
					option: { successMsg: "修改成功！" }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						this.getList();
					}
				},
				({ type, info }) => {}
			);
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
			if (this.selectedRowKeys.length > 1) {
				this.$message.error("一次只能对一条数据进行修改！");
				return false;
			} else if (this.selectedRowKeys.length == 0) {
				this.$message.error("请选择要修改的数据！");
				return false;
			} else {
				this.findOne(this.selectedRowKeys[0]);
			}
		},
		encryptByDES(message, key) {
			const keyHex = CryptoJS.enc.Utf8.parse(key);
			const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
				mode: CryptoJS.mode.ECB,
				padding: CryptoJS.pad.Pkcs7
			});
			return encrypted.toString();
		},
		getList() {
			this.Axios(
				{
					url: "/api-platform/enterprise/list",
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
						console.log(result.data.data.content);
						this.data = result.data.data.content;
						this.total = result.data.data.totalElement;
						this.selectedRowKeys = [];
					}
				},
				({ type, info }) => {}
			);
		},
		AddEnterpriseMsg(params) {
			let qs = require("qs");
			let data = qs.stringify({
				enterpriseName: params.value.enterpriseName,
				contact: params.value.contact,
				phone: params.value.phone,
				account: params.value.account,
				password: params.value.password,
				businessLicense: params.value.businessLicense,
				startData: params.value.expireDate[0],
				expireDate: params.value.expireDate[1]
			});
			this.Axios(
				{
					url: "/api-platform/enterprise/add",
					params: data,
					type: "post",
					option: { successMsg: "添加成功！" }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.addVisible = params.visible;
						this.reload();
					}
				},
				({ type, info }) => {
					// if (info.code === 408) {
					// 	this.$message.error("验证码错误");
					// }
					// if (info.code === 402) {
					// 	this.$message.error("账号或密码错误");
					// }
					// if (info.code === 0) {
					// 	this.$message.error("对不起，您的账户已被禁用");
					// }
				}
			);
		},
		findOne(id) {
			this.Axios(
				{
					url: "/api-platform/enterprise/findOne",
					params: {
						id: id
					},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						this.getOneMsg = result.data.data;
						this.editVisible = true;
					}
				},
				({ type, info }) => {}
			);
		}
	},
	created() {
		this.getList();
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
		AddEnterprise,
		EditEnterprise
	}
};
</script>
<style lang="less">
.enterprise_list {
}
</style>
