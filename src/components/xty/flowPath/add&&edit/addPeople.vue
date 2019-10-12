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
				<a-tree-select
					v-decorator="[
							'roleValue',
							{rules: [{ required: true, message: '请填写流程类型' }]}
							]"
					allowClear
					style="width: 100%"
					:dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
					:treeData="treeData"
					placeholder="Please select"
					treeDefaultExpandAll
					@change="treeSelect"
				></a-tree-select>
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
							placeholder="Please select"
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
								<span>{{item.name}}</span>
								<a-icon type="close-circle" />
							</li>
						</ul>
					</a-col>
				</a-col>
			</a-form-item>
			<a-form-item :wrapper-col="{ span: 20,offset: 4 }" style="text-align:right;">
				<permission-button permCode banType="hide" style="margin-right:12px;">取消</permission-button>
				<permission-button type="primary" permCode banType="hide" @click>提交</permission-button>
			</a-form-item>
		</a-form>
	</div>
</template>
<script>
import { TreeSelect } from "ant-design-vue";

const columns = [
	{
		dataIndex: "name",
		title: "名称",
		width: "45%",
		key: "name"
	},
	{
		dataIndex: "description",
		title: "职能/工种",
		width: "50%",
		key: "description"
	}
];
const treeData = [
	{
		title: "Node1",
		value: "0-0",
		key: "0-0",
		children: [
			{
				title: "Child Node1",
				value: "0-0-0",
				key: "0-0-0"
			}
		]
	},
	{
		title: "Node2",
		value: "0-1",
		key: "0-1",
		children: [
			{
				title: "Child Node3",
				value: "0-1-0",
				key: "0-1-0",
				disabled: true
			},
			{
				title: "Child Node4",
				value: "0-1-1",
				key: "0-1-1"
			},
			{
				title: "Child Node5",
				value: "0-1-2",
				key: "0-1-2"
			}
		]
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
			treeData,
			form: this.$form.createForm(this)
		};
	},
	methods: {
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
			console.log(e.target.value);
		},
		treeSelect(e) {
			this.roleValue = e;
			console.log(e);
		},
		tableTreeselect(e) {
			console.log(e);
		}
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