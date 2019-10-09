<template>
	<div class="edit_employee">
		<a-row style="line-height:50px;">
			<a-button @click="$router.back(-1)" icon="left">返回</a-button>
		</a-row>
		<a-row>
			<div class="content_case">
				<a-form :form="form" @keyup.enter.native="handleSubmit">
					<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="员工编号">
						<a-input
							v-decorator="[
							'employeeNo',
							{rules: [{ required: true, message: '请填写姓名' }]}
							]"
							disabled
						></a-input>
					</a-form-item>
					<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="姓名">
						<a-input
							v-decorator="[
							'userName',
							{rules: [{ required: true, message: '请填写姓名' }]}
							]"
							maxlength="20"
						></a-input>
					</a-form-item>
					<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="手机号码">
						<a-input
							oninput="if(value.length>11)value=value.slice(0,11)"
							v-decorator="[
							'phone',
							{rules: [{ required: true, message: '请填写手机号码' },{validator: chickPhone}]}
							]"
							type="number"
						></a-input>
					</a-form-item>
					<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="所处班组">
						<a-tree-select
							v-decorator="[
							'organizeId',
							{rules: [{ required: true, message: '请选择所处班组' }]}
							]"
							:dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
							:treeData="treeData"
							placeholder="请选择"
							treeDefaultExpandAll
						>
							<span slot="title" slot-scope="{key, value}">{{value}}</span>
						</a-tree-select>
					</a-form-item>
					<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="分配角色">
						<a-select
							showSearch
							placeholder="请选择"
							optionFilterProp="children"
							v-decorator="[
							'roleCode',
							{rules: [{ required: true, message: '请选择角色' }]}
							]"
							@change="getRoleId"
						>
							<a-select-option
								v-for="(item, index) in roleList"
								:key="index"
								:value="item.roleCode"
							>{{item.name}}</a-select-option>
						</a-select>
					</a-form-item>
					<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="工种">
						<a-select
							mode="multiple"
							showSearch
							placeholder="请选择"
							optionFilterProp="children"
							v-decorator="[
							'workTypeIds',
							{rules: [{ required: true, message: '请选择工种' }]}
							]"
						>
							<a-select-option
								v-for="(item, index) in ProcessTypesList"
								:key="index"
								:value="item.id"
							>{{item.workTypeName}}</a-select-option>
						</a-select>
					</a-form-item>
					<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="年龄">
						<a-input
							type="number"
							oninput="if(value.length>5)value=value.slice(0,5);if(value<0)value=null"
							addonAfter="岁"
							v-decorator="['age']"
						></a-input>
					</a-form-item>
					<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="性别">
						<a-radio-group v-decorator="['gender']">
							<a-radio :value="1">男</a-radio>
							<a-radio :value="0">女</a-radio>
						</a-radio-group>
					</a-form-item>
					<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="入职时间">
						<a-date-picker
							@change="onChange"
							v-decorator="['entryTime']"
							style="width:100%"
							format="YYYY/MM/DD"
						/>
					</a-form-item>
					<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="以往工作年限">
						<a-input
							type="number"
							oninput="if(value.length>5)value=value.slice(0,5);if(value<0)value=null"
							v-decorator="['workingYear']"
							addonAfter="年"
						></a-input>
					</a-form-item>
					<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="简历附件">
						<a-upload
							v-decorator="['EmployeeDocDTO']"
							:action="global.apiImg"
							:multiple="true"
							:fileList="fileList"
							@change="handleChange"
						>
							<a-button>
								<a-icon type="upload" />上传文件
							</a-button>
						</a-upload>
					</a-form-item>
					<a-form-item :wrapper-col="{ span: 22,offset: 2 }">
						<permission-button
							permCode="employee_update_lookup.employee_update_save"
							banType="hide"
							type="primary"
							@click="handleSubmit"
						>提交</permission-button>
					</a-form-item>
				</a-form>
			</div>
		</a-row>
	</div>
