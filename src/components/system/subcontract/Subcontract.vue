<template>
	<div class="subcontract_list">
		<a-col :span="24" style="padding:0 20px;">
			<a-row>
				<div style="line-height:50px;">
					<a-col :span="8">
						<!-- <a-button type="primary" @click="modalNewVisible=true">
							<a-icon type="plus-circle"/>添加
						</a-button>-->
						<permission-button
							permCode="collaboration_col_lookup.collaboration_col_add"
							banType="hide"
							@click="modalNewVisible=true"
						>
							<a-icon style="color:#1890ff;" type="plus" />新增
						</permission-button>
						<permission-button
							permCode="collaboration_col_lookup.collaboration_col_update"
							banType="hide"
							@click="editShow"
							:disabled="selectedRowKeys.length!=1"
						>
							<a-icon style="color:#1890ff;" type="edit" />修改
						</permission-button>
						<permission-button
							permCode="collaboration_col_lookup.collaboration_col_delete"
							banType="hide"
							@click="showDeleteConfirm"
							:disabled="selectedRowKeys.length!=1"
						>
							<a-icon style="color:#1890ff;" type="delete" />删除
						</permission-button>
					</a-col>
					<a-col :span="16" style="text-align:right">
						关键字：
						<a-input type="text" v-model="keyword" style="width:300px" placeholder="委外单位名称，联系人，电话"></a-input>
						<a-button type="primary" icon="search" @click="getList">搜索</a-button>
					</a-col>
				</div>
				<a-modal
					title="新增委外单位"
					:maskClosable="false"
					centered
					v-model="modalNewVisible"
					@ok="() => modalNewVisible = false"
					@cancel="form.resetFields()"
					width="800px"
					:footer="null"
				>
					<a-form :form="form" @keyup.enter.native="add">
						<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 20 }" label="类型">
							<a-select
								showSearch
								placeholder="请选择"
								optionFilterProp="children"
								v-decorator="['type',{rules: [{ required: true, message: '请选择类型' }]}]"
							>
								<a-select-option :value="1">常规合作</a-select-option>
								<a-select-option :value="2">承制单位</a-select-option>
							</a-select>
						</a-form-item>
						<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 20 }" label="单位名称">
							<a-input
								maxlength="20"
								v-decorator="['name',{rules: [{ required: true, message: '请填写单位名称' }]}]"
							></a-input>
						</a-form-item>
						<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 20 }" label="联系人">
							<a-input
								maxlength="20"
								v-decorator="['contact',{rules: [{ required: true, message: '请填写联系人' }]}]"
							></a-input>
						</a-form-item>
						<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 20 }" label="联系人电话">
							<a-input
								type="number"
								oninput="if(value.length>11)value=value.slice(0,11)"
								v-decorator="['phone',{rules: [{ required: true, message: '请填写联系人电话' },{validator: chickPhone}]}]"
							></a-input>
						</a-form-item>
						<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 20 }" label="备注">
							<a-textarea maxlength="50" v-decorator="['remark']" :autosize="{ minRows: 4, maxRows: 4 }"></a-textarea>
						</a-form-item>
						<a-form-item :wrapper-col="{ span: 20,offset: 4 }" style="text-align: right;">
							<a-button style="margin-right:12px;" @click="form.resetFields();modalNewVisible = false">取消</a-button>
							<a-button type="primary" @click="add">保存</a-button>
						</a-form-item>
					</a-form>
				</a-modal>
				<a-modal
					title="修改委外单位"
					:maskClosable="false"
					:footer="null"
					centered
					v-model="modalEditVisible"
					@ok="() => modalEditVisible = false"
					@cancel="form.resetFields()"
					width="800px"
				>
					<a-form :form="form" @keyup.enter.native="edit">
						<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 20 }" label="类型">
							<a-select
								showSearch
								placeholder="请选择"
								optionFilterProp="children"
								v-decorator="['type',{rules: [{ required: true, message: '请选择类型' }]}]"
							>
								<a-select-option :value="1">常规合作</a-select-option>
								<a-select-option :value="2">承制单位</a-select-option>
							</a-select>
						</a-form-item>
						<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 20 }" label="单位名称">
							<a-input
								maxlength="20"
								v-decorator="['name',{rules: [{ required: true, message: '请填写单位名称' }]}]"
							></a-input>
						</a-form-item>
						<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 20 }" label="联系人">
							<a-input
								maxlength="20"
								v-decorator="['contact',{rules: [{ required: true, message: '请填写联系人' }]}]"
							></a-input>
						</a-form-item>
						<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 20 }" label="联系人电话">
							<a-input
								type="number"
								oninput="if(value.length>11)value=value.slice(0,11)"
								v-decorator="['phone',{rules: [{ required: true, message: '请填写联系人电话' },{validator: chickPhone}]}]"
							></a-input>
						</a-form-item>
						<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 20 }" label="备注">
							<a-textarea maxlength="50" v-decorator="['remark']" :autosize="{ minRows: 4, maxRows: 4 }"></a-textarea>
						</a-form-item>
						<a-form-item :wrapper-col="{ span: 20,offset: 4 }" style="text-align: right;">
							<a-button style="margin-right:12px;" @click="form.resetFields();modalEditVisible = false">取消</a-button>
							<a-button type="primary" @click="edit">保存</a-button>
						</a-form-item>
					</a-form>
				</a-modal>
			</a-row>
			<a-row style="padding-top:10px;">
				<a-table
					:columns="columns"
					:pagination="false"
					:rowSelection="{selectedRowKeys:selectedRowKeys,onChange: onSelectChange}"
					:dataSource="data"
					rowKey="id"
				>
					<template slot="type" slot-scope="text, record, index">
						<div>{{text==1?"常规合作":"承制单位"}}</div>
					</template>
					<template slot="state" slot-scope="text, record, index">
						<div>
							<a-switch
								checkedChildren="正常"
								unCheckedChildren="禁用"
								:defaultChecked="record.state==0?true:false"
							/>
						</div>
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
			</a-row>
		</a-col>
	</div>
