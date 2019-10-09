<template>
	<div class="employee_list">
		<router-view></router-view>
		<div :class="[{hide:isHideList}]">
			<a-col :span="24" style="padding:0 20px;">
				<a-row>
					<div style="line-height:50px;">
						<a-col :span="8">
							<!-- <a-button type="primary" @click="$router.push({path:'/Employee/AddEmployee'})">
								<a-icon type="plus-circle"/>添加
							</a-button>-->
							<permission-button
								permCode
								banType="hide"
								@click="$router.push({path:'/Employee/AddEmployee'})"
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
								permCode="employee_list_lookup.employee_list_reset"
								banType="hide"
								@click="resetPwd"
								:disabled="selectedRowKeys.length!=1"
							>
								<i style="color:#1890ff;margin-right:6px;display:inline-block;" class="iconfont">&#xe6b6;</i>
								重置密码
							</permission-button>
							<!-- <a-button @click="showDeleteConfirm" :disabled="selectedRowKeys.length!=1">
								<a-icon style="color:#1890ff;" type="delete" />删除
							</a-button>-->
						</a-col>

						<a-col :span="16" style="text-align:right">
							关键字：
							<a-input type="text" v-model="param" style="width:300px" placeholder="姓名，员工编号"></a-input>
							<a-button type="primary" icon="search" @click="getList">搜索</a-button>
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
						<template slot="state" slot-scope="text, record, index">
							<div>
								<a-switch
									checkedChildren="正常"
									unCheckedChildren="禁用"
									:defaultChecked="record.state==0?true:false"
									@click="changeState(record,index)"
									:disabled="roleSwitch!=undefined?false:true"
								></a-switch>
							</div>
						</template>
						<template slot="userName" slot-scope="text, record, index">
							<a href="javascript:" @click="showDetails(record)">{{text}}</a>
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
		</div>
		<a-modal
			title="员工详情"
			:footer="null"
			width="600px"
			:visible="detailsVisible"
			@cancel="handleCancel()"
			:maskClosable="false"
		>
			<a-row>
				<a-col :span="12" style="margin-bottom:12px;">
					<span class="label_right">员工编号：</span>
					<span>{{employeeDetails.employeeNo}}</span>
				</a-col>
				<a-col :span="12" style="margin-bottom:12px;">
					<span class="label_right">姓名：</span>
					<span>{{employeeDetails.userName}}</span>
				</a-col>
				<a-col :span="12" style="margin-bottom:12px;">
					<span class="label_right">手机号：</span>
					<span>{{employeeDetails.phone}}</span>
				</a-col>
				<a-col :span="12" style="margin-bottom:12px;">
					<span class="label_right">所处班组：</span>
					<span>{{employeeDetails.organizeName}}</span>
				</a-col>
				<a-col :span="12" style="margin-bottom:12px;">
					<span class="label_right">分配角色：</span>
					<span>{{employeeDetails.roleName}}</span>
				</a-col>
				<a-col :span="12" style="margin-bottom:12px;">
					<span class="label_right">工种：</span>
					<span>{{employeeDetails.workTypeName}}</span>
				</a-col>
				<a-col :span="12" style="margin-bottom:12px;">
					<span class="label_right">年龄：</span>
					<span>{{employeeDetails.age}}</span>
				</a-col>
				<a-col :span="12" style="margin-bottom:12px;">
					<span class="label_right">性别：</span>
					<span>{{employeeDetails.gender==0?'女':'男'}}</span>
				</a-col>
				<a-col :span="12" style="margin-bottom:12px;">
					<span class="label_right">入职时间：</span>
					<span>{{employeeDetails.entryTime}}</span>
				</a-col>
				<a-col :span="12" style="margin-bottom:12px;">
					<span class="label_right">以往工作年限：</span>
					<span>{{employeeDetails.workingYear}}</span>
				</a-col>
				<a-col :span="24" style="margin-bottom:12px;">
					<span class="label_right">相关附件：</span>
					<span style="display:inline-block;vertical-align:top">
						<p v-for="(item,index) in employeeDetails.employeeDocs" :key="index">
							<a :href="item.docPositionTrueUrl" target="_blank">{{item.docName}}</a>
						</p>
					</span>
				</a-col>
			</a-row>
		</a-modal>
	</div>
</template>
<script>
import Vue from "vue";
import { Table, Col, Row, Modal, Pagination, Switch } from "ant-design-vue";
Vue.use(Pagination);
Vue.use(Table);
Vue.use(Col);
Vue.use(Row);
Vue.use(Modal);
Vue.use(Switch);

