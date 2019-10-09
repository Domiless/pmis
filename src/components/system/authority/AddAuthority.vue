<template>
	<div class="add_authority">
		<a-row style="line-height:50px;">
			<a-button @click="$router.back(-1)" icon="left">返回</a-button>
		</a-row>
		<a-row>
			<div class="content_case">
				<a-form :form="form" @keyup.enter.native="addRole">
					<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="角色名称">
						<a-input
							v-decorator="[
							'name',
							{rules: [{ required: true, message: '请填写角色名称' }]}
							]"
							maxlength="20"
						></a-input>
					</a-form-item>
					<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="备注">
						<a-textarea
							maxlength="50"
							v-decorator="['description']"
							placeholder
							:autosize="{ minRows: 4, maxRows: 4 }"
						/>
					</a-form-item>
					<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 22 }" label="权限分配">
						<a-tree
							checkable
							@expand="onExpand"
							:expandedKeys="expandedKeys"
							:autoExpandParent="autoExpandParent"
							v-model="checkedKeys"
							:selectedKeys="selectedKeys"
							:treeData="treeData"
						/>
					</a-form-item>
					<a-form-item :wrapper-col="{ span: 22,offset: 2 }">
						<permission-button
							permCode="role_add_lookup.role_add_save"
							banType="hide"
							type="primary"
							@click="addRole()"
						>提交</permission-button>
					</a-form-item>
				</a-form>
			</div>
		</a-row>
	</div>
</template>
<script>
import Vue from "vue";
import { Tree, Col, Row, Form, Input } from "ant-design-vue";
Vue.use(Input);
Vue.use(Tree);
Vue.use(Col);
Vue.use(Row);
Vue.use(Form);
import axios from "axios";
const treeData = [
	{
		title: "0-0",
		key: "0-0",
		children: [
			{
				title: "0-0-0",
				key: "0-0-0",
				children: [
					{ title: "0-0-0-0", key: "0-0-0-0" },
					{ title: "0-0-0-1", key: "0-0-0-1" },
					{ title: "0-0-0-2", key: "0-0-0-2" }
				]
			},
			{
				title: "0-0-1",
				key: "0-0-1",
				children: [
					{ title: "0-0-1-0", key: "0-0-1-0" },
					{ title: "0-0-1-1", key: "0-0-1-1" },
					{ title: "0-0-1-2", key: "0-0-1-2" }
				]
			},
			{
				title: "0-0-2",
				key: "0-0-2"
			}
		]
	},
	{
		title: "0-1",
		key: "0-1",
		children: [
			{ title: "0-1-0-0", key: "0-1-0-0" },
			{ title: "0-1-0-1", key: "0-1-0-1" },
			{ title: "0-1-0-2", key: "0-1-0-2" }
		]
	},
	{
		title: "0-2",
		key: "0-2"
	}
];

export default {
	data() {
		return {
			form: this.$form.createForm(this),
			treeData: [],
			expandedKeys: [],
			autoExpandParent: true,
			checkedKeys: [],
			selectedKeys: []
		};
	},
	methods: {
		onExpand(expandedKeys) {
			console.log("onExpand", expandedKeys);
			this.expandedKeys = expandedKeys;
			this.autoExpandParent = false;
		},
		onCheck(checkedKeys) {
			console.log("onCheck", checkedKeys);
			this.checkedKeys = checkedKeys;
		},
		getRoleList() {
			this.Axios(
				{
					url: "/api-sso/permission/enterprisePermissions",
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
								title: item.permissionName + "(" + item.permissionUrl + ")",
								key: item.id,
								code: parseInt(item.code),
								parentCode: parseInt(item.parentCode)
							};
						});
						let code = Math.min.apply(
							null,
							this.treeData.map(item => {
								return item.parentCode;
							})
						);
						console.log(code);
						this.treeData = this.filterArray(this.treeData, code);
						console.log(this.treeData);
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
				if (data[i].parentCode == parent) {
					var obj = data[i];
					temp = this.filterArray(data, data[i].code);
					if (temp.length > 0) {
						obj.children = temp;
					}
					tree.push(obj);
				}
			}
			return tree;
		},
		addRole() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					// console.log("Received values of form: ", values);
					if (!this.checkedKeys.length) {
						this.$message.error("请分配角色权限");
						return false;
					}
					let qs = require("qs");
					let data = {
						description: values.description,
						name: values.name,
						permissionIds: this.checkedKeys
					};
					this.Axios(
						{
							url: "/api-sso/role/addRole",
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
		}
	},
	created() {
		this.getRoleList();
	}
};
</script>

<style lang="less">
.add_authority {
	.content_case {
		padding: 12px 0;
		width: 80%;
		margin-left: 5%;
		.ant-divider-horizontal {
			margin: 4px 0;
		}
		.ant-form-item {
			margin-bottom: 20px;
		}
	}
}
</style>
