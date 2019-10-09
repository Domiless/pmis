<template>
	<div class="add_employee">
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
							{rules: [{ required: true, message: '请填写员工编号' },{validator: chickNo}]}
							]"
							maxlength="10"
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
							maxlength="11"
							oninput="if(value.length>11)value=value.slice(0,11)"
							v-decorator="[
							'phone',
							{rules: [{ required: true, message: '请填写手机号码' },{validator: chickPhone}]}
							]"
							type="number"
						></a-input>
					</a-form-item>
					<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="初始密码">
						<a-input
							maxlength="20"
							v-decorator="[
							'password',
							{rules: [{ required: true, message: '请填写初始密码' },{validator: chickPassword}]}
							]"
							type="password"
							placeholder="6~20个字符组成，区分大小写"
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
							permCode="employee_add_lookup.employee_add_save"
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
import md5 from "js-md5/src/md5.js";
import CryptoJS from "crypto-js/crypto-js.js";
const treeData = [];
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
		chickNo(rule, value, callback) {
			if (
				/^[a-zA-Z0-9]{1,10}$/.test(value) == false &&
				value != "" &&
				value != null
			) {
				callback(new Error("请输入1到10位字母或数字的员工编号"));
			} else {
				callback();
			}
		},
		chickPassword(rule, value, callback) {
			var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
			if (
				/^((?=.*[a-z])|(?=.*\d)|(?=.*[#@!~%^&*]))[a-z\d#@!$~%^&*]{6,20}$/i.test(
					value
				) === false &&
				value != "" &&
				value != null
			) {
				callback(new Error("请输入6到20位的密码"));
			} else if (/(\w)*(\w)\2{5}(\w)*/g.test(value) === true) {
				callback(
					new Error("你的密码过于简单(不能含有连续6位相同的字符或者数字)")
				);
			} else if (reg.test(value) === true && value != "" && value != null) {
				callback(new Error("密码中不能含有汉字"));
			} else {
				callback();
			}
		},
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
			console.log(date, dateString);
			this.dateValue = dateString;
		},
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
					values.password = md5(values.password);
					let key = "*chang_hong_device_cloud";
					values.password = this.encryptByDES(values.password, key);
					let qs = require("qs");
					let data = {
						employeeNo: values.employeeNo,
						userName: values.userName,
						phone: values.phone,
						password: values.password,
						organizeId: values.organizeId,
						roleCode: values.roleCode,
						workTypeIds: values.workTypeIds,
						age: values.age,
						gender: values.gender,
						entryTime: this.dateValue,
						workingYear: values.workingYear,
						workingYear: values.workingYear,
						employeeDocDTOList:
							values.EmployeeDocDTO != undefined
								? values.EmployeeDocDTO.fileList.map(item => {
										return {
											docName: item.name,
											docPosition: item.response.data
										};
								  })
								: []
					};
					this.Axios(
						{
							url: "/api-platform/employee/addEmployee",
							params: data,
							type: "post",
							option: { successMsg: "添加成功！" },
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
						console.log(result);
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
						console.log(result.data.data);
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
						roleCode: this.roleCode
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
		this.getProcessTypesList();
	}
};
</script>
<style lang="less">
@border: 1px solid #dde2eb;
.add_employee {
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