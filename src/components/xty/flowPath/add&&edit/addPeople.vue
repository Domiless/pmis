<template>
	<div class="add_people">
		<a-form :form="form">
			<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 18 }" label="审批人类型">
				<a-input
					v-decorator="[
							'type',
							{rules: [{ required: true, message: '请填写流程类型' }]}
							]"
					maxlength="20"
				></a-input>
			</a-form-item>
			<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 18 }" label="角色列表">
				<a-input
					v-decorator="[
							'type',
							{rules: [{ required: true, message: '请填写流程类型' }]}
							]"
					maxlength="20"
				></a-input>
			</a-form-item>
			<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 18 }" label="选择人员">
				<a-col :span="12">
					<a-col :span="24">
						<a-tree-select
							allowClear
							style="width: 300px"
							:dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
							:treeData="treeData"
							placeholder="Please select"
							treeDefaultExpandAll
							v-model="value"
						></a-tree-select>
					</a-col>
					<a-col :span="24"></a-col>
				</a-col>
				<a-col :span="12"></a-col>
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
			value: ["0-0-0"],
			treeData,
			form: this.$form.createForm(this)
		};
	},
	methods: {
		onChange(value) {
			console.log("onChange ", value);
			this.value = value;
		}
	}
};
</script>