<template>
	<div class="coefficient">
		<a-row style="padding-bottom:12px;">
			<permission-button
				permCode="workorder_worktime_lookup.workorder_workhour_num_add"
				banType="hide"
				@click="addVisible=true"
			>新增</permission-button>
		</a-row>
		<a-row>
			<a-table rowKey="id" :columns="columns" :pagination="false" :dataSource="data" size="small">
				<template slot="operation" slot-scope="text, record, index">
					<permission-button
						permCode="workorder_worktime_lookup.workorder_workhour_num_update"
						banType="hide"
						class="button_text"
						style="margin-right:8px;"
						@click="findOne(record.id)"
					>修改</permission-button>
					<a-popconfirm
						title="确定删除吗？"
						@confirm="del(record.id)"
						@cancel="cancel"
						okText="确定"
						cancelText="取消"
					>
						<permission-button
							permCode="workorder_worktime_lookup.workorder_workhour_num_delete"
							banType="hide"
							class="button_text"
						>删除</permission-button>
					</a-popconfirm>
				</template>
				<template slot="range" slot-scope="text, record, index">
					<span>{{record.minValue+'~'+record.maxValue}}</span>
				</template>
			</a-table>
		</a-row>
		<a-modal
			title="新增"
			:footer="null"
			width="600px"
			:visible="addVisible"
			@cancel="handleCancel(1)"
			:maskClosable="false"
		>
			<a-form :form="form">
				<a-form-item label="标题" :label-col=" { span: 4 }" :wrapper-col="{ span: 18 }">
					<a-input
						maxlength="20"
						v-decorator="[
							'title',
							{rules: [{ required: true, message: '请填写标题' }]}
							]"
					></a-input>
				</a-form-item>
				<a-form-item label="范围" :label-col=" { span: 4 }" :wrapper-col="{ span: 18 }">
					<a-input
						style=" width: 192px; text-align: left"
						placeholder
						type="number"
						oninput="if(value.length>10)value=value.slice(0,10);if(value<0)value=null"
						v-decorator="[
							'minValue',
							{rules: [{ required: true, message: '请填写范围' },{validator: chickNumber1}]}
							]"
					/>
					<a-input
						style=" width: 30px; border-left: 0; pointer-events: none; backgroundColor: #fff"
						placeholder="~"
						disabled
					/>
					<a-input
						style="width: 192px; text-align: left; border-left: 0"
						placeholder
						type="number"
						oninput="if(value.length>10)value=value.slice(0,10);value=value.replace(/^(0+)|[^\d]+/g,'')"
						v-decorator="[
							'maxValue',
							{rules: [{ required: true, message: '请填写范围' }]}
							]"
					/>
				</a-form-item>
				<a-form-item label="系数" :label-col=" { span: 4 }" :wrapper-col="{ span: 18 }">
					<a-input
						maxlength="20"
						placeholder="如：0.8"
						oninput="if(value.length>5)value=value.slice(0,5);"
						v-decorator="[
							'coefficient',
							{rules: [{ required: true, message: '请填写系数' },{validator: chickNumber}]}
							]"
					></a-input>
				</a-form-item>
				<a-form-item label="备注" :label-col=" { span: 4 }" :wrapper-col="{ span: 18 }">
					<a-input maxlength="20" v-decorator="['note']"></a-input>
				</a-form-item>
				<a-form-item :wrapper-col="{ span: 20,offset: 4 }" style="text-align:right;">
					<a-button style="margin-right:8px;" @click="handleCancel(1)">取消</a-button>
					<a-button type="primary" @click="add">保存</a-button>
				</a-form-item>
			</a-form>
		</a-modal>
		<a-modal
			title="修改"
			:footer="null"
			width="600px"
			:visible="editVisible"
			@cancel="handleCancel(2)"
			:maskClosable="false"
		>
			<a-form :form="form">
				<a-form-item label="标题" :label-col=" { span: 4 }" :wrapper-col="{ span: 18 }">
					<a-input
						maxlength="20"
						v-decorator="[
							'title',
							{rules: [{ required: true, message: '请填写标题' }]}
							]"
					></a-input>
				</a-form-item>
				<a-form-item label="范围" :label-col=" { span: 4 }" :wrapper-col="{ span: 18 }">
					<a-input
						style=" width: 192px; text-align: left"
						placeholder
						type="number"
						oninput="if(value.length>10)value=value.slice(0,10);if(value<0)value=null"
						v-decorator="[
							'minValue',
							{rules: [{ required: true, message: '请填写范围' },{validator: chickNumber1}]}
							]"
					/>
					<a-input
						style=" width: 30px; border-left: 0; pointer-events: none; backgroundColor: #fff"
						placeholder="~"
						disabled
					/>
					<a-input
						style="width: 192px; text-align: left; border-left: 0"
						placeholder
						type="number"
						oninput="if(value.length>10)value=value.slice(0,10);value=value.replace(/^(0+)|[^\d]+/g,'')"
						v-decorator="[
							'maxValue',
							{rules: [{ required: true, message: '请填写范围' }]}
							]"
					/>
				</a-form-item>
				<a-form-item label="系数" :label-col=" { span: 4 }" :wrapper-col="{ span: 18 }">
					<a-input
						maxlength="20"
						placeholder="如：0.8"
						v-decorator="[
							'coefficient',
							{rules: [{ required: true, message: '请填写系数' },{validator: chickNumber}]}
							]"
					></a-input>
				</a-form-item>
				<a-form-item label="备注" :label-col=" { span: 4 }" :wrapper-col="{ span: 18 }">
					<a-input maxlength="20" v-decorator="['note']"></a-input>
				</a-form-item>
				<a-form-item :wrapper-col="{ span: 20,offset: 4 }" style="text-align:right;">
					<a-button style="margin-right:8px;" @click="handleCancel(2)">取消</a-button>
					<a-button type="primary" @click="update">保存</a-button>
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>
<script>
import Vue from "vue";
import {
	Table,
	Col,
	Row,
	Modal,
	Form,
	Input,
	Popconfirm
} from "ant-design-vue";
Vue.use(Form);
Vue.use(Table);
Vue.use(Col);
Vue.use(Row);
Vue.use(Modal);
Vue.use(Input);
Vue.use(Popconfirm);

