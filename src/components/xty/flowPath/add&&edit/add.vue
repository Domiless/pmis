<template>
	<div class="flow_path_add">
		<a-form :form="form">
			<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 18 }" label="流程类型">
				<a-select
					placeholder="请选择"
					optionFilterProp="children"
					v-decorator="[
							'type',
							{rules: [{ required: true, message: '请选择流程类型' }]}
							]"
				>
					<a-select-option :value="1">订单审批</a-select-option>
					<a-select-option :value="2">设计审批</a-select-option>
					<a-select-option :value="3">采购审批</a-select-option>
					<a-select-option :value="4">采购合同审批</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 18 }" label="流程名称">
				<a-input
					v-decorator="[
							'name',
							{rules: [{ required: true, message: '请填写流程名称' }]}
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
						<a-input v-model="item.name" maxlength="20" style="width:564px;"></a-input>
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
							<span @click="addPeopleMsg(index)">选择审批人</span>
						</span>
						<span v-if="item.type!=''&&item.type!=null" class="add_msg">
							<span>{{item.type==1?"已选角色":"已指定成员"}}：</span>
							<span v-if="item.type==2">
								<span
									v-for="(i, index1) in item.candidateUsers"
									style="color:#1890ff"
									:key="index1"
								>{{i.name+" "}}</span>
							</span>
							<span v-if="item.type==1" style="color:#1890ff">{{item.candidateGroups.label}}</span>
							<a-icon type="form" @click="addPeopleMsg(index)" />
						</span>
					</div>
				</div>
			</template>

			<a-form-item :wrapper-col="{ span: 20,offset: 4 }" style="text-align:right;">
				<permission-button permCode banType="hide" style="margin-right:12px;" @click="quexiao">取消</permission-button>
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
			<addPeople v-on:getAuditor="getAuditor" ref="addPeoplePage"></addPeople>
		</a-modal>
	</div>
</template>
<script>
import addPeople from "./addPeople";
export default {
	data() {
		return {
			nodeIndex: null,
			auditVisible: false,
			form: this.$form.createForm(this),
			node: [
				{
					label: "流程节点1",
					name: "",
					type: "",
					candidateUsers: [
						{
							name: "",
							id: ""
						}
					],
					candidateGroups: {
						roleCode: "",
						label: ""
					}
				}
			],
			num: 1
		};
	},
	methods: {
		quexiao() {
			this.form.resetFields();
			this.node = [
				{
					label: "流程节点1",
					name: "",
					type: "",
					candidateUsers: [
						{
							name: "",
							id: ""
						}
					],
					candidateGroups: {
						roleCode: "",
						label: ""
					}
				}
			];
			this.$emit("addCancel");
		},
		getAuditor(params) {
			console.log(params);
			if (params.value.type == 2) {
				this.node[this.nodeIndex].candidateGroups = {};
				this.node[this.nodeIndex].candidateUsers = [];
				this.node[this.nodeIndex].type = params.value.type;
				this.node[this.nodeIndex].candidateUsers = params.value.candidateUsers;
				this.auditVisible = false;
			}
			if (params.value.type == 1) {
				this.node[this.nodeIndex].candidateGroups = {};
				this.node[this.nodeIndex].candidateUsers = [];
				this.node[this.nodeIndex].type = params.value.type;
				this.node[this.nodeIndex].candidateGroups =
					params.value.candidateGroups;
				this.auditVisible = false;
			}
			if (params.value.type == 3) {
				this.auditVisible = false;
			}
		},
		add() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					console.log(values);
					console.log(this.node);
					if (
						this.node
							.map(item => {
								return item.name != "" && item.name != null;
							})
							.find(item => item == false) != undefined
					) {
						this.$message.error(`请填写节点名称`);
					} else if (
						this.node
							.map(item => {
								return item.type != "" && item.type != null;
							})
							.find(item => item == false) != undefined
					) {
						this.$message.error(`请选择审批人`);
					} else {
						let qs = require("qs");
						let data = {
							name: values.name,
							type: values.type,
							userTask: this.node.map(item => {
								return {
									name: item.name,
									type: item.type,
									groups: {
										roleCode: item.candidateGroups.key,
										label: item.candidateGroups.label
									},
									users: item.candidateUsers
								};
							})
						};
						this.Axios(
							{
								url: "/api-order/activiti/addProcess",
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
									this.$emit("addCancel", {});
									this.form.resetFields();
									this.node = [
										{
											label: "流程节点1",
											name: "",
											type: "",
											candidateUsers: [
												{
													name: "",
													id: ""
												}
											],
											candidateGroups: {
												roleCode: "",
												label: ""
											}
										}
									];
								}
							},
							({ type, info }) => {}
						);
					}
				}
			});
		},
		addPeopleMsg(index) {
			this.nodeIndex = index;
			this.auditVisible = true;
		},
		handleCancel() {
			this.auditVisible = false;
			this.$refs.addPeoplePage.cancel();
		},
		onDelete(key) {
			this.node.splice(key, 1);
			this.num--;
		},
		addNodes() {
			this.num++;
			this.node.push({
				label: "流程节点" + this.num,
				name: "",
				type: "",
				candidateUsers: [
					{
						name: "",
						id: ""
					}
				],
				candidateGroups: {
					roleCode: "",
					label: ""
				}
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