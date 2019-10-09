<template>
	<div class="feedback">
		<div style="line-height:50px;">
			<permission-button
				permCode="advise_list_lookup.advice_reply"
				banType="hide"
				@click="replyShow"
				:disabled="selectedRowKeys.length!=1"
			>
				<a-icon style="color:#1890ff;" type="edit" />回复
			</permission-button>
			<permission-button
				permCode="advise_list_lookup.advice_delete"
				banType="hide"
				@click="showDeleteConfirm"
				:disabled="selectedRowKeys.length!=1"
			>
				<a-icon style="color:#1890ff;" type="delete" />删除
			</permission-button>
		</div>
		<a-table
			rowKey="id"
			:columns="columns"
			:pagination="false"
			:rowSelection="{selectedRowKeys:selectedRowKeys,onChange: onSelectChange}"
			:dataSource="data"
		>
			<template slot="content" slot-scope="text, record, index">
				<div style="width:600px;" class="content_style" :title="text">{{text}}</div>
			</template>
		</a-table>
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
		<a-modal
			title="回复"
			:footer="null"
			width="600px"
			:visible="replyVisible"
			@cancel="handleCancel()"
			:maskClosable="false"
		>
			<a-form :form="form" @keyup.enter.native="reply">
				<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 18 }" label="反馈内容">
					<div style="width:100%;" class="content_style">{{Msg}}</div>
				</a-form-item>
				<a-form-item
					:label-col=" { span: 4 }"
					:wrapper-col="{ span: 18 }"
					label="回复内容"
					style="margin-bottom:20px;"
				>
					<a-textarea
						v-decorator="['content',{rules: [{ required: true, message: '请填写回复内容' }]}]"
						:autosize="{ minRows: 6, maxRows: 6 }"
						maxlength="300"
					></a-textarea>
				</a-form-item>
				<a-form-item style="display:block;text-align:right;">
					<a-button style="margin-right:12px;" @click="handleCancel()">取消</a-button>
					<a-button type="primary" @click="reply">保存</a-button>
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>
<script>
import Vue from "vue";
import { Table, Modal, Pagination, Input, Form } from "ant-design-vue";
Vue.use(Pagination);
Vue.use(Table);
Vue.use(Modal);
Vue.use(Input);
Vue.use(Form);
const columns = [
	{
		dataIndex: "userName",
		title: "昵称",
		width: "15%",
		key: "userName"
	},
	{
		dataIndex: "opinion",
		key: "opinion",
		title: "内容",
		width: 600,
		scopedSlots: { customRender: "content" }
	},
	{
		dataIndex: "phone",
		key: "phone",
		title: "联系电话",
		width: "10%"
	},
	{
		dataIndex: "state",
		key: "state",
		title: "状态",
		width: "10%",
		customRender: function(text, record, index) {
			if (text == 0) {
				return `未回复`;
			} else {
				return `已回复`;
			}
		}
	},
	{
		dataIndex: "gmtCreate",
		key: "gmtCreate",
		title: "留言时间",
		width: "10"
	}
];
export default {
	data() {
		return {
			columns,
			data: [],
			selectedRowKeys: [],
			selectedRows: [],
			current: 1,
			pageSize: 10,
			total: 0,
			replyVisible: false,
			form: this.$form.createForm(this),
			Msg: null
		};
	},
	methods: {
		reply() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					let qs = require("qs");
					let data = qs.stringify({
						id: this.selectedRows[0].id,
						reply: values.content
					});
					this.Axios(
						{
							url: "/api-platform/advise/reply",
							params: data,
							type: "post",
							option: { successMsg: "回复成功！" }
						},
						this
					).then(
						result => {
							if (result.data.code === 200) {
								this.replyVisible = false;
								this.selectedRowKeys = [];
								this.selectedRows = [];
								this.getList();
							}
						},
						({ type, info }) => {}
					);
				}
			});
		},
		handleCancel() {
			this.replyVisible = false;
			this.form.resetFields();
		},
		replyShow() {
			let row = this.selectedRows[0];
			this.replyVisible = true;
			setTimeout(() => {
				this.form.setFieldsValue({
					content: row.reply
				});
			}, 100);
		},
		onSelectChange(selectedRowKeys, a) {
			console.log(selectedRowKeys, a);
			this.selectedRowKeys = selectedRowKeys;
			this.selectedRows = a;
			if (a[0] != undefined) {
				this.Msg = a[0].opinion;
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
		showDeleteConfirm() {
			let that = this;
			this.$confirm({
				title: "确定删除吗？",
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
				id: this.selectedRows[0].id
			});
			this.Axios(
				{
					url: "/api-platform/advise/updateState",
					params: data,
					type: "post",
					option: { successMsg: "删除成功！" }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						this.selectedRowKeys = [];
						this.selectedRows = [];
						this.getList();
					}
				},
				({ type, info }) => {}
			);
		},
		getList() {
			this.Axios(
				{
					url: "/api-platform/advise/list",
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
					}
				},
				({ type, info }) => {}
			);
		}
	},
	created() {
		this.getList();
	}
};
</script>
<style lang="less">
.feedback {
}
</style>