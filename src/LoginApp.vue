<template>
	<div>
		<a-layout id="login-layout">
			<div class="logo_case">
				<img src="./assets/u8.png" title />
			</div>
			<div class="login-wrap">
				<a-card title="长虹生产管理系统-登录" :bordered="false">
					<p>
						<a-input placeholder="账号/员工编号" v-model="user.userName" ref="userNameInput" class>
							<a-icon slot="prefix" type="user" />
							<a-icon
								v-if="user.userName"
								slot="suffix"
								@click.stop="user.userName=''"
								type="close-circle"
								style="cursor: pointer;"
							/>
						</a-input>
					</p>
					<p>
						<a-input
							@keyup.enter.native="login()"
							type="password"
							placeholder="请输入密码"
							v-model="user.userPwd"
							ref="userNameInput"
						>
							<a-icon slot="prefix" type="lock" />
							<a-icon
								v-if="user.userPwd"
								slot="suffix"
								@click.stop="user.userPwd=''"
								style="cursor: pointer;"
								type="close-circle"
							/>
						</a-input>
					</p>
					<p>
						<a-input
							placeholder="请输入验证码"
							style="width:200px"
							v-model="user.identifyCode"
							ref="userNameInput"
							@keyup.enter.native="login()"
						>
							<a-icon slot="prefix" type="safety" />
						</a-input>
						<span @click="refreshCode" class="verifyCode_case">
							<Identify :identifyCode="identifyCode" :contentWidth="160" class="identify"></Identify>
							<span class="refresh">看不清，点击刷新</span>
						</span>
					</p>
					<p>
						<a-button type="primary" block @click="login">登录</a-button>
					</p>
				</a-card>
			</div>
		</a-layout>
		<div class="text_style">Sichuang Changhong Intelligent Manufacturing Technology Co. Ltd.</div>
		<div class="erweima">
			<img src="./assets/TGX3%ND]III)@IKUQ@(V_CT.png" alt />
			<p style="font-size:14px;color:#40a9ff;text-align:center;line-height:36px;">浏览器扫一扫</p>
		</div>
	</div>
</template>
<script>
import axios from "axios";
import Identify from "./components/public/Identify";
import md5 from "js-md5/src/md5.js";
import CryptoJS from "crypto-js/crypto-js.js";
import Vue from "vue";
import router from "./router";
import {
	Layout,
	Spin,
	Col,
	Row,
	Card,
	Input,
	Icon,
	message,
	Button
} from "ant-design-vue";
Vue.component(Layout.name, Layout);
Vue.component(Layout.Header.name, Layout.Header);
Vue.component(Layout.Content.name, Layout.Content);
Vue.component(Layout.Sider.name, Layout.Sider);
Vue.component(Layout.Footer.name, Layout.Footer);
Vue.component(Spin.name, Spin);
Vue.component(Col.name, Col);
Vue.component(Row.name, Row);
Vue.component(Card.name, Card);
Vue.component(Input.name, Input);
Vue.component(Icon.name, Icon);
Vue.component(Button.name, Button);
Vue.prototype.$message = message;

