<template>
	<div>
		<a-table
			:columns="columns"
			rowKey="id"
			:pagination="false"
			:dataSource="data"
			size="small"
			bordered
		>
			<template slot="operation" slot-scope="text, record, index">
				<div>
					<permission-button
						permCode="raw_raw_lookup.raw_raw_update"
						banType="disabled"
						class="button_text btn_disabled"
						@click="handleEdit(record)"
					>修改</permission-button>&nbsp;
					<!-- <a-popconfirm title="确定删除吗?" @confirm="() => onDelete(record)">
						<span style="cursor: pointer;color:#1890ff">删除</span>
					</a-popconfirm>-->
				</div>
			</template>
		</a-table>
		<a-pagination
			style="padding-top:12px;text-align: right;"
			:defaultCurrent="current"
			:total="total"
			@change="onChange"
			showSizeChanger
			:pageSizeOptions="['10','20','30']"
			@showSizeChange="onShowSizeChange"
			:showTotal="total => `共 ${total} 条`"
		/>
		<a-modal
			title="修改规格"
			width="800px"
			:visible="addStickVisible"
			@cancel="handleCancel()"
			:maskClosable="false"
			class="modal_form_style"
			:footer="null"
		>
			<a-form :form="form" layout="inline" style="overflow:hidden" @keyup.enter.native="edit">
				<a-col :span="12">
					<a-form-item label="名称">
						<a-input
							maxlength="20"
							v-decorator="['name',{rules: [{ required: true, message: '请填写名称' }]}]"
							style="width:260px;"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="编号">
						<a-input maxlength="20" v-decorator="['number']" style="width:260px;"></a-input>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="半径">
						<a-input
							v-decorator="['lengthOrRadius',{rules: [{ required: true, message: '请填写半径' },{validator: chickNumberFloat}]}]"
							type="number"
							oninput="if(value.length>10)value=value.slice(0,10)"
							style="width:260px;"
							addonAfter="mm"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="长">
						<a-input
							v-decorator="['heightOrLength',{rules: [{ required: true, message: '请填写长' },{validator: chickNumberFloat}]}]"
							type="number"
							oninput="if(value.length>10)value=value.slice(0,10)"
							style="width:260px;"
							addonAfter="mm"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="密度">
						<a-input
							v-decorator="['density',{rules: [{ required: true, message: '请填写密度' },{validator: chickNumberFloat}]}]"
							type="number"
							oninput="if(value.length>10)value=value.slice(0,10)"
							style="width:260px;"
							addonAfter="g/cm³"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="价格">
						<a-input
							v-decorator="['price',{rules: [{ required: true, message: '请填写价格' },{validator: chickNumberFloat}]}]"
							type="number"
							oninput="if(value.length>10)value=value.slice(0,10)"
							style="width:260px;"
							addonAfter="元/kg"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="备注">
						<a-input maxlength="50" v-decorator="['remark']" style="width:260px;"></a-input>
					</a-form-item>
				</a-col>
				<a-col :span="24">
					<a-form-item style="display:block;text-align:right;margin-bottom:0">
						<a-button @click="handleCancel()" style="margin-right:12px;">取消</a-button>
						<a-button type="primary" @click="edit">保存</a-button>
					</a-form-item>
				</a-col>
			</a-form>
		</a-modal>
	</div>
</template>
<script>
import Vue from "vue";
import {
	Col,
	Row,
	Modal,
	Icon,
	Input,
	Form,
	Pagination,
	Table
} from "ant-design-vue";
Vue.use(Col);
Vue.use(Table);
Vue.use(Pagination);
Vue.use(Row);
Vue.use(Form);
Vue.use(Icon);
Vue.use(Input);
Vue.use(Modal);
const columns = [
	{
		dataIndex: "name",
		title: "名称",
		width: 100,
		key: "name"
	},
	{
		dataIndex: "number",
		title: "编号",
		width: 100,
		key: "number"
	},
	{
		dataIndex: "lengthOrRadius",
		key: "lengthOrRadius",
		title: "半径mm",
		width: 70,
		scopedSlots: { customRender: "deviceState" }
	},
	{
		dataIndex: "heightOrLength",
		key: "heightOrLength",
		title: "长mm",
		width: 70
	},
	{
		dataIndex: "density",
		key: "density",
		title: "密度g/cm³",
		width: 100
	},
	{
		dataIndex: "price",
		key: "price",
		title: "价格(元/kg)",
		width: 100
	},
	{
		dataIndex: "remark",
		key: "remark",
		title: "备注",
		width: 100
	},
	{
		dataIndex: "operation",
		key: "operation",
		title: "操作",
		width: 90,
		scopedSlots: { customRender: "operation" }
	}
];
export default {
	data() {
		return {
			addStickVisible: false,
			columns,
			data: [],
			current: 1,
			pageSize: 10,
			total: 50,
			form: this.$form.createForm(this),
			rowId: ""
		};
	},
	methods: {
		chickNumber(rule, value, callback) {
			if (
				/^\+?[1-9]\d*$/.test(value) == false &&
				value != "" &&
				value != null
			) {
				callback(new Error("只能输入大于0的整数"));
			} else {
				callback();
			}
		},
		chickNumberFloat(rule, value, callback) {
			if (
				(/^\d+(\.\d{0,2})?$/.test(value) == false || value <= 0) &&
				value != "" &&
				value != null
			) {
				callback(new Error("只能输入大于0,且只能保留两位小数"));
			} else {
				callback();
			}
		},
		handleCancel() {
			this.addStickVisible = false;
			this.form.resetFields();
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
		handleEdit(row) {
			console.log(row);
			// this.addStickVisible = true;
			this.rowId = row.id;
			this.Axios(
				{
					url: "/api-workorder/rawMaterial/findOne",
					params: {
						Id: row.id
					},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.addStickVisible = true;
						this.rowId = result.data.data.id;
						setTimeout(() => {
							this.form.setFieldsValue({
								name: result.data.data.name,
								lengthOrRadius: result.data.data.lengthOrRadius,
								number: result.data.data.number,
								widthOrRadius: result.data.data.widthOrRadius,
								remark: result.data.data.remark,
								heightOrLength: result.data.data.heightOrLength,
								density: result.data.data.density,
								price: result.data.data.price
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
					let data = {
						type: 2,
						id: this.rowId,
						lengthOrRadius: values.lengthOrRadius,
						widthOrRadius: values.lengthOrRadius,
						heightOrLength: values.heightOrLength,
						name: values.name,
						remark: values.remark,
						number: values.number,
						density: values.density,
						price: values.price
					};
					this.Axios(
						{
							url: "/api-workorder/rawMaterial/update",
							params: data,
							type: "post",
							option: { successMsg: "修改成功！" },
							config: {
								headers: { "Content-Type": "application/json" }
							}
						},
						this
					).then(
						result => {
							if (result.data.code === 200) {
								console.log(result);
								this.addStickVisible = false;
								this.getList();
							}
						},
						({ type, info }) => {}
					);
				}
			});
		},
		onDelete(row) {
			let qs = require("qs");
			let data = qs.stringify({
				Id: row.id
			});
			this.Axios(
				{
					url: "/api-workorder/rawMaterial/delete",
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
		getList() {
			this.Axios(
				{
					url: "/api-workorder/rawMaterial/list",
					params: {
						page: this.current,
						size: this.pageSize,
						type: 2
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
						for (let i = 0; i < this.data.length; i++) {
							this.data[i].density = this.data[i].density;
						}
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
