<template>
	<div class="material_management">
		<a-row>
			<div style="line-height:50px;">
				<a-col :span="12" style="padding:0 20px;">
					<a-button @click="$message.error('暂不支持自定义！')">
						<a-icon style="color:#1890ff;" type="plus" />新增
					</a-button>
				</a-col>
			</div>
		</a-row>
		<a-row>
			<a-col :span="24" style="padding:20px 20px;">
				<a-card hoverable style="width: 300px;display:inline-block;margin-right:12px;">
					<img alt="example" src="../../assets/u1663.svg" slot="cover" />
					<template class="ant-card-actions" slot="actions">
						<permission-button
							permCode="raw_raw_lookup.raw_raw_add"
							banType="hide"
							class="button_text"
							@click="addBoardVisible=true"
						>
							<a-icon type="plus" style="font-size:20px;" />
						</permission-button>
						<permission-button permCode banType="hide" class="button_text" @click="BoardListVisible=true">
							<i class="iconfont" style="font-size:16px">&#xe627;</i>
						</permission-button>
					</template>
					<a-card-meta title="板料" description="板料指由板坯轧制的光滑平面金属的半制品，其长度和宽度远远大于厚度。"></a-card-meta>
				</a-card>
				<a-card hoverable style="width: 300px;display:inline-block;margin-right:12px;">
					<img alt="example" src="../../assets/u1672.svg" slot="cover" />
					<template class="ant-card-actions" slot="actions">
						<permission-button
							permCode="raw_raw_lookup.raw_raw_add"
							banType="hide"
							class="button_text"
							@click="addStickVisible=true"
						>
							<a-icon type="plus" style="font-size:20px" />
						</permission-button>
						<permission-button permCode banType="hide" class="button_text" @click="StickListVisible=true">
							<i class="iconfont" style="font-size:16px">&#xe627;</i>
						</permission-button>
					</template>
					<a-card-meta title="棒料" description="棒料是针对于板材和其他型材而言，就是有一定长度的圆形或多边形长棍形状的材料。"></a-card-meta>
				</a-card>
				<a-card hoverable style="width: 300px;display:inline-block;">
					<img alt="example" src="../../assets/u2378.svg" slot="cover" />
					<template class="ant-card-actions" slot="actions">
						<permission-button
							permCode="raw_raw_lookup.raw_raw_add"
							banType="hide"
							class="button_text"
							@click="addProfileVisible=true"
						>
							<a-icon type="plus" style="font-size:20px" />
						</permission-button>
						<permission-button
							permCode
							banType="hide"
							class="button_text"
							@click="ProfileListVisible=true"
						>
							<i class="iconfont" style="font-size:16px">&#xe627;</i>
						</permission-button>
					</template>
					<a-card-meta title="型材" description="型材是指金属经过塑性加工成形，品种规格繁多，用途广泛，在轧制生产中占有非常重要的地位。"></a-card-meta>
				</a-card>
			</a-col>
		</a-row>
		<a-modal
			title="新增规格"
			width="800px"
			:visible="addBoardVisible"
			@cancel="handleCancel(1)"
			:maskClosable="false"
			class="modal_form_style"
			:footer="null"
		>
			<a-form :form="form" layout="inline" style="overflow:hidden" @keyup.enter.native="boardAdd">
				<a-col :span="12">
					<a-form-item label="名称">
						<a-input
							v-decorator="['name',{rules: [{ required: true, message: '请填写名称' }]}]"
							style="width:260px;"
							maxlength="20"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="物料编号">
						<a-input maxlength="20" v-decorator="['number']" style="width:260px;"></a-input>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="长">
						<a-input
							v-decorator="['lengthOrRadius',{rules: [{ required: true, message: '请填写长' },{validator: chickNumber1}]}]"
							type="number"
							oninput="if(value.length>10)value=value.slice(0,10)"
							style="width:260px;"
							addonAfter="mm"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="宽">
						<a-input
							v-decorator="['widthOrRadius',{rules: [{ required: true, message: '请填写宽' },{validator: chickNumber1}]}]"
							type="number"
							oninput="if(value.length>10)value=value.slice(0,10)"
							style="width:260px;"
							addonAfter="mm"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="厚">
						<a-input
							v-decorator="['heightOrLength',{rules: [{ required: true, message: '请填写厚' },{validator: chickNumber1}]}]"
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
					<a-form-item label="单价">
						<a-input
							v-decorator="['price',{rules: [{ required: true, message: '请填写单价' },{validator: chickNumberFloat}]}]"
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
						<a-button @click="handleCancel(1)" style="margin-right:12px;">取消</a-button>
						<a-button type="primary" @click="boardAdd">保存</a-button>
					</a-form-item>
				</a-col>
			</a-form>
		</a-modal>
		<a-modal
			title="新增规格"
			width="800px"
			:visible="addStickVisible"
			@cancel="handleCancel(2)"
			:maskClosable="false"
			class="modal_form_style"
			:footer="null"
		>
			<a-form :form="form" layout="inline" style="overflow:hidden" @keyup.enter.native="stickAdd">
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
					<a-form-item label="物料编号">
						<a-input maxlength="20" v-decorator="['number']" style="width:260px;"></a-input>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="半径">
						<a-input
							v-decorator="['lengthOrRadius',{rules: [{ required: true, message: '请填写半径' },{validator: chickNumber1}]}]"
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
							v-decorator="['heightOrLength',{rules: [{ required: true, message: '请填写长' },{validator: chickNumber1}]}]"
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
					<a-form-item label="单价">
						<a-input
							v-decorator="['price',{rules: [{ required: true, message: '请填写单价' },{validator: chickNumberFloat}]}]"
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
						<a-button @click="handleCancel(2)" style="margin-right:12px;">取消</a-button>
						<a-button type="primary" @click="stickAdd">保存</a-button>
					</a-form-item>
				</a-col>
			</a-form>
		</a-modal>
		<a-modal
			title="新增规格"
			width="800px"
			:visible="addProfileVisible"
			@cancel="handleCancel(5)"
			:maskClosable="false"
			class="modal_form_style"
			:footer="null"
		>
			<a-form :form="form" layout="inline" style="overflow:hidden" @keyup.enter.native="profileAdd">
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
					<a-form-item label="物料编号">
						<a-input maxlength="20" v-decorator="['number']" style="width:260px;"></a-input>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="长度">
						<a-input
							v-decorator="['length',{rules: [{ required: true, message: '请填写长度' },{validator: chickNumber1}]}]"
							type="number"
							oninput="if(value.length>10)value=value.slice(0,10)"
							style="width:260px;"
							addonAfter="mm"
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
							addonAfter="元/m"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="重量">
						<a-input
							v-decorator="['weight',{rules: [{ required: true, message: '请填写重量' },{validator: chickNumberFloat}]}]"
							type="number"
							oninput="if(value.length>10)value=value.slice(0,10)"
							style="width:260px;"
							addonAfter="kg/m"
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
						<a-button @click="handleCancel(5)" style="margin-right:12px;">取消</a-button>
						<a-button type="primary" @click="profileAdd">保存</a-button>
					</a-form-item>
				</a-col>
			</a-form>
		</a-modal>
		<a-modal
			title="板料"
			width="800px"
			:visible="BoardListVisible"
			@cancel="handleCancel(3)"
			:maskClosable="false"
			:footer="null"
		>
			<bord-list></bord-list>
		</a-modal>
		<a-modal
			title="棒料"
			width="800px"
			:visible="StickListVisible"
			@cancel="handleCancel(4)"
			:maskClosable="false"
			:footer="null"
		>
			<stick-list></stick-list>
		</a-modal>
		<a-modal
			title="型材"
			width="800px"
			:visible="ProfileListVisible"
			@cancel="handleCancel(6)"
			:maskClosable="false"
			:footer="null"
		>
			<profile-list></profile-list>
		</a-modal>
	</div>
