<template>
	<div class="process_types">
		<a-col :span="24" style="padding:0 20px;">
			<a-row>
				<div style="line-height:50px;">
					<a-col :span="8">
						<!-- <a-button type="primary" @click="modalNewVisible=true">
							<a-icon type="plus-circle"/>添加
						</a-button>-->
						<permission-button
							permCode="worktype_worktype_lookup.worktype_add"
							banType="hide"
							@click="modalNewVisible=true"
						>
							<a-icon style="color:#1890ff;" type="plus" />新增
						</permission-button>
						<permission-button
							permCode="worktype_worktype_lookup.worktype_update"
							banType="hide"
							@click="modalEditShow"
							:disabled="selectedRows.length!=1"
						>
							<a-icon style="color:#1890ff;" type="edit" />修改
						</permission-button>
						<permission-button
							permCode="worktype_worktype_lookup.worktype_delete"
							banType="hide"
							@click="showDeleteConfirm"
							:disabled="selectedRowKeys.length!=1"
						>
							<a-icon style="color:#1890ff;" type="delete" />删除
						</permission-button>
					</a-col>
					<!-- <a-col :span="16" style="text-align:right">
						关键字：
						<a-input type="text" style="width:300px" placeholder="工序类型"></a-input>
						<a-button type="primary" icon="search">搜索</a-button>
					</a-col>-->
				</div>
				<a-modal
					title="新增"
					:maskClosable="false"
					centered
					v-model="modalNewVisible"
					@ok="addProcessTypes"
					@cancel="cancel(1)"
				>
					<a-form :form="form" @keyup.enter.native="addProcessTypes">
						<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 20 }" label="分类">
							<!-- <a-input v-decorator="['workType',{rules: [{ required: true, message: '请选择分类' }]}]"></a-input> -->
							<a-select
								@change="getSelectValue"
								v-decorator="['workType',{rules: [{ required: true, message: '请选择分类' }],initialValue:'MACHINING'}]"
							>
								<a-select-option value="MACHINING">机加</a-select-option>
								<a-select-option value="SURFACE">表处</a-select-option>
								<!-- <a-select-option value="CHECK">检验</a-select-option> -->
								<a-select-option value="STORAGE">入库</a-select-option>
								<a-select-option value="WELDING">交焊</a-select-option>
							</a-select>
						</a-form-item>
						<a-form-item
							:label-col=" { span: 4 }"
							:wrapper-col="{ span: 20 }"
							label="类型"
							v-if="selectValue=='SURFACE'"
						>
							<a-radio-group
								@change="getRadioValue"
								v-decorator="['priceType',{rules: [{ required: true, message: '请选择类型' }]}]"
							>
								<a-radio value="BYSURFACE">按面积</a-radio>
								<a-radio value="BYWEIGHT">按重量</a-radio>
							</a-radio-group>
						</a-form-item>
						<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 20 }" label="名称">
							<a-input
								maxlength="20"
								v-decorator="['typeName',{rules: [{ required: true, message: '请填写名称' }]}]"
							></a-input>
						</a-form-item>
						<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 20 }" label="单价">
							<a-input
								type="number"
								oninput="if(value.length>10)value=value.slice(0,10)"
								v-decorator="['price',{rules: [{ required: true, message: '请填写单价' },{validator: chickNumber}]}]"
								:addonAfter="radioValue=='BYTIME'?'元/时':radioValue=='BYSURFACE'?'元/㎡':'元/kg'"
							></a-input>
						</a-form-item>
						<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 20 }" label="名称简写">
							<a-input maxlength="20" v-decorator="['remarks']"></a-input>
						</a-form-item>
					</a-form>
				</a-modal>
				<a-modal
					title="修改"
					:maskClosable="false"
					centered
					v-model="modalEditVisible"
					@ok="editProcessTypes"
					@cancel="cancel(2)"
				>
					<a-form :form="form" @keyup.enter.native="editProcessTypes">
						<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 20 }" label="分类">
							<!-- <a-input v-decorator="['workType',{rules: [{ required: true, message: '请选择分类' }]}]"></a-input> -->
							<a-select
								@change="getSelectValue"
								v-decorator="['workType',{rules: [{ required: true, message: '请选择分类' }]}]"
							>
								<a-select-option value="MACHINING">机加</a-select-option>
								<a-select-option value="SURFACE">表处</a-select-option>
								<!-- <a-select-option value="CHECK">检验</a-select-option> -->
								<a-select-option value="STORAGE">入库</a-select-option>
								<a-select-option value="WELDING">交焊</a-select-option>
							</a-select>
						</a-form-item>
						<a-form-item
							:label-col=" { span: 4 }"
							:wrapper-col="{ span: 20 }"
							label="类型"
							v-if="selectValue=='SURFACE'"
						>
							<a-radio-group
								@change="getRadioValue"
								v-decorator="['priceType',{rules: [{ required: true, message: '请选择类型' }],initialValue:radioValue}]"
							>
								<a-radio value="BYSURFACE">按面积</a-radio>
								<a-radio value="BYWEIGHT">按重量</a-radio>
							</a-radio-group>
						</a-form-item>
						<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 20 }" label="名称">
							<a-input
								maxlength="20"
								v-decorator="['typeName',{rules: [{ required: true, message: '请填写名称' }]}]"
							></a-input>
						</a-form-item>
						<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 20 }" label="单价">
							<a-input
								type="number"
								oninput="if(value.length>10)value=value.slice(0,10)"
								v-decorator="['price',{rules: [{ required: true, message: '请填写单价' },{validator: chickNumber}]}]"
								:addonAfter="radioValue=='BYTIME'?'元/时':radioValue=='BYSURFACE'?'元/㎡':'元/kg'"
							></a-input>
						</a-form-item>
						<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 20 }" label="名称简写">
							<a-input maxlength="20" v-decorator="['remarks']"></a-input>
						</a-form-item>
					</a-form>
				</a-modal>
			</a-row>
			<a-row style="padding-top:10px;">
				<a-table
					:columns="columns"
					:pagination="false"
					:dataSource="data"
					rowKey="id"
					:rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
				>
					<template slot="price" slot-scope="text, record, index">
						<span>￥{{text}}</span>
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
		dataIndex: "workTypeName",
		title: "工种名称",
		width: "30%",
		key: "workTypeName"
	},
	{
		dataIndex: "price",
		title: "工时单价（单位：元）",
		width: "15%",
		key: "price",
		scopedSlots: { customRender: "price" }
	},
	{
		dataIndex: "remarks",
		title: "备注",
		width: "50%",
		key: "remarks"
	}
];
const data = [
	{
		key: "0",
		deviceNo: "111",
		deviceName: "11",
		deviceState: "11",
		organizeName: "11",
		location: "11",
		state: "1",
		deviceCategoryName: "11",
		deviceModel: "11",
		workerNames: "11"
	},
	{
		key: "1",
		deviceNo: "111",
		deviceName: "11",
		deviceState: "11",
		organizeName: "11",
		location: "11",
		state: "0",
		deviceCategoryName: "11",
		deviceModel: "11",
		workerNames: "11"
	},
	{
		key: "2",
		deviceNo: "111",
		deviceName: "11",
		deviceState: "11",
		organizeName: "11",
		location: "11",
		state: "0",
		deviceCategoryName: "11",
		deviceModel: "11",
		workerNames: "11"
	}
];

