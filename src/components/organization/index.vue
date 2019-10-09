<template>
	<div class="organization">
		<a-tree :treeData="treeData" v-if="treeData.length" autoExpandParent defaultExpandAll>
			<template slot="title" slot-scope="item">
				<span class="item_case">
					{{item.title}}
					&nbsp;&nbsp;&nbsp;&nbsp;
					<span class="show_icon" @click.stop>
						<!-- <a-popover placement="top">
							<template slot="content">
								<span>添加同级</span>
							</template>
							<a-icon
								class="icon_style"
								type="plus"
								@click="modalEquativeShow(item)"
								v-if="item.organizeParentCode!=0"
							/>
						</a-popover>&nbsp;&nbsp;-->
						<a-popover placement="top">
							<template slot="content">
								<span>添加子级</span>
							</template>
							<permission-button
								permCode="system_org_lookup.system_orginaze_add"
								banType="hide"
								class="button_text"
								@click="modalSublevelShow(item)"
							>
								<a-icon class="icon_style" type="plus-circle" />
							</permission-button>
						</a-popover>&nbsp;&nbsp;
						<a-popover placement="top">
							<template slot="content">
								<span>修改</span>
							</template>
							<permission-button
								permCode="system_org_lookup.system_orginaze_update"
								banType="hide"
								class="button_text"
								v-if="item.organizeParentCode!=0"
								@click="modalEditShow(item)"
							>
								<a-icon class="icon_style" type="edit" />
							</permission-button>
						</a-popover>&nbsp;&nbsp;
						<a-popconfirm title="确定删除吗?" @confirm="onDelete(item)">
							<a-popover placement="top">
								<template slot="content">
									<span>删除</span>
								</template>
								<permission-button
									permCode="system_org_lookup.system_orginaze_delete"
									banType="hide"
									class="button_text"
									v-if="item.organizeParentCode!=0"
								>
									<a-icon class="icon_style" type="delete" />
								</permission-button>
							</a-popover>
						</a-popconfirm>
					</span>
				</span>
			</template>
		</a-tree>
		<a-modal
			title="新增同级"
			:maskClosable="false"
			centered
			v-model="modalEquativeVisible"
			@ok="() => modalEquativeVisible = false"
			@cancel="form.resetFields()"
		>
			<a-form :form="form">
				<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 20 }" label="分类名称">
					<a-input
						maxlength="20"
						v-decorator="['processName',{rules: [{ required: true, message: '请填写分类名称' }]}]"
					></a-input>
				</a-form-item>
			</a-form>
		</a-modal>
		<a-modal
			title="新增子级"
			:maskClosable="false"
			centered
			v-model="modalSublevelVisible"
			@ok="() => handleSubmit(1)"
			@cancel="form.resetFields()"
		>
			<a-form :form="form" @keyup.enter.native="handleSubmit(1)">
				<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 20 }" label="分类名称">
					<a-input
						maxlength="20"
						v-decorator="['processName',{rules: [{ required: true, message: '请填写分类名称' }]}]"
					></a-input>
				</a-form-item>
			</a-form>
		</a-modal>
		<a-modal
			title="修改"
			:maskClosable="false"
			centered
			v-model="modalEditVisible"
			@ok="() => handleSubmit(2)"
			@cancel="form.resetFields()"
		>
			<a-form :form="form" @keyup.enter.native="handleSubmit(2)">
				<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 20 }" label="分类名称">
					<a-input
						maxlength="20"
						v-decorator="['processName',{rules: [{ required: true, message: '请填写分类名称' }]}]"
					></a-input>
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>
<script>
import Vue from "vue";
import {
	Tree,
	Form,
	Input,
	Modal,
	Popconfirm,
	Popover,
	Icon
} from "ant-design-vue";
Vue.use(Popconfirm);
Vue.use(Tree);
Vue.use(Popover);
Vue.use(Input);
Vue.use(Modal);
Vue.use(Form);
Vue.use(Icon);

export default {
	data() {
		return {
			form: this.$form.createForm(this),
			modalEquativeVisible: false,
			modalSublevelVisible: false,
			modalEditVisible: false,
			treeData: [],
			rowData: {}
		};
	},
	methods: {
		onDelete(row) {
			this.rowData = row;
			this.delOrganization();
		},
		handleSubmit(a) {
			if (a == 1) {
				this.form.validateFieldsAndScroll((err, values) => {
					if (!err) {
						console.log(values);
						this.addOrganization(values);
					}
				});
			}
			if (a == 2) {
				this.form.validateFieldsAndScroll((err, values) => {
					if (!err) {
						console.log(values);
						// this.addOrganization(values);
						this.updeteOrganization(values);
					}
				});
			}
		},
		modalEditShow(value) {
			this.rowData = value;
			console.log(this.rowData);
			this.modalEditVisible = true;
			setTimeout(() => {
				this.form.setFieldsValue({
					processName: value.title
				});
			}, 100);
		},
		modalSublevelShow(value) {
			this.rowData = value;
			this.modalSublevelVisible = true;
		},
		addOrganization(row) {
			let qs = require("qs");
			let data = qs.stringify({
				parentId: this.rowData.key,
				organizeInfo: row.processName,
				organizeName: row.processName
			});
			this.Axios(
				{
					url: "/api-platform/organize/addOrganize",
					params: data,
					type: "post",
					option: { successMsg: "添加成功！" }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						this.modalSublevelVisible = false;
						this.getList();
						this.form.resetFields();
					}
				},
				({ type, info }) => {}
			);
		},
		delOrganization() {
			let qs = require("qs");
			let data = qs.stringify({
				organizeId: this.rowData.key
			});
			this.Axios(
				{
					url: "/api-platform/organize/del",
					params: data,
					type: "post",
					option: { successMsg: "删除成功！" }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						this.getList();
					}
				},
				({ type, info }) => {}
			);
		},
		updeteOrganization(row) {
			let qs = require("qs");
			let data = qs.stringify({
				organizeId: this.rowData.key,
				organizeInfo: row.processName,
				organizeName: row.processName
			});
			this.Axios(
				{
					url: "/api-platform/organize/update",
					params: data,
					type: "post",
					option: { successMsg: "修改成功！" }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						this.getList();
						this.form.resetFields();
						this.modalEditVisible = false;
					}
				},
				({ type, info }) => {}
			);
		},
		getList() {
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
								organizeCode: parseInt(item.organizeCode),
								organizeParentCode: parseInt(item.organizeParentCode),
								scopedSlots: { title: "title" }
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
		}
	},
	created() {
		this.getList();
	}
};
</script>
<style lang="less">
@border: 1px solid #dde2eb;
.organization {
	.ant-tree li .ant-tree-node-content-wrapper {
		line-height: 32px;
		height: 32px;
		cursor: default;
	}
	.ant-tree-node-content-wrapper {
		width: 98%;
		display: inline-block;
		&:hover {
			.show_icon {
				display: inline-block;
			}
		}
	}
	.item_case {
		width: 100%;
		.show_icon {
			display: none;
			padding: 0 4px;
			.icon_style {
				font-size: 14px;
				cursor: pointer;
			}
		}
	}
}
</style>