const columns = [
	{
		dataIndex: "employeeNo",
		title: "员工编号",
		width: "15%",
		key: "devicemployeeNoeNo"
	},
	{
		dataIndex: "userName",
		title: "姓名",
		width: "10%",
		key: "userName",
		scopedSlots: { customRender: "userName" }
	},
	{
		dataIndex: "phone",
		key: "phone",
		title: "手机号",
		width: "15%"
	},
	{
		dataIndex: "organizeName",
		key: "organizeName",
		title: "所处班组",
		width: "20%"
	},
	{
		dataIndex: "roleName",
		key: "roleName",
		title: "角色分配",
		width: "15%"
	},
	{
		dataIndex: "workTypeName",
		key: "workTypeName",
		title: "职能/工种",
		width: "15%"
	},
	{
		dataIndex: "state",
		key: "state",
		title: "状态",
		width: "10%",
		scopedSlots: { customRender: "state" }
	}
];
export default {
	data() {
		return {
			detailsVisible: false,
			param: "",
			visible: false,
			isHideList: this.$route.params.id !== undefined ? true : false,
			allClassify: [
				"生产设备",
				"非生产设备",
				"辅助生产设备",
				"检验检测设备",
				"其他设备"
			],
			columns,
			data: [],
			current: 1,
			pageSize: 10,
			total: 0,
			selectedRowKeys: [],
			employeeDetails: {},
			roleSwitch: ""
		};
	},
	methods: {
		handleCancel() {
			this.detailsVisible = false;
		},
		showDetails(row) {
			this.employeeDetails = row;
			this.detailsVisible = true;
			console.log(this.employeeDetails);
		},
		resetPwd() {
			let qs = require("qs");
			let data = qs.stringify({
				employeeId: this.selectedRowKeys[0]
			});
			this.Axios(
				{
					url: "/api-sso/simpleUserAction/resetPwd",
					params: data,
					type: "post",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						this.$success({
							title: "密码重置成功！",
							// JSX support
							content: (
								<div>
									密码已重置为：<span style="color:red;">123456</span>
									<p>请通知相关人员登录并修改</p>
								</div>
							)
						});
					}
				},
				({ type, info }) => {}
			);
		},
		onSelectChange(selectedRowKeys) {
			this.selectedRowKeys = selectedRowKeys;
			console.log(this.selectedRowKeys);
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
		},
		onDelete(e) {
			let qs = require("qs");
			let data = qs.stringify({
				employeeId: this.selectedRowKeys[0]
			});
			this.Axios(
				{
					url: "/api-platform/employee/del",
					params: data,
					type: "post",
					option: { successMsg: "删除成功！" }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
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
		edit() {
			this.$router.push({
				path: "/Employee/EditEmployee/" + this.selectedRowKeys[0]
			});
		},
		getList() {
			this.Axios(
				{
					url: "/api-platform/employee/list",
					params: {
						page: this.current,
						size: this.pageSize,
						param: this.param
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

						for (let i = 0; i < this.data.length; i++) {
							this.data[i].workTypeName = "";
							for (let j = 0; j < this.data[i].workType.length; j++) {
								this.data[i].workTypeName +=
									this.data[i].workType[j].workTypeName +
									(j == this.data[i].workType.length - 1 ? "" : "、");
							}
						}
						this.total = result.data.data.totalElement;
					}
				},
				({ type, info }) => {}
			);
		},
		changeState(row, index) {
			let urlStr;
			if (row.state == -2) {
				urlStr = "/api-platform/employee/start";
			} else {
				urlStr = "/api-platform/employee/stop";
			}
			let qs = require("qs");
			let data = qs.stringify({
				employeeId: row.id
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
						console.log(result);
						this.getList();
					}
				},
				({ type, info }) => {
					this.getList();
				}
			);
		}
	},
	created() {
		this.getList();
		this.roleSwitch =
			JSON.parse(sessionStorage.getItem("permissionUrl")).find(
				item => item.module == "employee_list_lookup"
			) != undefined
				? JSON.parse(sessionStorage.getItem("permissionUrl"))
						.find(item => item.module == "employee_list_lookup")
						.permissionItem.find(item => item == "employee_list_switch")
				: undefined;
		let a = this.$route.matched.find(item => item.name === "AddEmployee")
			? true
			: false;
		let b = this.$route.params.id !== undefined ? true : false;
		this.isHideList = a || b ? true : false;
	},
	watch: {
		$route() {
			this.getList();
			this.selectedRowKeys = [];
			let a = this.$route.matched.find(item => item.name === "AddEmployee")
				? true
				: false;
			let b = this.$route.params.id !== undefined ? true : false;
			this.isHideList = a || b ? true : false;
		}
	}
};
</script>
<style lang="less">
.label_right {
	display: inline-block;
	width: 120px;
	text-align: right;
}
</style>