export default {
	data() {
		return {
			selectedRowKeys: [],
			selectedRows: [],
			form: this.$form.createForm(this),
			modalNewVisible: false,
			modalEditVisible: false,
			isHideList: this.$route.params.id !== undefined ? true : false,
			columns,
			data: [],
			current: 1,
			pageSize: 10,
			total: 0,
			radioValue: "BYTIME",
			selectValue: ""
		};
	},
	methods: {
		cancel(a) {
			if (a == 1) {
				this.form.resetFields();
				this.radioValue = "BYTIME";
				this.selectValue = "";
			}
			if (a == 2) {
				this.form.resetFields();
				this.radioValue = "BYTIME";
				this.selectValue = "";
			}
		},
		// chickNumber(rule, value, callback) {
		// 	if (
		// 		(/^\d+(\.\d{0,2})?$/.test(value) == false || value <= 0) &&
		// 		(value != null) & (value != "")
		// 	) {
		// 		callback(new Error("只能输入大于0且只能保留两位小数"));
		// 	} else {
		// 		callback();
		// 	}
		// },
		chickNumber(rule, value, callback) {
			if (/^\d+?$/.test(value) == false && (value != null) & (value != "")) {
				callback(new Error("只能输入大于等于0的整数"));
			} else {
				callback();
			}
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
		getSelectValue(value) {
			// console.log(value);
			if (value != "SURFACE") {
				this.radioValue = "BYTIME";
			}
			if (value == "SURFACE") {
				this.radioValue = "BYSURFACE";
			}
			this.selectValue = value;
		},
		getRadioValue(e) {
			this.radioValue = e.target.value;
			// console.log(e.target.value);
		},
		onSelectChange(a, b) {
			console.log(b);
			this.selectedRows = b;
			this.selectedRowKeys = a;
		},
		modalEditShow() {
			console.log(this.selectedRows);
			if (this.selectedRows.length != 1) {
				this.$message.error("只能修改一条数据！");
			} else {
				this.selectValue = this.selectedRows[0].workType;
				this.radioValue = this.selectedRows[0].priceType;
				this.modalEditVisible = true;
				setTimeout(() => {
					this.form.setFieldsValue({
						typeName: this.selectedRows[0].workTypeName,
						price: this.selectedRows[0].price,
						remarks: this.selectedRows[0].remarks,
						workType: this.selectedRows[0].workType
					});
				}, 100);
			}
		},
		onDelete() {
			let qs = require("qs");
			let data = qs.stringify({
				workTypeId: this.selectedRowKeys[0]
			});
			this.Axios(
				{
					url: "/api-platform/workType/del",
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
		edit(record, text, index) {
			this.modalEditVisible = true;
		},
		getList() {
			this.Axios(
				{
					url: "/api-platform/workType/list",
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
		},
		addProcessTypes(e) {
			e.preventDefault();
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					console.log(values);
					let qs = require("qs");
					let data = {
						typeName: values.typeName,
						price: values.price,
						remarks: values.remarks,
						priceType: this.radioValue,
						workType: values.workType
					};
					this.Axios(
						{
							url: "/api-platform/workType/add",
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
								this.modalNewVisible = false;
								this.form.resetFields();
								this.getList();
								this.selectedRowKeys = [];
								this.selectedRows = [];
								this.radioValue = "BYTIME";
								this.selectValue = "";
							}
						},
						({ type, info }) => {}
					);
				}
			});
		},
		editProcessTypes(e) {
			e.preventDefault();
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					let qs = require("qs");
					let data = {
						workTypeId: this.selectedRows[0].id,
						typeName: values.typeName,
						price: values.price,
						remarks: values.remarks,
						priceType: this.radioValue,
						workType: values.workType
					};
					this.Axios(
						{
							url: "/api-platform/workType/update",
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
								this.modalEditVisible = false;
								this.form.resetFields();
								this.getList();
								this.selectedRowKeys = [];
								this.selectedRows = [];
								this.radioValue = "BYTIME";
								this.selectValue = "";
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
	}
};
</Script>