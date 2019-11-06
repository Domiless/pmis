<template>
	<div class="message_case">
		<a-row>
			<div style="line-height:50px;">
				<a-col :span="24">
					<!-- <a-button type="primary" @click="$router.push({path:'/Employee/AddEmployee'})">
								<a-icon type="plus-circle"/>添加
					</a-button>-->
					<permission-button
						permCode="message_lookup.message_add"
						banType="hide"
						@click="addVisible = true;"
					>
						<a-icon style="color:#1890ff;" type="plus" />新增
					</permission-button>
					<permission-button
						permCode="message_lookup.message_update"
						banType="hide"
						@click="findOne"
						:disabled="selectedRowKeys.length!=1"
					>
						<a-icon style="color:#1890ff;" type="edit" />修改
					</permission-button>
					<permission-button
						permCode="message_lookup.message_delete"
						banType="hide"
						@click="showDeleteConfirm"
						:disabled="selectedRowKeys.length!=1"
					>
						<a-icon style="color:#1890ff;" type="delete" />删除
					</permission-button>
				</a-col>
			</div>
		</a-row>
		<a-row style="padding-top:10px;">
			<a-table
				:columns="columns"
				:pagination="false"
				:dataSource="data"
				:rowSelection="{selectedRowKeys:selectedRowKeys,onChange: onSelectChange}"
				rowKey="id"
			></a-table>
			<a-pagination
				style="padding-top:12px;text-align: right;"
				showQuickJumper
				:defaultCurrent="current"
				:total="total"
				@change="onChange"
				showSizeChanger
				:pageSizeOptions="['10','20','30']"
				@showSizeChange="onShowSizeChange"
				:showTotal="total => `共 ${total} 条`"
			/>
		</a-row>
		<a-modal
			title="新增"
			:maskClosable="false"
			centered
			width="850px"
			:visible="addVisible"
			:footer="null"
			@cancel="cancel(1)"
		>
			<a-form :form="form">
				<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="分类">
					<!-- <a-input v-decorator="['workType',{rules: [{ required: true, message: '请选择分类' }]}]"></a-input> -->
					<a-select v-decorator="['type',{rules: [{ required: true, message: '请选择分类' }]}]">
						<a-select-option value="公告">公告</a-select-option>
						<a-select-option value="产品">产品</a-select-option>
						<a-select-option value="其他">其他</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="标题">
					<a-input
						maxlength="20"
						v-decorator="['title',{rules: [{ required: true, message: '请填写标题' }]}]"
					></a-input>
				</a-form-item>
				<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="内容">
					<editor v-on:tinymceValue="tinymceValue" ref="addEditor"></editor>
				</a-form-item>
				<a-form-item :wrapper-col="{ span: 22,offset: 2 }" style="text-align:right;">
					<a-button @click="cancel(1)" style="margin-right:12px;">取消</a-button>
					<a-button type="primary" @click="add">提交</a-button>
				</a-form-item>
			</a-form>
		</a-modal>
		<a-modal
			title="修改 "
			:maskClosable="false"
			centered
			width="850px"
			:visible="editVisible"
			:footer="null"
			@cancel="cancel(2)"
		>
			<a-form :form="form">
				<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="分类">
					<!-- <a-input v-decorator="['workType',{rules: [{ required: true, message: '请选择分类' }]}]"></a-input> -->
					<a-select v-decorator="['type',{rules: [{ required: true, message: '请选择分类' }]}]">
						<a-select-option :value="1">公告</a-select-option>
						<a-select-option :value="2">产品</a-select-option>
						<a-select-option :value="3">其他</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="标题">
					<a-input
						maxlength="20"
						v-decorator="['title',{rules: [{ required: true, message: '请填写标题' }]}]"
					></a-input>
				</a-form-item>
				<a-form-item :label-col=" { span: 2 }" :wrapper-col="{ span: 21 }" label="内容">
					<editor v-on:tinymceValue="tinymceValue" :value="editorValue" ref="edirEditor"></editor>
				</a-form-item>
				<a-form-item :wrapper-col="{ span: 22,offset: 2 }" style="text-align:right;">
					<a-button @click="cancel(2)" style="margin-right:12px;">取消</a-button>
					<a-button type="primary" @click="edit">提交</a-button>
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>
<script>
import editor from "../public/Editor";
const columns = [
	{
		dataIndex: "type",
		title: "分类",
		width: "20%",
		key: "type"
	},
	{
		dataIndex: "title",
		title: "标题",
		width: "55%",
		key: "title"
	},
	{
		dataIndex: "gmtCreated",
		key: "gmtCreated",
		title: "发布时间",
		width: "20%"
	}
];
export default {
	data() {
		return {
			editorValue: "",
			editVisible: false,
			addVisible: false,
			columns,
			selectedRowKeys: [],
			selectedRows: [],
			data: [
				{
					type: "公告",
					title: "公告",
					time: "公告"
				}
			],
			current: 1,
			pageSize: 10,
			total: 0,
			form: this.$form.createForm(this),
			content: ""
		};
	},
	methods: {
		tinymceValue(params) {
			this.content = params;
			// console.log(params);
		},
		cancel(a) {
			if (a == 1) {
				this.form.resetFields();
				this.addVisible = false;
				this.editorValue = "";
				this.$refs.addEditor.clearValue();
			}
			if (a == 2) {
				this.form.resetFields();
				this.editVisible = false;
				this.editorValue = "";
				this.$refs.edirEditor.clearValue();
			}
		},
		onShowSizeChange(current, pageSize) {
			this.pageSize = pageSize;
			this.current = 1;
			this.getList();
		},
		onChange(current, pageNumber) {
			console.log("Page: ", pageNumber);
			console.log("第几页: ", current);
			this.current = current;
			this.getList();
		},
		onSelectChange(selectedRowKeys, b) {
			this.selectedRowKeys = selectedRowKeys;
			this.selectedRows = b;
			console.log(b);
		},
		showDeleteConfirm() {
			let that = this;
			this.$confirm({
				title: "确定删除吗?",
				content: "",
				okText: "确定",
				okType: "danger",
				cancelText: "取消",
				onOk: function() {
					that.onDelete();
				},
				onCancel() {}
			});
		},
		onDelete() {
			let qs = require("qs");
			let data = qs.stringify({
				id: this.selectedRowKeys[0]
			});
			this.Axios(
				{
					url: "/api-order/message/delete",
					params: data,
					type: "post",
					option: { successMsg: "删除成功！" }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						this.getList();
						this.selectedRowKeys = [];
						this.selectedRows = [];
					}
				},
				({ type, info }) => {}
			);
		},
		findOne() {
			this.Axios(
				{
					url: "/api-order/message/findOne",
					params: {
						id: this.selectedRowKeys[0]
					},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.editorValue = result.data.data.content;
						this.content = result.data.data.content;
						setTimeout(() => {
							this.form.setFieldsValue({
								type: result.data.data.type,
								title: result.data.data.title
							});
						}, 100);
						this.editVisible = true;
					}
				},
				({ type, info }) => {}
			);
		},
		getList() {
			this.Axios(
				{
					url: "/api-order/message/list",
					params: {
						page: this.current,
						size: this.pageSize
					},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.data = result.data.data.content;
						this.total = result.data.data.totalElement;
						this.selectedRowKeys = [];
						this.selectedRows = [];
					}
				},
				({ type, info }) => {}
			);
		},
		add() {
			this.form.validateFieldsAndScroll((err, values) => {
				console.log(values);
				if (!err) {
					let qs = require("qs");
					let data = qs.stringify({
						title: values.title,
						type: values.type,
						content: this.content
					});
					this.Axios(
						{
							url: "/api-order/message/add",
							params: data,
							type: "post",
							option: { successMsg: "保存成功" }
						},
						this
					).then(
						result => {
							if (result.data.code === 200) {
								console.log(result);
								this.getList();
								this.form.resetFields();
								this.addVisible = false;
								this.editorValue = "";
								this.$refs.addEditor.clearValue();
							}
						},
						({ type, info }) => {}
					);
				}
			});
		},
		edit() {
			this.form.validateFieldsAndScroll((err, values) => {
				console.log(values);
				if (!err) {
					let qs = require("qs");
					let data = qs.stringify({
						id: this.selectedRowKeys[0],
						title: values.title,
						type: values.type,
						content: this.content
					});
					this.Axios(
						{
							url: "/api-order/message/update",
							params: data,
							type: "post",
							option: { successMsg: "修改成功" }
						},
						this
					).then(
						result => {
							if (result.data.code === 200) {
								console.log(result);
								this.getList();
								this.form.resetFields();
								this.editVisible = false;
								this.editorValue = "";
								this.$refs.addEditor.clearValue();
								this.content = "";
							}
						},
						({ type, info }) => {}
					);
				}
			});
		}
	},
	created() {
		this.getList();
	},
	components: {
		editor
	}
};
</script>
<style lang="less">
.message_case {
	overflow: hidden;
}
</style>