const columns = [
	{
		dataIndex: "title",
		title: "标题",
		width: 100,
		key: "title"
	},
	{
		dataIndex: "range",
		title: "范围",
		width: 80,
		key: "range",
		scopedSlots: { customRender: "range" }
	},
	{
		dataIndex: "coefficient",
		title: "系数",
		width: 100,
		key: "coefficient"
	},
	{
		dataIndex: "note",
		key: "note",
		title: "备注",
		width: 100
	},
	{
		dataIndex: "operation",
		key: "operation",
		title: "操作",
		width: 80,
		scopedSlots: { customRender: "operation" }
	}
];
export default {
	data() {
		return {
			coefficientId: "",
			form: this.$form.createForm(this),
			addVisible: false,
			editVisible: false,
			columns,
			data: []
		};
	},
	methods: {
		cancel() {},
		chickNumber1(rule, value, callback) {
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
		chickNumber(rule, value, callback) {
			if (
				/^(0|[1-9]\d*)(\s|$|\.\d{1,2}\b)/.test(value) == false &&
				value != "" &&
				value != null
			) {
				callback(new Error("请输入大于等于0，只能保留2位小数"));
			} else {
				callback();
			}
		},
		handleCancel(a) {
			if (a == 1) {
				this.addVisible = false;
				this.form.resetFields();
			}
			if (a == 2) {
				this.editVisible = false;
				this.form.resetFields();
			}
		},
		getList() {
			this.Axios(
				{
					url: "/api-workorder/coefficient/list",
					params: {},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.data = result.data.data;
					}
				},
				({ type, info }) => {}
			);
		},
		add() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					console.log(values);
					if (parseInt(values.minValue) >= parseInt(values.maxValue)) {
						this.$message.error("范围前面的值不能大于等于后面的值", 5);
						return false;
					}
					let data = {
						title: values.title,
						minValue: values.minValue,
						maxValue: values.maxValue,
						coefficient: values.coefficient,
						note: values.note
					};
					this.Axios(
						{
							url: "/api-workorder/coefficient/add",
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
								this.addVisible = false;
								this.form.resetFields();
								this.getList();
							}
						},
						({ type, info }) => {}
					);
				}
			});
		},
		findOne(id) {
			this.coefficientId = id;
			this.Axios(
				{
					url: "/api-workorder/coefficient/findOne",
					params: {
						coefficientId: id
					},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.editVisible = true;
						setTimeout(() => {
							this.form.setFieldsValue({
								title: result.data.data.title,
								minValue: result.data.data.minValue,
								maxValue: result.data.data.maxValue,
								coefficient: result.data.data.coefficient,
								note: result.data.data.note
							});
						}, 100);
					}
				},
				({ type, info }) => {}
			);
		},
		update() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					console.log(values);
					if (parseInt(values.minValue) >= parseInt(values.maxValue)) {
						this.$message.error("范围前面的值不能大于等于后面的值", 5);
						return false;
					}
					let data = {
						id: this.coefficientId,
						title: values.title,
						minValue: values.minValue,
						maxValue: values.maxValue,
						coefficient: values.coefficient,
						note: values.note
					};
					this.Axios(
						{
							url: "/api-workorder/coefficient/update",
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
								this.editVisible = false;
								this.getList();
							}
						},
						({ type, info }) => {}
					);
				}
			});
		},
		del(id) {
			this.Axios(
				{
					url: "/api-workorder/coefficient/del",
					params: {
						coefficientId: id
					},
					type: "get",
					option: { successMsg: "删除成功！" }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);

						this.getList();
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