</template>
<script>
import Vue from "vue";
import { Card, Col, Row, Modal, Icon, Input, Form } from "ant-design-vue";
Vue.use(Card);
Vue.use(Col);
Vue.use(Row);
Vue.use(Form);
Vue.use(Icon);
Vue.use(Input);
Vue.use(Modal);
import BordList from "./BordList";
import StickList from "./StickList";
import ProfileList from "./ProfileList";
export default {
	inject: ["reload"],
	data() {
		return {
			addBoardVisible: false,
			addProfileVisible: false,
			addStickVisible: false,
			BoardListVisible: false,
			StickListVisible: false,
			ProfileListVisible: false,
			form: this.$form.createForm(this)
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
		chickNumber1(rule, value, callback) {
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
		handleCancel(a) {
			if (a == 1) {
				this.addBoardVisible = false;
				this.form.resetFields();
			}
			if (a == 2) {
				this.addStickVisible = false;
				this.form.resetFields();
			}
			if (a == 3) {
				this.BoardListVisible = false;
				// this.reload();
			}
			if (a == 4) {
				this.StickListVisible = false;
				// this.reload();
			}
			if (a == 5) {
				this.addProfileVisible = false;
				this.form.resetFields();
			}
			if (a == 6) {
				this.ProfileListVisible = false;
			}
		},
		boardAdd() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					// console.log("Received values of form: ", values);
					let qs = require("qs");
					let data = {
						type: 1,
						lengthOrRadius: values.lengthOrRadius,
						widthOrRadius: values.widthOrRadius,
						heightOrLength: values.heightOrLength,
						name: values.name,
						remark: values.remark,
						number: values.number,
						density: values.density,
						price: values.price
					};
					this.Axios(
						{
							url: "/api-workorder/rawMaterial/add",
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
								this.addBoardVisible = false;
								this.form.resetFields();
								this.reload();
							}
						},
						({ type, info }) => {}
					);
				}
			});
		},
		stickAdd() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					// console.log("Received values of form: ", values);
					let qs = require("qs");
					let data = {
						type: 2,
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
							url: "/api-workorder/rawMaterial/add",
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
								this.addStickVisible = false;
								this.form.resetFields();
								this.reload();
							}
						},
						({ type, info }) => {}
					);
				}
			});
		},
		profileAdd() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					// console.log("Received values of form: ", values);
					let qs = require("qs");
					let data = {
						type: 3,
						lengthOrRadius: values.length,
						name: values.name,
						remark: values.remark,
						number: values.number,
						density: values.weight,
						price: values.price
					};
					this.Axios(
						{
							url: "/api-workorder/rawMaterial/add",
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
								this.addStickVisible = false;
								this.form.resetFields();
								this.reload();
							}
						},
						({ type, info }) => {}
					);
				}
			});
		}
	},
	created() {},
	components: {
		BordList,
		StickList,
		ProfileList
	}
};
</script>

<style lang="less">
@import url("../../assets/layout.less");
.material_management {
	.ant-card-meta-description {
		height: 70px;
	}
}
.modal_form_style {
	.ant-form-inline .ant-form-item > .ant-form-item-label {
		width: 100px;
	}
	.ant-form-inline .ant-form-item {
		margin-bottom: 20px;
	}
	.ant-input-number-handler-wrap {
		display: none;
	}
}
</style>
