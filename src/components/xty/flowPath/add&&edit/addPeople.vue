<template>
	<div class="add_people">
		<a-form :form="form">
			<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 18 }" label="审批人类型">
				<a-radio-group
					@change="radioChange"
					v-decorator="[
							'type',
							{rules: [{ required: true, message: '请填写流程类型' }],initialValue:1}
							]"
				>
					<a-radio :value="1">角色</a-radio>
					<a-radio :value="2">指定成员</a-radio>
				</a-radio-group>
			</a-form-item>
			<a-form-item
				:label-col=" { span: 4 }"
				:wrapper-col="{ span: 18 }"
				label="角色列表"
				v-if="radioValue==1"
			>
				<a-select
					showSearch
					labelInValue
					placeholder="请选择"
					optionFilterProp="children"
					v-decorator="[
							'roleCode',
							{rules: [{ required: true, message: '请选择角色' }]}
							]"
				>
					<a-select-option
						v-for="(item, index) in roleList"
						:key="index"
						:value="item.roleCode"
					>{{item.name}}</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item
				v-if="radioValue==2"
				:label-col=" { span: 4 }"
				:wrapper-col="{ span: 18 }"
				label="选择人员"
			>
				<a-col :span="12" class="table_case">
					<a-col :span="24">
						<a-tree-select
							allowClear
							style="width: 100%"
							:dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
							:treeData="treeData"
							placeholder="请选择"
							treeDefaultExpandAll
							@change="tableTreeselect"
						></a-tree-select>
					</a-col>
					<a-col :span="24">
						<a-table
							:scroll="{ y: 300 }"
							size="small"
							:columns="columns"
							:pagination="false"
							:dataSource="data"
							:rowSelection="{selectedRowKeys:selectedRowKeys,onChange: onSelectChange}"
							rowKey="id"
						></a-table>
					</a-col>
				</a-col>
				<a-col :span="12" class="value_case">
					<a-col :span="24">
						<ul>
							<h4>已选：</h4>
							<li v-for="(item, index) in selectedRows" :key="index">
								<span>{{item.userName}}</span>
								<a-icon type="close-circle" @click="delUserId(index)" />
							</li>
						</ul>
					</a-col>
				</a-col>
			</a-form-item>
			<a-form-item :wrapper-col="{ span: 20,offset: 4 }" style="text-align:right;">
				<permission-button permCode banType="hide" style="margin-right:12px;" @click="cancel">取消</permission-button>
				<permission-button type="primary" permCode banType="hide" @click="getMsg">提交</permission-button>
			</a-form-item>
		</a-form>
	</div>
</template>
<script>
import { TreeSelect } from "ant-design-vue";

const columns = [
	{
		dataIndex: "userName",
		title: "名称",
		width: "45%",
		key: "userName"
	},
	{
		dataIndex: "workTypeName",
		title: "职能/工种",
		width: "50%",
		key: "workTypeName"
	}
];

export default {
	data() {
		return {
			roleValue: "",
			radioValue: 1,
			data: [
				{
					name: "张三",
					description: "钳工",
					id: 1
				},
				{
					name: "张三",
					description: "钳工",
					id: 2
				},
				{
					name: "张三",
					description: "钳工",
					id: 3
				},
				{
					name: "张三",
					description: "钳工",
					id: 4
				},
				{
					name: "张三",
					description: "钳工",
					id: 5
				},
				{
					name: "张三",
					description: "钳工",
					id: 6
				},
				{
					name: "张三",
					description: "钳工",
					id: 7
				},
				{
					name: "张三",
					description: "钳工",
					id: 8
				},
				{
					name: "张三",
					description: "钳工",
					id: 9
				}
			],
			columns,
			value: "",
			selectedRowKeys: [],
			selectedRows: [],
			treeData: [],
			form: this.$form.createForm(this),
			roleList: [],
			organizeId: ""
		};
	},
	methods: {
		cancel() {
			this.selectedRowKeys = [];
			this.selectedRows = [];
			this.radioValue = 1;
			this.form.resetFields();
			let params = {
				value: {
					type: 3
				}
			};
			this.$emit("getAuditor", params);
		},
		getMsg() {
			this.form.validateFieldsAndScroll((err, values) => {
				console.log(values);
				if (!err) {
					let userTask;
					if (values.type == 1) {
						userTask = {
							type: values.type,
							candidateGroups: values.roleCode
						};
					}
					if (values.type == 2) {
						if (this.selectedRows.length < 1) {
							this.$message.error(`请选择人员`);
							return false;
						}
						userTask = {
							type: values.type,
							candidateUsers: this.selectedRows.map(item => {
								return {
									id: item.id,
									name: item.userName
								};
							})
						};
					}
					let params = {
						value: userTask,
						visible: false
					};
					this.$emit("getAuditor", params);
					this.selectedRowKeys = [];
					this.selectedRows = [];
					this.radioValue = 1;
					this.form.resetFields();
					this.organizeId = "";
					this.getEmployeeList();
				}
			});
		},
		delUserId(index) {
			this.selectedRowKeys.splice(index, 1);
			this.selectedRows.splice(index, 1);
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
		onChange(value) {
			console.log("onChange ", value);
			this.value = value;
		},
		onSelectChange(selectedRowKeys, a) {
			this.selectedRowKeys = selectedRowKeys;
			this.selectedRows = a;
			console.log(a);
		},
		radioChange(e) {
			this.radioValue = e.target.value;
			this.selectedRowKeys = [];
			this.selectedRows = [];
			console.log(e.target.value);
		},
		treeSelect(e) {
			this.roleValue = e;
			console.log(e);
		},
		tableTreeselect(e) {
			console.log(e);
			this.organizeId = e != undefined ? e : "";
			this.selectedRowKeys = [];
			this.selectedRows = [];
			this.getEmployeeList();
		},
		getEmployeeList() {
			this.Axios(
				{
					url: "/api-platform/employee/organize?organizeId=" + this.organizeId,
					params: {},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.data = result.data.data;

						for (let i = 0; i < this.data.length; i++) {
							this.data[i].workTypeName = "";
							for (let j = 0; j < this.data[i].workType.length; j++) {
								this.data[i].workTypeName +=
									this.data[i].workType[j].workTypeName +
									(j == this.data[i].workType.length - 1 ? "" : "、");
							}
						}
					}
				},
				({ type, info }) => {}
			);
		}
	},
	created() {
		this.getTreeDataList();
		this.getRoleList();
		this.getEmployeeList();
	}
};
</script>
<style lang="less">
.add_people {
	.table_case {
		background-color: #fafafa;
		padding: 8px;
		border-radius: 4px;
		height: 395px;
		overflow: hidden;
	}
	.value_case {
		padding: 0px 12px;
		border-radius: 8px;
		height: 395px;
		overflow: hidden;
		ul {
			height: 395px;
			overflow-y: auto;
			background-color: #fafafa;
			border-radius: 4px;
			padding: 0 4px;
			li {
				list-style-type: none;
				padding: 0 4px;
				position: relative;
				&:hover {
					background-color: #e6f7ff;
				}
				i {
					position: absolute;
					right: 12px;
					top: 12px;
					cursor: pointer;
					&:hover {
						color: #1890ff;
					}
				}
			}
		}
	}
}
</style>