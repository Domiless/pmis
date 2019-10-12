<template>
	<div class="flow_path_edit">
		<a-form :form="form">
			<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 18 }" label="流程类型">
				<a-input
					v-decorator="[
							'type',
							{rules: [{ required: true, message: '请填写流程类型' }]}
							]"
					maxlength="20"
				></a-input>
			</a-form-item>
			<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 18 }" label="流程名称">
				<a-input
					v-decorator="[
							'name',
							{rules: [{ required: true, message: '请填写流程类型' }]}
							]"
					maxlength="20"
					placeholder="如：合同审批流程"
				></a-input>
			</a-form-item>
			<template>
				<div v-for="(item, index) in node" :key="index">
					<div class="item_case">
						<span class="form_item_label">
							<span style="color:#F5222D;font-weight:600">*</span>
							{{item.label}}：
						</span>
						<a-input v-model="item.value" maxlength="20" style="width:564px;"></a-input>
						<span class="handle_del_style">
							<a-icon
								type="plus-circle"
								style="margin-right:4px"
								@click="addNodes"
								v-if="index==node.length-1"
							/>
							<a-popconfirm title="确定删除吗？" @confirm="onDelete(index)" okText="确定" cancelText="取消">
								<a-popover placement="top">
									<template slot="content">
										<span>删除</span>
									</template>
									<a-icon type="minus-circle" v-if="index==node.length-1&&index!=0" />
								</a-popover>
							</a-popconfirm>
						</span>
						<span class="add_audit" v-if="item.type==''||item.type==null">
							<span @click="addPeopleMsg">选择审批人</span>
						</span>
						<span v-if="item.type!=''&&item.type!=null" class="add_msg">
							<span>{{item.type}}：</span>
							<span v-for="(i, index1) in item.typeValue" :key="index1">{{i.name}}</span>
							<a-icon type="form" />
						</span>
					</div>
				</div>
			</template>

			<a-form-item :wrapper-col="{ span: 20,offset: 4 }" style="text-align:right;">
				<permission-button permCode banType="hide" style="margin-right:12px;">取消</permission-button>
				<permission-button type="primary" permCode banType="hide" @click="add">提交</permission-button>
			</a-form-item>
		</a-form>
		<a-modal
			title="选择审批人"
			:footer="null"
			width="800px"
			:visible="auditVisible"
			@cancel="handleCancel()"
			:maskClosable="false"
		>
			<addPeople></addPeople>
		</a-modal>
	</div>
</template>
<script>
import addPeople from "./addPeople";
export default {
	data() {
		return {
			auditVisible: false,
			form: this.$form.createForm(this),
			node: [
				{
					label: "流程节点1",
					value: "",
					type: "",
					typeValue: [
						{
							name: "",
							id: ""
						}
					]
				}
			],
			num: 1
		};
	},
	methods: {
		add() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					console.log(values);
				}
			});
		},
		addPeopleMsg() {
			this.auditVisible = true;
		},
		handleCancel() {
			this.auditVisible = false;
		},
		onDelete(key) {
			this.node.splice(key, 1);
			this.num--;
		},
		addNodes() {
			this.num++;
			this.node.push({
				label: "流程节点" + this.num,
				value: "",
				type: "222",
				typeValue: [
					{
						name: "222",
						id: "11"
					}
				]
			});
		}
	},
	components: {
		addPeople
	}
};
</script>
<style lang="less">
.flow_path_edit {
	.item_case {
		.ant-input {
			position: relative;
			left: -4px;
		}
		position: relative;
		.handle_del_style {
			width: 44px;
			position: absolute;
			right: 8px;
			top: 7px;
			i {
				cursor: pointer;
				font-size: 18px;
				&:hover {
					color: #1890ff;
				}
			}
		}
		.add_audit {
			display: block;
			color: #1890ff;
			padding-left: 125px;
			line-height: 32px;
			span {
				cursor: pointer;
				&:hover {
					text-decoration: underline;
				}
			}
		}
		.add_msg {
			padding-left: 125px;
			line-height: 32px;
			i {
				cursor: pointer;
				margin-left: 12px;
				&:hover {
					color: #1890ff;
				}
			}
		}
		.form_item_label {
			width: 125px;
			display: inline-block;
			text-align: right;
			padding-right: 2px;
		}
	}
}
</style>