export default {
	data() {
		return {
			identifyCodes: "1234567890",
			identifyCode: "",
			user: {
				userName: "",
				userPwd: "",
				identifyCode: ""
			}
		};
	},
	mounted() {
		this.identifyCode = "";
		this.makeCode(this.identifyCodes, 4);
	},
	methods: {
		randomNum(min, max) {
			return Math.floor(Math.random() * (max - min) + min);
		},
		// 生成四位随机验证码
		makeCode(o, l) {
			for (let i = 0; i < l; i++) {
				this.identifyCode += this.identifyCodes[
					this.randomNum(0, this.identifyCodes.length)
				];
			}
			// this.user.identifyCode = this.identifyCode;
		},
		refreshCode() {
			this.identifyCode = "";
			this.makeCode(this.identifyCodes, 4);
		},
		encryptByDES(message, key) {
			const keyHex = CryptoJS.enc.Utf8.parse(key);
			const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
				mode: CryptoJS.mode.ECB,
				padding: CryptoJS.pad.Pkcs7
			});
			return encrypted.toString();
		},
		login() {
			// this.submitForm('loginList')
			if (this.user.userName == "" || this.user.userPwd == "") {
				this.$message.error("账号密码不能为空！");
				return false;
			}
			if (this.user.identifyCode == "") {
				this.$message.error("验证码不能为空！");
				return false;
			}
			if (this.user.identifyCode !== this.identifyCode) {
				this.$message.error("验证码输入错误！");
				return false;
			}
			let pass = this.user.userPwd;
			pass = md5(pass);
			let key = "*chang_hong_device_cloud";
			let a = pass;
			pass = this.encryptByDES(a, key);
			// console.log(this.password);
			let qs = require("qs");
			let data = qs.stringify({
				username: this.user.userName,
				// param: this.user.userName,
				password: pass,
				client_id: "webApp",
				client_secret:
					"4+rRL1RN5nsR5yzcCNt9+kyHHrba1Hi0BJiiEv0C9mAC4gKSZbiWLg==",
				grant_type: "password"
			});
			this.$axios
				.post(this.global.apiSrc + "/uaa/oauth/token", data)
				.then(
					response => {
						console.log(response);
						if (response.status === 200) {
							sessionStorage.token = response.data.access_token;
							this.getUserMsg(response.data.access_token);
						}
					},
					error => {
						console.log(error.response.status);
						if (error.response.status === 400) {
							this.$message.error("账号或密码错误");
						} else {
							this.$message.error(error.response.data.msg);
						}
					}
				)
				.catch(res => {
					// console.log(res);
					// this.$message.error("账号或密码错误");
				});
		},
		getUserMsg(token) {
			const instance = axios.create({});
			instance.defaults.headers.common["Authorization"] = "bearer " + token;
			// this.$axios
			// 	.get(this.global.apiSrc + "/api-sso/Admin/permission")
			// 	.then(response => {
			// 		console.log(response);
			// 	});
			this.Axios(
				{
					url: "/api-sso/Admin/permission",
					params: {},
					type: "get",
					option: { enableMsg: false }
				},
				this
			).then(
				result => {
					if (result.data.code === 200) {
						console.log(result.data.data);
						// sessionStorage.token = result.data.data.token;
						let permissionUrl =
							result.data.data.permissions != null &&
							result.data.data.permissions != ""
								? result.data.data.permissions.map(item => {
										return {
											module: item.permissionUrl,
											permissionItem:
												item.buttons != undefined
													? item.buttons.map(i => {
															return i.permissionUrl;
													  })
													: []
										};
								  })
								: [];
						console.log(permissionUrl);
						let user = { ...result.data.data };
						sessionStorage.permissionUrl = JSON.stringify(permissionUrl);
						sessionStorage.user = JSON.stringify(user);
						if (result.data.data.userType == 1) {
							window.location.href = "/Dashboard";
						}
						if (result.data.data.userType == 0) {
							window.location.href = "/Enterprise";
						}
					}
				},
				({ type, info }) => {
					if (info.code === 408) {
						this.$message.error("验证码错误");
					}
					if (info.code === 402) {
						this.$message.error("账号或密码错误");
					}
					if (info.code === 0) {
						this.$message.error("对不起，您的账户已被禁用");
					}
				}
			);
		},
		filterArray(data, parent) {
			let vm = this;
			var tree = [];
			var temp;
			for (var i = 0; i < data.length; i++) {
				if (data[i].parentCode == parent) {
					var obj = data[i];
					temp = this.filterArray(data, data[i].code);
					if (temp.length > 0) {
						obj.children = temp;
					}
					tree.push(obj);
				}
			}
			return tree;
		}
	},
	components: {
		Identify
	}
};
</script>
<style lang="less">
@import url("./assets/login.less");
.logo_case {
	position: absolute;
	top: -80px;
	left: 140px;
}
.verifyCode_case {
	position: absolute;
	top: 172px;
	right: 25px;
	overflow: hidden;
	&:hover {
		.refresh {
			opacity: 1;
		}
	}
}
.identify {
	width: 30;
	height: 32px;
	display: inline-block;
	overflow: hidden;
}
.refresh {
	cursor: pointer;
	position: absolute;
	top: 0px;
	right: 0px;
	color: white;
	width: 160px;
	height: 32px;
	line-height: 32px;
	background-color: rgba(0, 0, 0, 0.363);
	text-align: center;
	opacity: 0;
	transition: all 0.5s;
}
.text_style {
	position: absolute;
	bottom: 40px;
	width: 100%;
	text-align: center;
}
.erweima {
	position: absolute;
	right: 10px;
	top: 50%;
	width: 200px;
	height: 230px;
	font-size: 0;
	background-color: white;
	z-index: 100;
	margin-top: -115px;
	padding: 5px 5px 0;
	img {
		width: 190px;
	}
}
</style>
