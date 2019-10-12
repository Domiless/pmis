<template>
	<div class="flow_path_add">
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
					<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 18 }" :label="item.label">
						<div class="item_case">
							<a-input
								v-decorator="[
                                'value',
                                {rules: [{ required: true, message: '请填写流程类型' }]}
                                ]"
								maxlength="20"
								placeholder="如：合同审批流程"
							></a-input>
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
										<a-icon type="minus-circle" v-if="index==node.length-1" />
									</a-popover>
								</a-popconfirm>
							</span>
							<span class="add_audit" v-if="item.type==''||item.type==null">选择审批人</span>
							<span v-if="item.type!=''&&item.type!=null">
								<span>{{item.type}}</span>
								<span v-for="(i, index1) in item.typeValue" :key="index1">{{i.name}}</span>
								<a-icon type="form" />
							</span>
						</div>
					</a-form-item>
				</div>
			</template>

			<a-form-item :wrapper-col="{ span: 20,offset: 4 }" style="text-align:right;">
				<permission-button permCode banType="hide" style="margin-right:12px;">取消</permission-button>
				<permission-button type="primary" permCode banType="hide" @click>提交</permission-button>
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
			auditVisible: true,
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
		handleCancel() {
			this.auditVisible == false;
		},
		onDelete(key) {
			this.node.splice(key, 1);
		},
		addNodes() {
			this.num++;
			this.node.push({
				label: "流程节点" + this.num,
				value: "",
				type: "",
				typeValue: [
					{
						name: "",
						id: ""
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
.flow_path_add {
	.item_case {
		position: relative;
		.handle_del_style {
			position: absolute;
			right: -52px;
			top: 0;
			i {
				cursor: pointer;
				font-size: 18px;
				&:hover {
					color: #1890ff;
				}
			}
		}
		.add_audit {
			color: #1890ff;
			cursor: pointer;
			&:hover {
				text-decoration: underline;
			}
		}
	}
}
</style>