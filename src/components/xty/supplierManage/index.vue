<template>
	<div class="supplierManage">
		<a-row style="line-height:50px;">
			<permission-button permCode="supplier_lookup.supplier_add" banType="hide" @click="showAdd">
				<a-icon style="color:#1890ff;" type="plus" />新增
			</permission-button>
			<permission-button
				permCode="supplier_lookup.supplier_update"
				banType="hide"
				@click="showEdit"
				:disabled="selectedRowKeys.length!=1"
			>
				<a-icon style="color:#1890ff;" type="edit" />修改
			</permission-button>
			<permission-button
				permCode="supplier_lookup.supplier_delete"
				banType="hide"
				@click="showDeleteConfirm"
				:disabled="selectedRowKeys.length!=1"
			>
				<a-icon style="color:#1890ff;" type="delete" />删除
			</permission-button>
		</a-row>
		<a-row>
			<a-col :span="24">
				<span>关键词 :</span>
				<a-input
					placeholder="供应商编码/名称/联系人/电话"
					style="width: 250px"
					v-model="keyWords"
					@keyup.enter.native="getList"
				></a-input>
				<a-button @click="getList">搜索</a-button>
			</a-col>
		</a-row>
		<a-row>
			<a-table
				rowKey="id"
				:columns="columns"
				:dataSource="data"
				:pagination="false"
				:rowSelection="{selectedRowKeys:selectedRowKeys,onChange: onSelectChange}"
			>
				<template slot="supplierName" slot-scope="text, record">
					<a href="javascript:" @click="showDetails(record)">{{text}}</a>
				</template>
			</a-table>
		</a-row>
		<a-row>
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
			v-model="addVisible"
			:maskClosable="false"
			:footer="null"
			width="1000px"
			style="top:20px"
			@cancel="cancelAdd"
		>
			<a-form :form="form">
				<a-row>
					<a-form-item label="供应商编码" :labelCol="{ span: 4}" :wrapperCol="{ span: 18}">
						<a-input
							v-decorator="[
							'supplierNo',
							{rules: [{ required: true, message: '请填写供应商编码' },{validator: checkSupplierNo}]}
							]"
							maxlength="20"
						></a-input>
					</a-form-item>
				</a-row>
				<a-row>
					<a-form-item label="供应商名称" :labelCol="{ span: 4}" :wrapperCol="{ span: 18}" required>
						<a-input
							v-decorator="[
							'supplierName',
							{rules: [{ required: true, message: '请填写供应商名称' }]}
							]"
						></a-input>
					</a-form-item>
				</a-row>
				<a-row>
					<a-form-item label="联系人" :labelCol="{ span: 4}" :wrapperCol="{ span: 18}" required>
						<a-input
							v-decorator="[
							'linkman',
							{rules: [{ required: true, message: '请填写联系人' }]}
							]"
						></a-input>
					</a-form-item>
				</a-row>
				<a-row>
					<a-form-item label="联系电话" :labelCol="{ span: 4}" :wrapperCol="{ span: 18}" required>
						<a-input
							v-decorator="[
							'linkPhone',
							{rules: [{ required: true, message: '请填写联系电话' }]}
							]"
							maxlength="20"
						></a-input>
					</a-form-item>
				</a-row>
				<a-row>
					<a-form-item label="法定代表人" :labelCol="{ span: 4}" :wrapperCol="{ span: 18}">
						<a-input
							v-decorator="['representative']"
						></a-input>
					</a-form-item>
				</a-row>
				<a-row>
					<a-form-item label="委托代理人" :labelCol="{ span: 4}" :wrapperCol="{ span: 18}">
						<a-input
							v-decorator="['entrusted']"
						></a-input>
					</a-form-item>
				</a-row>
				<a-row>
					<a-form-item label="开户银行" :labelCol="{ span: 4}" :wrapperCol="{ span: 18}">
						<a-input
							v-decorator="['bank']"
						></a-input>
					</a-form-item>
				</a-row>
				<a-row>
					<a-form-item label="账号" :labelCol="{ span: 4}" :wrapperCol="{ span: 18}">
						<a-input
							v-decorator="['bankAccount',
							{rules: [{validator: checkbankAccount}]}
							]"
						></a-input>
					</a-form-item>
				</a-row>
				<a-row>
					<a-form-item label="邮政编码" :labelCol="{ span: 4}" :wrapperCol="{ span: 18}">
						<a-input
							v-decorator="['postalcode',
							{rules: [{validator: checkpostalCode}]}
							]"
						></a-input>
					</a-form-item>
				</a-row>
				<a-row>
					<a-col :span="24">
						<a-form-item label="地址" :labelCol="{ span: 4}" :wrapperCol="{ span: 18}">
							<a-cascader
								v-decorator="['addressId']"
								:options="options"
								:showSearch="{filter}"
								placeholder="请选择"
								@change="onSelectAddressChange"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="24" :offset="4">
						<a-form-item :wrapperCol="{ span: 18}">
							<a-input v-decorator="['address']" placeholder="详细地址"></a-input>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-form-item label="备注" :labelCol="{ span: 4}" :wrapperCol="{ span: 18}">
						<a-textarea v-decorator="['remark']" :rows="4" :autosize="{ minRows: 4, maxRows: 4}"></a-textarea>
					</a-form-item>
				</a-row>
				<a-row>
					<a-form-item :wrapper-col="{ span: 20,offset: 2 }" style="text-align:right">
						<a-button @click="cancelAdd" style="margin-right:12px;">关闭</a-button>
						<a-button type="primary" @click="addSupplier()">提交</a-button>
					</a-form-item>
				</a-row>
			</a-form>
		</a-modal>
		<a-modal
			title="修改"
			v-model="editVisible"
			:maskClosable="false"
			:footer="null"
			width="1000px"
			style="top:20px"
			@cancel="cancelEdit"
		>
			<a-form :form="form">
				<a-row>
					<a-form-item label="供应商编码" :labelCol="{ span: 4}" :wrapperCol="{ span: 18}">
						<a-input
							v-decorator="[
							'supplierNo',
							{rules: [{ required: true, message: '请填写供应商编码' }]}
							]"
							disabled
						></a-input>
					</a-form-item>
				</a-row>
				<a-row>
					<a-form-item label="供应商名称" :labelCol="{ span: 4}" :wrapperCol="{ span: 18}" required>
						<a-input
							v-decorator="[
							'supplierName',
							{rules: [{ required: true, message: '请填写供应商名称' }]}
							]"
						></a-input>
					</a-form-item>
				</a-row>
				<a-row>
					<a-form-item label="联系人" :labelCol="{ span: 4}" :wrapperCol="{ span: 18}" required>
						<a-input
							v-decorator="[
							'linkman',
							{rules: [{ required: true, message: '请填写联系人' }]}
							]"
						></a-input>
					</a-form-item>
				</a-row>
				<a-row>
					<a-form-item label="联系电话" :labelCol="{ span: 4}" :wrapperCol="{ span: 18}" required>
						<a-input
							v-decorator="[
							'linkPhone',
							{rules: [{ required: true, message: '请填写联系电话' }]}
							]"
							maxlength="20"
						></a-input>
					</a-form-item>
				</a-row>
				<a-row>
					<a-form-item label="法定代表人" :labelCol="{ span: 4}" :wrapperCol="{ span: 18}">
						<a-input
							v-decorator="['representative']"
						></a-input>
					</a-form-item>
				</a-row>
				<a-row>
					<a-form-item label="委托代理人" :labelCol="{ span: 4}" :wrapperCol="{ span: 18}">
						<a-input
							v-decorator="['entrusted']"
						></a-input>
					</a-form-item>
				</a-row>
				<a-row>
					<a-form-item label="开户银行" :labelCol="{ span: 4}" :wrapperCol="{ span: 18}">
						<a-input
							v-decorator="['bank']"
						></a-input>
					</a-form-item>
				</a-row>
				<a-row>
					<a-form-item label="账号" :labelCol="{ span: 4}" :wrapperCol="{ span: 18}">
						<a-input
							v-decorator="['bankAccount',
							{rules: [{validator: checkbankAccount}]}
							]"
						></a-input>
					</a-form-item>
				</a-row>
				<a-row>
					<a-form-item label="邮政编码" :labelCol="{ span: 4}" :wrapperCol="{ span: 18}">
						<a-input
							v-decorator="['postalcode',
							{rules: [{validator: checkpostalCode}]}
							]"
						></a-input>
					</a-form-item>
				</a-row>
				<a-row>
					<a-col :span="24">
						<a-form-item label="地址" :labelCol="{ span: 4}" :wrapperCol="{ span: 18}">
							<a-cascader
								v-decorator="['addressId']"
								:options="options"
								:showSearch="{filter}"
								placeholder="请选择"
								@change="onSelectAddressChange"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="24" :offset="4">
						<a-form-item :wrapperCol="{ span: 18}">
							<a-input v-decorator="['address']" placeholder="详细地址"></a-input>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-form-item label="备注" :labelCol="{ span: 4}" :wrapperCol="{ span: 18}">
						<a-textarea v-decorator="['remark']" :rows="4" :autosize="{ minRows: 4, maxRows: 4}"></a-textarea>
					</a-form-item>
				</a-row>
				<a-row>
					<a-form-item :wrapper-col="{ span: 20,offset: 2 }" style="text-align:right">
						<a-button @click="cancelEdit" style="margin-right:12px;">关闭</a-button>
						<a-button type="primary" @click="updata()">提交</a-button>
					</a-form-item>
				</a-row>
			</a-form>
		</a-modal>
		<a-modal
			title="详情"
			:visible="detailsVisible"
			width="500px"
			:maskClosable="false"
			:footer="null"
			@cancel="detailsVisible=false"
		>
			<a-row>
				<span class="label_right" style="margin-bottom:12px;">供应商编码：</span>
				<span>{{ supplierDetails.supplierNo }}</span>
			</a-row>
			<a-row>
				<span class="label_right" style="margin-bottom:12px;">供应商名称：</span>
				<span>{{ supplierDetails.supplierName }}</span>
			</a-row>
			<a-row>
				<span class="label_right" style="margin-bottom:12px;">联系人：</span>
				<span>{{ supplierDetails.linkman }}</span>
			</a-row>
			<a-row>
				<span class="label_right" style="margin-bottom:12px;">法定代表人：</span>
				<span>{{ supplierDetails.representative }}</span>
			</a-row>
			<a-row>
				<span class="label_right" style="margin-bottom:12px;">委托联系人：</span>
				<span>{{ supplierDetails.entrusted }}</span>
			</a-row>
			<a-row>
				<span class="label_right" style="margin-bottom:12px;">开户银行：</span>
				<span>{{ supplierDetails.bank }}</span>
			</a-row>
			<a-row>
				<span class="label_right" style="margin-bottom:12px;">账号：</span>
				<span>{{ supplierDetails.bankAccount }}</span>
			</a-row>
			<a-row>
				<span class="label_right" style="margin-bottom:12px;">邮政编码：</span>
				<span>{{ supplierDetails.postalcode }}</span>
			</a-row>
			<a-row>
				<span class="label_right" style="margin-bottom:12px;">联系电话：</span>
				<span>{{ supplierDetails.linkPhone }}</span>
			</a-row>
			<a-row>
				<span class="label_right" style="margin-bottom:12px;">地址：</span>
				<span>{{ supplierDetails.address == "/" ? "" : supplierDetails.address }}</span>
			</a-row>
			<a-row>
				<span class="label_right" style="margin-bottom:12px;">备注：</span>
				<span>{{ supplierDetails.remark }}</span>
			</a-row>
		</a-modal>
	</div>
