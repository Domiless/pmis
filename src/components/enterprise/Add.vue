<template>
	<div class="enterprise_add">
		<a-form :form="form">
			<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 18 }" label="企业名称">
				<a-input
					maxlength="50"
					placeholder="填写企业名称"
					v-decorator="[
                    'enterpriseName',
                    {rules: [{ required: true, message: '填写企业名称' }]}
                    ]"
				></a-input>
			</a-form-item>
			<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 18 }" label="联系人">
				<a-input
					maxlength="20"
					placeholder="填写姓名"
					v-decorator="[
                    'contact',
                    {rules: [{ required: true, message: '填写联系人' }]}
                    ]"
				></a-input>
			</a-form-item>
			<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 18 }" label="手机号">
				<a-input
					type="number"
					maxlength="11"
					oninput="if(value.length>11)value=value.slice(0,11)"
					placeholder="填写手机号（用于接收通知、找回密码等）"
					v-decorator="[
                    'phone',
                    {rules: [{ required: true, message: '填写手机号' },{validator: chickPhone}]}
                    ]"
				></a-input>
			</a-form-item>
			<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 18 }" label="企业账号">
				<a-input
					maxlength="20"
					placeholder="4~20位字符组成"
					v-decorator="[
                    'account',
                    {rules: [{ required: true, message: '填写企业账号' },{validator: chickUserName}]}
                    ]"
				></a-input>
			</a-form-item>
			<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 18 }" label="初始密码">
				<a-input
					maxlength="20"
					type="password"
					placeholder="6~20位字符组成，区分大小写"
					v-decorator="[
                    'password',
                    {rules: [{ required: true, message: '填写密码' },{validator: chickPassword}]}]"
				></a-input>
			</a-form-item>
			<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 18 }" label="到期时间">
				<a-range-picker
					@change="onChange"
					v-decorator="[
                    'expireDate',
                    {rules: [{ required: true, message: '填选择到期时间' }]}
                    ]"
					format="YYYY/MM/DD"
				/>
			</a-form-item>
			<a-form-item :label-col=" { span: 4 }" :wrapper-col="{ span: 18 }" label="营业执照">
				<a-upload
					:action="global.apiImg"
					listType="picture-card"
					:fileList="fileList"
					@preview="handlePreview"
					@change="handleChange"
					v-decorator="[
                    'businessLicense',
                    {rules: [{ required: true, message: '请上传营业执照' }]}
                    ]"
				>
					<div v-if="fileList.length < 1">
						<a-icon type="plus" />
						<div class="ant-upload-text">上传文件</div>
					</div>
				</a-upload>
				<a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel" width="50%">
					<img alt="example" style="width: 100%" :src="previewImage" />
				</a-modal>
			</a-form-item>
			<a-form-item :wrapper-col="{ span: 18,offset: 4 }" style="text-align: right;">
				<a-button style="margin-right:12px;" @click="confirmCancel">取消</a-button>
				<a-button type="primary" @click="handleSubmit">保存</a-button>
			</a-form-item>
		</a-form>
	</div>
</template>
<script>
import Vue from "vue";
import { Col, Upload, Form, Input, Icon } from "ant-design-vue";
Vue.use(Col);
Vue.use(Upload);
Vue.use(Form);
Vue.use(Input);
Vue.use(Icon);
import md5 from "js-md5/src/md5.js";
import CryptoJS from "crypto-js/crypto-js.js";
export default {
	data() {
		return {
			expireDate: [],
			previewVisible: false,
			form: this.$form.createForm(this),
			fileList: [],
			previewImage: "",
			addMsg: {
				enterpriseName: "",
				contact: "",
				phone: "",
				account: "",
				password: "",
				businessLicense: ""
			}
		};
	},
	methods: {
		chickUserName(rule, value, callback) {
			// var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
			if (
				/^[0-9a-zA-Z]{4,20}$/g.test(value) === false &&
				value != "" &&
				value != null
			) {
				callback(new Error("账号只能是4到20位字母或者数字"));
			} else {
				callback();
			}
		},
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
		chickPassword(rule, value, callback) {
			var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
			if (
				/^((?=.*[a-z])|(?=.*\d)|(?=.*[#@!~%^&*]))[a-z\d#@!$~%^&*]{6,20}$/i.test(
					value
				) === false &&
				value != "" &&
				value != null
			) {
				callback(new Error("请输入6到20位的密码"));
			} else if (/(\w)*(\w)\2{5}(\w)*/g.test(value) === true) {
				callback(
					new Error("你的密码过于简单(不能含有连续6位相同的字符或者数字)")
				);
			} else if (reg.test(value) === true && value != "" && value != null) {
				callback(new Error("密码中不能含有汉字"));
			} else {
				callback();
			}
		},
		onChange(date, dateString) {
			console.log(date, dateString);
			this.expireDate = [...dateString];
			console.log(this.expireDate);
		},
		imgApi() {
			let url = this.global.apiImg;
			return url;
		},
		confirmCancel() {
			let params = { type: "cancel", visible: false };
			this.form.resetFields();
			this.$emit("changeAddModal", params);
		},
		handleCancel() {
			this.previewVisible = false;
		},
		handlePreview(file) {
			this.previewImage = file.url || file.thumbUrl;
			this.previewVisible = true;
		},
		handleChange({ fileList }) {
			this.fileList = fileList;
		},
		encryptByDES(message, key) {
			const keyHex = CryptoJS.enc.Utf8.parse(key);
			const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
				mode: CryptoJS.mode.ECB,
				padding: CryptoJS.pad.Pkcs7
			});
			return encrypted.toString();
		},
		handleSubmit(e) {
			e.preventDefault();
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					console.log("Received values of form: ", values);
					this.addMsg = { ...values };
					this.addMsg.expireDate = this.expireDate;
					this.addMsg.businessLicense = this.addMsg.businessLicense.file.response.data;
					this.addMsg.password = md5(this.addMsg.password);
					let key = "*chang_hong_device_cloud";
					this.addMsg.password = this.encryptByDES(this.addMsg.password, key);
					let params = {
						value: this.addMsg,
						visible: false
					};
					console.log(params);
					this.$emit("changeAddModal", params);
				}
			});
		}
	}
};
</script>

<style lang="less">
@import url("../../assets/less/publicStyle.less");
.enterprise_add {
}
</style>