</template>
<script>
import Vue from "vue";
import {
	Upload,
	Form,
	Input,
	Icon,
	TreeSelect,
	Select,
	DatePicker,
	Radio,
	Row
} from "ant-design-vue";
Vue.use(Upload);
Vue.use(Form);
Vue.use(Input);
Vue.use(Icon);
Vue.use(TreeSelect);
Vue.use(Select);
Vue.use(DatePicker);
Vue.use(Row);
Vue.use(Select);
import moment from "moment";
const treeData = [
	{
		title: "Node1",
		value: "0-0",
		key: "0-0",
		children: [
			{
				value: "0-0-1",
				key: "0-0-1",
				scopedSlots: {
					// custom title
					title: "title"
				}
			},
			{
				title: "Child Node2",
				value: "0-0-2",
				key: "0-0-2"
			}
		]
	},
	{
		title: "Node2",
		value: "0-1",
		key: "0-1"
	}
];
export default {
	data() {
		return {
			form: this.$form.createForm(this),
			treeData: [],
			fileList: [],
			roleList: [],
			ProcessTypesList: [],
			dateValue: "",
			roleCode: ""
		};
	},
	methods: {
		chickPhone(rule, value, callback) {
			if (
				/^1[23456789]\d{9}$/.test(value) == false &&
				value != "" &&
				value != null
			) {
				callback(new Error("请输入正确的电话号码"));
			} else {
				callback();
			}
		},
		onChange(date, dateString) {
			this.dateValue = dateString;
		},
		moment,
		encryptByDES(message, key) {
			const keyHex = CryptoJS.enc.Utf8.parse(key);
			const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
				mode: CryptoJS.mode.ECB,
				padding: CryptoJS.pad.Pkcs7
			});
			return encrypted.toString();
		},
		handleChange(info) {
			console.log(info);
			let fileList = [...info.fileList];

			// 1. Limit the number of uploaded files
			//    Only to show two recent uploaded files, and old ones will be replaced by the new
			// fileList = fileList.slice(-2);

			// 2. read from response and show file link
			fileList = fileList.map(file => {
				if (file.response) {
					// Component will show file.url as link
					file.url = file.response.url;
				}
				return file;
			});

			this.fileList = fileList;
		},
		handleSubmit() {
			this.form.validateFieldsAndScroll((err, values) => {
				console.log(values);
				if (!err) {
					let qs = require("qs");
					let data = {
						employeeId: this.$route.params.id,
						userName: values.userName,
						phone: values.phone,
						organizeId: values.organizeId,
						roleCode: values.roleCode,
						workTypeIds: values.workTypeIds,
						age: values.age,
						gender: values.gender,
						entryTime: this.dateValue,
						workingYear: values.workingYear,
						workingYear: values.workingYear,
						employeeDocDTOList:
							values.EmployeeDocDTO.fileList == undefined
								? values.EmployeeDocDTO
								: values.EmployeeDocDTO.fileList.map(item => {
										return {
											docName: item.name,
											docPosition:
												item.response == undefined
													? item.docPosition
													: item.response.data
										};
								  })
					};
					console.log(data);
					this.Axios(
						{
							url: "/api-platform/employee/update",
							params: data,
							type: "post",
							option: { successMsg: "修改成功！" },
							config: {
								headers: { "Content-Type": "application/json" }
							}
						},
						this
					).then(
						result => {
							if (result.data.code === 200) {
								console.log(result);
								this.$router.back(-1);
							}
						},
						({ type, info }) => {}
					);
				}
			});
		},
		getTreeDataList() {
			this.Axios(
				{
					url: "/api-platform/organize/list",
					params: {},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						this.treeData = result.data.data.map(item => {
							return {
								title: item.organizeName,
								key: item.id,
								value: item.id,
								organizeCode: parseInt(item.organizeCode),
								organizeParentCode: parseInt(item.organizeParentCode),
								disabled: item.organizeParentCode == 0
							};
						});
						let code = Math.min.apply(
							null,
							this.treeData.map(item => {
								return item.organizeParentCode;
							})
						);
						this.treeData = this.filterArray(this.treeData, code);
					}
				},
				({ type, info }) => {}
			);
		},
		filterArray(data, parent) {
			let vm = this;
			var tree = [];
			var temp;
			for (var i = 0; i < data.length; i++) {
				if (data[i].organizeParentCode == parent) {
					var obj = data[i];
					temp = this.filterArray(data, data[i].organizeCode);
					if (temp.length > 0) {
						obj.children = temp;
					}
					tree.push(obj);
				}
			}
			return tree;
		},
		getRoleList() {
			this.Axios(
				{
					url: "/api-sso/role/roleList",
					params: {
						page: 1,
						size: -1
					},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						this.roleList = result.data.data;
					}
				},
				({ type, info }) => {}
			);
		},

		findOne(id) {
			this.Axios(
				{
					url: "/api-platform/employee/details",
					params: {
						employeeId: id
					},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result.data.data);
						this.dateValue = result.data.data.entryTime;
						this.roleCode = result.data.data.roleCode;
						this.getProcessTypesList();
						this.fileList = result.data.data.employeeDocs.map(item => {
							return {
								uid: item.id,
								name: item.docName,
								status: "done",
								docPosition: item.docPosition,
								url: item.docPositionTrueUrl
							};
						});
						setTimeout(() => {
							this.form.setFieldsValue({
								employeeNo: result.data.data.employeeNo,
								userName: result.data.data.userName,
								phone: result.data.data.phone,
								organizeId: result.data.data.organizeId,
								roleCode: result.data.data.roleCode,
								workTypeIds: result.data.data.workType.map(item => item.id),
								age: result.data.data.age,
								gender: result.data.data.gender,
								entryTime:
									result.data.data.entryTime == null
										? undefined
										: moment(result.data.data.entryTime, "YYYY/MM/DD"),
								workingYear: result.data.data.workingYear,
								EmployeeDocDTO: result.data.data.employeeDocs
							});
						}, 100);
					}
				},
				({ type, info }) => {}
			);
		},
		getProcessTypesList() {
			this.Axios(
				{
					url: "/api-platform/workType/listOnAddEmp",
					params: {
						page: 1,
						size: -1,
						roleCode: this.roleCode,
						employeeId: this.$route.params.id
					},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.ProcessTypesList = result.data.data;
						console.log(this.ProcessTypesList);
					}
				},
				({ type, info }) => {}
			);
		},
		getRoleId(id) {
			this.roleCode = id;
			this.form.setFieldsValue({
				workTypeIds: []
			});
			this.getProcessTypesList();
		}
	},
	created() {
		this.getTreeDataList();
		this.getRoleList();
		// this.getProcessTypesList();
		this.findOne(this.$route.params.id);
	}
};
</script>
<style lang="less">
@border: 1px solid #dde2eb;
.edit_employee {
	.content_case {
		padding: 12px 0;
		width: 80%;
		margin-left: 5%;
		h4 {
			padding: 0 14px;
		}
		.ant-divider-horizontal {
			margin: 4px 0;
		}
		.ant-form-item {
			margin-bottom: 20px;
		}
	}
}
</style>