</template>
<script>
import Vue from "vue";
import { Cascader } from "ant-design-vue";
Vue.use(Cascader);
const columns = [
	{
		dataIndex: "supplierNo",
		title: "供应商编码",
		key: "supplierNo",
		width: "15%"
	},
	{
		dataIndex: "supplierName",
		title: "供应商名称",
		key: "supplierName",
		scopedSlots: { customRender: "supplierName" },
		width: "25%"
	},
	{
		dataIndex: "linkman",
		title: "联系人",
		key: "linkman",
		width: "15%"
	},
	{
		dataIndex: "linkPhone",
		title: "联系电话",
		key: "linkPhone",
		width: "15%"
	},
	{
		dataIndex: "remark",
		title: "备注",
		key: "remark"
	}
];
export default {
	data() {
		return {
			columns,
			data: [],
			addVisible: false,
			editVisible: false,
			detailsVisible: false,
			form: this.$form.createForm(this),
			current: 1,
			pageSize: 10,
			total: 0,
			selectedRowKeys: [],
			defaultValue: [],
			supplierDetails: [],
			dateValue: [],
			keyWords: "",
			country: [],
			province: [],
			city: [],
			block: [],
			options: [],
			address: "",
			addressPre: "",
			addressCodeArr: []
		};
	},
	methods: {
		checkSupplierNo(ruel, value, callback) {
			if (
				/^[a-zA-Z0-9\-]{1,20}$/.test(value) == false &&
				value != "" &&
				value != null
			) {
				callback(new Error("请输入1到20位字母数字或中划线的编号"));
			} else {
				callback();
			}
		},
		// checkPhone(rule, value, callback) {
		// 	if (
		// 		/^(1[23456789]\d{9}|^(0[1-9]\d{1,2}-)\d{6,7})$/.test(value) == false &&
		// 		value != "" &&
		// 		value != null
		// 	) {
		// 		callback(new Error("请输入正确的电话号码"));
		// 	} else {
		// 		callback();
		// 	}
		// },
		checkbankAccount(rule, value, callback) {
			if (
				/^[0-9]*$/.test(value) == false &&
				value != "" &&
				value != null
			) {
				callback(new Error("请输入数字"));
			} else {
				callback();
			}
		},
		checkpostalCode(rule, value, callback) {
			if (
				/^[0-9]{1,20}$/.test(value) == false &&
				value != "" &&
				value != null
			) {
				callback(new Error("请输入1到20位数字"));
			} else {
				callback();
			}
		},
		checkEmail(rule, value, callback) {
			if (
				/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value) == false &&
				value != "" &&
				value != null
			) {
				callback(new Error("请输入正确的电子邮箱"));
			} else {
				callback();
			}
		},
		displayRender(a, b) {
			console.log(a, b);
		},
		onSelectAddressChange(value, selectedOptions) {
			console.log(value, selectedOptions);
			this.addressCodeArr = value;
			if (selectedOptions != "" && typeof(selectedOptions) != "undefined") {
				this.address = selectedOptions.map(item => item.label).join("/");
				console.log(this.address);
			}else {
				this.address = '';
			}
		},
		filter(inputValue, path) {
			return path.some(
				option =>
					option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
			);
		},
		cancelEdit() {
			this.editVisible = false;
			this.form.resetFields();
			this.selectedRowKeys = [];
		},
		showDetails(row) {
			this.supplierDetails = row;
			console.log(this.supplierDetails);
			if( this.supplierDetails.address.indexOf("undefined") != -1) {
				this.supplierDetails.address = this.supplierDetails.address.replace(";undefined","");
			}
			if( this.supplierDetails.address.split(";")[0] == "" ) {
				this.supplierDetails.address = this.supplierDetails.address.replace(/;/g,"");
			}else{
				this.supplierDetails.address = this.supplierDetails.address.replace(/;/g,"/");
			}
			this.detailsVisible = true;
			console.log(this.supplierDetails);
		},
		onChangeRange(date, datestring) {
			this.dateValue = datestring;
			console.log(this.dateValue);
		},
		handleProvinceChange(value) {
			this.cities = cityData[value];
			this.secondCity = cityData[value][0];
		},
		handleCityChange(value) {
			this.secondCity = cityData[value];
			this.thirdCity = areaData[value];
		},
		showAdd() {
			this.addVisible = true;
			this.getNo();
		},
		showEdit() {
			this.editVisible = true;
			this.findOne(this.selectedRowKeys[0]);
		},
		cancelAdd() {
			this.addVisible = false;
			this.form.resetFields();
		},
		onSelectChange(selectedRowKeys, arr) {
			this.selectedRowKeys = selectedRowKeys;
			this.defaultValue = arr;
			console.log(this.selectedRowKeys);
			console.log(this.defaultValue);
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
		addSupplier() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					console.log("Received values of form: ", values);
					// if (!this.checkedKeys.length) {
					// 	this.$message.error("请分配角色权限");
					// 	return false;
					// }
					let qs = require("qs");
					let addressValue = '';
					if(this.address == '' && typeof(values.address) == 'undefined' ){
						addressValue = '';
					} else if(typeof(values.address) == 'undefined'){
						addressValue = this.address;
					} else if(this.address == '') {
						addressValue = values.address;
					} else {
						addressValue = this.address + ";" + values.address;
					}
					let data = {
						supplierNo: values.supplierNo,
						supplierName: values.supplierName,
						linkman: values.linkman,
						linkPhone: values.linkPhone,
						representative: values.representative,
						entrusted: values.entrusted,
						bank: values.bank,
						bankAccount: values.bankAccount,
						postalcode: values.postalcode,
						areaCode: this.addressCodeArr.join(","),
						address: addressValue,
						remark: values.remark
					};
					console.log(data);

					this.Axios(
						{
							url: "/api-order/supplier/add",
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
								this.getList();
								this.form.resetFields();
								this.addVisible = false;
								this.addressCodeArr = [];
								this.address = '';
							}
						},
						({ type, info }) => {}
					);
				}
			});
		},
		updata() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					console.log("Received values of form: ", values);
					// if (!this.checkedKeys.length) {
					// 	this.$message.error("请分配角色权限");
					// 	return false;
					// }
					let qs = require("qs");
					let addressValue = '';
					if(this.address == '' && typeof(values.address) == 'undefined' ){
						addressValue = '';
					} else if(typeof(values.address) == 'undefined'){
						addressValue = this.address;
					} else if(this.address == '') {
						addressValue = values.address;
					} else {
						addressValue = this.address + ";" + values.address;
					}
					let data = {
						id: this.selectedRowKeys[0],
						supplierNo: values.supplierNo,
						supplierName: values.supplierName,
						linkman: values.linkman,
						linkPhone: values.linkPhone,
						representative: values.representative,
						entrusted: values.entrusted,
						bank: values.bank,
						bankAccount: values.bankAccount,
						postalcode: values.postalcode,
						areaCode: this.addressCodeArr.join(","),
						address: addressValue,
						remark: values.remark
					};
					console.log(data);
					this.Axios(
						{
							url: "/api-order/supplier/update",
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
								this.getList();
								this.form.resetFields();
								this.editVisible = false;
								this.selectedRowKeys = [];
								this.addressCodeArr = [];
								this.address = '';
							}
						},
						({ type, info }) => {}
					);
				}
			});
		},
		getNo() {
			this.Axios(
				{
					url: "/api-order/supplier/getNo",
					type: "get",
					params: {
						num: "GGS"
					},
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						setTimeout(() => {
							this.form.setFieldsValue({
								supplierNo: result.data.data
							});
						}, 100);
					}
				},
				({ type, info }) => {}
			);
		},
		getList() {
			this.Axios(
				{
					url: "/api-order/supplier/list",
					type: "get",
					params: {
						page: this.current,
						size: this.pageSize,
						keyword: this.keyWords
						// state: this.state,
						// beginDate: this.beginDate != "" ? this.beginDate : null,
						// endDate: this.endDate != "" ? this.endDate : null
					},
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
		onDelete(e) {
			console.log("delete" + this.selectedRowKeys);
			let qs = require("qs");
			let data = qs.stringify({
				id: this.selectedRowKeys[0]
			});
			this.Axios(
				{
					url: "/api-order/supplier/delete",
					params: data,
					type: "post",
					option: { successMsg: "删除成功！" }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result);
						this.getList();
						this.selectedRowKeys = [];
					}
				},
				({ type, info }) => {}
			);
		},
		findOne(id) {
			this.Axios(
				{
					url: "/api-order/supplier/findone",
					params: {
						id: id
					},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result.data.data);
						setTimeout(() => {
							this.form.setFieldsValue({
								supplierNo: result.data.data.supplierNo,
								supplierName: result.data.data.supplierName,
								linkman: result.data.data.linkman,
								linkPhone: result.data.data.linkPhone,
								representative: result.data.data.representative,
								entrusted: result.data.data.entrusted,
								bank: result.data.data.bank,
								bankAccount: result.data.data.bankAccount,
								postalcode: result.data.data.postalcode,
								addressId: result.data.data.areaCode.split(","),
								address: result.data.data.address.split(";")[1] == "undefined" ? "" : result.data.data.address.split(";")[1],
								remark: result.data.data.remark
							});
						}, 100);
					}
					this.address = result.data.data.address.split(";")[0];
					this.addressCodeArr = result.data.data.areaCode.split(",");
					console.log(this.address);
					console.log(this.addressCodeArr);
				},
				({ type, info }) => {}
			);
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
		getArea() {
			this.$axios.get("./static/area.json").then(res => {
				let that = this;
				let data = res.data.area;

				data = data.map(item => {
					return {
						label: item.areaName,
						value: item.adcode
					};
				});

				for (var item in data) {
					if (data[item].value.match(/100000$/)) {
						that.country.push({
							value: data[item].value,
							label: data[item].label,
							children: []
						});
					} else if (data[item].value.match(/0000$/)) {
						//省
						that.province.push({
							value: data[item].value,
							label: data[item].label,
							children: []
						});
					} else if (data[item].value.match(/00$/)) {
						//市
						that.city.push({
							value: data[item].value,
							label: data[item].label,
							children: []
						});
					} else {
						//区
						that.block.push({
							value: data[item].value,
							label: data[item].label
						});
					}
				}
				// 分类市级
				for (var index in that.province) {
					for (var index1 in that.city) {
						if (
							that.province[index].value.slice(0, 2) ===
							that.city[index1].value.slice(0, 2)
						) {
							that.province[index].children.push(that.city[index1]);
						}
					}
				}
				//  分类区级
				for (var item1 in that.city) {
					for (var item2 in that.block) {
						if (
							that.block[item2].value.slice(0, 4) ===
							that.city[item1].value.slice(0, 4)
						) {
							that.city[item1].children.push(that.block[item2]);
						}
					}
				}
				that.country[0].children.push(that.province);
				that.options = that.country[0].children[0];
				console.log(that.options);
				// sessionStorage.setItem("area", JSON.stringify(that.country));
				// this.$store.commit("getArea", Object.assign({},that.country));
			});
		}
	},
	computed: {
		rowSelection() {
			const { selectedRowKeys } = this;
			return {
				onChange: (selectedRowKeys, selectedRows) => {
					console.log(
						`selectedRowKeys: ${selectedRowKeys}`,
						"selectedRows: ",
						selectedRows
					);
				},
				getCheckboxProps: record => ({
					props: {
						disabled: record.name === "Disabled User",
						name: record.name
					}
				})
			};
		}
	},
	created() {
		this.getList();
		this.getArea();
	}
};
</script>
<style lang="less" scoped>
.supplierManage {
	padding: 0 20px;
	.ant-row:nth-child(1) {
		margin-bottom: 10px;
	}
	.ant-row:nth-child(2) {
		margin-bottom: 10px;
	}
	.ant-form {
		.ant-row {
			height: 45px;
			margin-bottom: 5px;
		}
	}
}
.label_right {
	display: inline-block;
	width: 120px;
	text-align: right;
}
</style>