</template>
<script>
import Vue from "vue";
import {
	Table,
	Col,
	Row,
	Modal,
	Pagination,
	Select,
	Radio,
	Form
} from "ant-design-vue";
Vue.use(Pagination);
Vue.use(Table);
Vue.use(Col);
Vue.use(Row);
Vue.use(Modal);
Vue.use(Select);
Vue.use(Radio);
Vue.use(Form);
const columns = [
	{
		dataIndex: "type",
		title: "类型",
		width: "10%",
		key: "type",
		scopedSlots: { customRender: "type" }
	},
	{
		dataIndex: "name",
		title: "委外单位名称",
		width: "30%",
		key: "name"
	},
	{
		dataIndex: "contact",
		title: "联系人",
		width: "10%",
		key: "contact"
	},
	{
		dataIndex: "phone",
		key: "phone",
		title: "联系人电话",
		width: "20%",
		scopedSlots: { customRender: "deviceState" }
	},
	{
		dataIndex: "remark",
		key: "remark",
		title: "备注",
		width: "25%"
	}
	// {
	// 	dataIndex: "state",
	// 	key: "state",
	// 	title: "状态",
	// 	width: 70,
	// 	scopedSlots: { customRender: "state" }
	// },
	// {
	// 	dataIndex: "operation",
	// 	key: "operation",
	// 	title: "操作",
	// 	width: 80,
	// 	scopedSlots: { customRender: "operation" }
	// }
];

export default {
	data() {
		return {
			selectedRowKeys: [],
			form: this.$form.createForm(this),
			modalNewVisible: false,
			modalEditVisible: false,
			isHideList: this.$route.params.id !== undefined ? true : false,
			columns,
			data: [],
			current: 1,
			pageSize: 10,
			total: 50,
			keyword: ""
		};
	},
	methods: {
		chickPhone(rule, value, callback) {
			if (
				/^1[23456789]\d{9}$/.test(value) == false &&
				value != "" &&
				value != null
			) {
				callback(new Error("请输入正确的电话号码"));
			} else {
				callback();
			}
		},
		onSelectChange(selectedRowKeys) {
			this.selectedRowKeys = selectedRowKeys;
			console.log(this.selectedRowKeys);
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
		onDelete(e) {
			let qs = require("qs");
			let data = qs.stringify({
				id: this.selectedRowKeys[0]
			});
			this.Axios(
				{
					url: "/api-platform/collaborationUnit/del",
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
					}
				},
				({ type, info }) => {}
			);
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
		editShow() {
			this.Axios(
				{
					url: "/api-platform/collaborationUnit/findOne",
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
						this.modalEditVisible = true;
						setTimeout(() => {
							this.form.setFieldsValue({
								type: result.data.data.type,
								name: result.data.data.name,
								contact: result.data.data.contact,
								phone: result.data.data.phone,
								remark: result.data.data.remark
							});
						}, 100);
					}
				},
				({ type, info }) => {}
			);
		},
		edit() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					// console.log("Received values of form: ", values);
					let qs = require("qs");
					let data = qs.stringify({
						id: this.selectedRowKeys[0],
						type: values.type,
						name: values.name,
						contact: values.contact,
						phone: values.phone,
						remark: values.remark
					});
					this.Axios(
						{
							url: "/api-platform/collaborationUnit/update",
							params: data,
							type: "post",
							option: { successMsg: "修改成功！" }
						},
						this
					).then(
						result => {
							if (result.data.code === 200) {
								console.log(result);
								this.getList();
								this.modalEditVisible = false;
								this.selectedRowKeys = [];
							}
						},
						({ type, info }) => {}
					);
				}
			});
		},
		getList() {
			this.Axios(
				{
					url: "/api-platform/collaborationUnit/list",
					params: {
						page: this.current,
						size: this.pageSize,
						keyword: this.keyword
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
		},
		add() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					// console.log("Received values of form: ", values);
					let qs = require("qs");
					let data = qs.stringify({
						type: values.type,
						name: values.name,
						contact: values.contact,
						phone: values.phone,
						remark: values.remark
					});
					this.Axios(
						{
							url: "/api-platform/collaborationUnit/add",
							params: data,
							type: "post",
							option: { successMsg: "添加成功！" }
						},
						this
					).then(
						result => {
							if (result.data.code === 200) {
								console.log(result);
								this.getList();
								this.modalNewVisible = false;
								this.selectedRowKeys = [];
								this.form.resetFields();
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
	watch: {}
};
</script>
