<template>
	<a-locale-provider :locale="zh_CN">
		<a-layout id="components-layout">
			<a-layout-header class="header">
				<a-row>
					<a-col :span="16">
						<div class="logo">
							<p>生产管理系统</p>Changhong
						</div>
						<a-modal
							title="修改密码"
							:footer="null"
							width="500px"
							:visible="changePassword"
							@cancel="changePassword=false;form.resetFields();"
							:maskClosable="false"
						>
							<a-form :form="form">
								<a-form-item :label-col=" { span: 5 }" :wrapper-col="{ span: 18 }" label="原密码">
									<a-input
										type="password"
										v-decorator="['old',{rules: [{ required: true, message: '请填写原密码' }]}]"
									></a-input>
								</a-form-item>
								<a-form-item :label-col=" { span: 5 }" :wrapper-col="{ span: 18 }" label="新密码">
									<a-input
										type="password"
										v-decorator="['newPassword',{rules: [{ required: true, message: '请填写新密码' }]}]"
									></a-input>
								</a-form-item>
								<a-form-item :label-col=" { span: 5 }" :wrapper-col="{ span: 18 }" label="确认新密码">
									<a-input
										type="password"
										v-decorator="['affirmNew',{rules: [{ required: true, message: '请填写确认新密码' }]}]"
									></a-input>
								</a-form-item>
								<a-form-item :wrapper-col="{ span:18,offset: 5 }" style="text-align:right">
									<a-button @click="changePassword=false;form.resetFields();" style="margin-right:12px;">取消</a-button>
									<a-button type="primary" @click="toChengePassword">确定</a-button>
								</a-form-item>
							</a-form>
						</a-modal>
						<ul class="header_menu_case">
							<li
								class="header_menu_style"
								v-for="(item,index) in headerMenuGroup"
								:key="index"
								@click="getMenu(item.key)"
								:class="[{hide:item.disable}]"
							>
								<span>
									<i class="iconfont anticon" v-html="item.icon"></i>
									<br />
									{{item.title}}
								</span>
							</li>
						</ul>
						<!-- <a-menu theme="dark" mode="horizontal" class="header-menu" :selectable="false">
							<a-menu-item
								v-for="(item,index) in headerMenuGroup"
								:key="index"
								@click="getMenu(item.key)"
								:class="[{hide:item.disable}]"
							>
								<span>
									<i class="iconfont anticon" v-html="item.icon"></i>
									<br />
									{{item.title}}
								</span>
							</a-menu-item>
						</a-menu>-->
					</a-col>
					<a-col :span="8" class="header-user">
						<router-link to><{{enterpriseName}}></router-link>
						<router-link to>你好，{{userName}}</router-link>

						<router-link to>
							<a-tooltip placement="bottom">
								<template slot="title">
									<span>修改密码</span>
								</template>
								<i class="iconfont" @click="changePassword=true">&#xe604;</i>
							</a-tooltip>
						</router-link>
						<router-link to>
							<a-tooltip placement="bottom">
								<template slot="title">
									<span>退出系统</span>
								</template>
								<a-icon type="logout" @click="toLogin" />
							</a-tooltip>
						</router-link>
					</a-col>
				</a-row>
			</a-layout-header>
			<a-layout>
				<a-layout-sider
					width="200"
					collapsedWidth="60"
					style="background: #fff"
					defaultCollapsed
					collapsible
					v-model="collapsed"
				>
					<a-menu
						mode="inline"
						:defaultOpenKeys="['workdesk']"
						:selectable="false"
						:style="{ height: '100%', borderRight: 0 }"
					>
						<!-- v-if="menu.subMenu.length!==1" -->
						<a-sub-menu :key="menu.permissionCode" v-for="(menu,index) in menuSource">
							<span slot="title">
								<i class="iconfont anticon" v-html="menu.icon"></i>
								<span>{{menu.menu}}</span>
							</span>
							<a-menu-item
								:key="sub_menu.key"
								v-for="(sub_menu,index2) in menu.subMenu"
								@click="switchTab(sub_menu.key)"
							>&nbsp;{{sub_menu.menu}}</a-menu-item>
						</a-sub-menu>
						<!-- <a-menu-item
							:key="sub_menu.key"
							v-else
							v-for="(sub_menu,index2) in menu.subMenu"
							@click="switchTab(sub_menu.key)"
						>
							<i class="iconfont anticon" v-html="menu.icon"></i>
							{{sub_menu.menu}}
						</a-menu-item>-->
					</a-menu>
				</a-layout-sider>
				<a-layout style="padding: 0px 12px 0 12px;">
					<div class="main-tabs">
						<ul>
							<li
								v-for="(item,index) in tabsList"
								v-bind:class="{ active: item.active}"
								@click="switchTab(item.key)"
								:key="index"
							>
								<span>{{item.title}}</span>
								<a-icon @click.stop="closeTab(item.key)" type="close" />
							</li>
						</ul>
						<a-button style="float:right;margin-top:8px" shape="circle" @click="reload" icon="redo" />
					</div>

					<a-layout-content
						:style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
					>
						<center v-if="!isShow">
							<a-spin />
						</center>
						<keep-alive :include="cachedViews">
							<router-view v-if="isShow" />
						</keep-alive>
					</a-layout-content>
				</a-layout>
			</a-layout>
			<a-layout-footer>PMS (V1.2.3_beta（内测版）) ©2019 Created by Changhong Intelligent Manufacturing</a-layout-footer>
		</a-layout>
	</a-locale-provider>
</template>
<script>
import md5 from "js-md5/src/md5.js";
import CryptoJS from "crypto-js/crypto-js.js";
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
import Vue from "vue";
import router from "./router";
//import './assets/font.css';
import {
	Layout,
	Menu,
	Breadcrumb,
	Spin,
	Col,
	Row,
	Badge,
	Tooltip,
	LocaleProvider
} from "ant-design-vue";
import productionMap from "./router/routeMap";
import homeMap from "./router/homeMap";
import designMap from "./router/designMap";
import projectMap from "./router/projectMap";
import procurementMap from "./router/procurementMap";
import systemMap from "./router/systemMap";

import clone from "clone";
Vue.component(Layout.name, Layout);
Vue.component(Layout.Header.name, Layout.Header);
Vue.component(Layout.Content.name, Layout.Content);
Vue.component(Layout.Sider.name, Layout.Sider);
Vue.component(Layout.Footer.name, Layout.Footer);
Vue.component(Menu.name, Menu);
Vue.component(Menu.Item.name, Menu.Item);
Vue.component(Menu.SubMenu.name, Menu.SubMenu);
Vue.component(Menu.SubMenu.name, Menu.SubMenu);
Vue.component(Breadcrumb.name, Breadcrumb);
Vue.component(Breadcrumb.Item.name, Breadcrumb.Item);
Vue.component(Spin.name, Spin);
Vue.component(Col.name, Col);
Vue.component(Row.name, Row);
Vue.component(Badge.name, Badge);
Vue.component(Tooltip.name, Tooltip);
Vue.use(LocaleProvider);

const global = window;
export default {
	provide() {
		return {
			reload: this.reload
		};
	},
	data() {
		return {
			menuSourceMap: [],
			form: this.$form.createForm(this),
			changePassword: false,
			zh_CN,
			collapsed: false,
			menuSource: [],
			isShow: true,
			cachedViews: [],
			version: versionInfo,
			node_dev: process.env.NODE_ENV,
			tabsList:
				JSON.parse(sessionStorage.getItem("user")).userType == 0
					? []
					: [
							{
								key: "dashboard",
								title: "首页",
								route: "/Dashboard",
								active: true
							}
					  ],
			headerMenu: ["dashboard"],
			headerMenuGroup: [
				{
					title: "工作台",
					icon: "&#xe60a;",
					key: "home",
					disable: false
				},
				{
					title: "生产",
					icon: "&#xe60a;",
					key: "production",
					disable: false
				},
				{
					title: "项目",
					icon: "&#xe60a;",
					key: "project",
					disable: false
				},
				{
					title: "设计",
					icon: "&#xe60a;",
					key: "design",
					disable: false
				},
				{
					title: "采购",
					icon: "&#xe60a;",
					key: "procurement",
					disable: false
				},
				{
					title: "仓库",
					icon: "&#xe60a;",
					key: "warehouse",
					disable: false
				},
				{
					title: "统计",
					icon: "&#xe60a;",
					key: "statistics ",
					disable: false
				},
				{
					title: "系统",
					icon: "&#xe60a;",
					key: "system",
					disable: false
				}
			],
			userType: JSON.parse(sessionStorage.getItem("user")).userType,
			userName: JSON.parse(sessionStorage.getItem("user")).userName,
			enterpriseName: JSON.parse(sessionStorage.getItem("user")).enterpriseName
		};
	},
	methods: {
		getMenu(key) {
			sessionStorage.menuKey = key;
			this.menuSourceMap =
				key == "production"
					? productionMap
					: key == "home"
					? homeMap
					: key == "design"
					? designMap
					: key == "project"
					? projectMap
					: key == "procurement"
					? procurementMap
					: key == "system"
					? systemMap
					: [];
			this.initPermission();
		},
		encryptByDES(message, key) {
			const keyHex = CryptoJS.enc.Utf8.parse(key);
			const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
				mode: CryptoJS.mode.ECB,
				padding: CryptoJS.pad.Pkcs7
			});
			return encrypted.toString();
		},
		toChengePassword() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					// console.log(values);
					let key = "*chang_hong_device_cloud";
					let old = values.old;
					let affirmNew = values.affirmNew;
					let newPassword = values.newPassword;
					old = md5(old);
					old = this.encryptByDES(old, key);
					affirmNew = md5(affirmNew);
					affirmNew = this.encryptByDES(affirmNew, key);
					newPassword = md5(newPassword);
					newPassword = this.encryptByDES(newPassword, key);
					let data = {
						oldPwd: old,
						newPwd: newPassword,
						confirmPwd: affirmNew
					};
					this.Axios(
						{
							url: "/api-sso/adminInfo/updatePwd",
							params: data,
							type: "post",
							option: { enableMsg: false },
							config: {
								headers: { "Content-Type": "application/json" }
							}
						},
						this
					).then(
						result => {
							if (result.data.code === 200) {
								console.log(result);
								this.form.resetFields();
								this.changePassword = false;

								this.$info({
									title: "温馨提示",
									content: "密码修改成功，即将跳转至登录页面",
									onOk() {
										sessionStorage.clear();
										window.location.href = "/login.html";
									}
								});
							}
						},
						({ type, info }) => {}
					);
				}
			});
		},
		toLogin() {
			window.location.href = "/login.html";
			sessionStorage.removeItem("token");
			sessionStorage.removeItem("user");
			sessionStorage.removeItem("priview");
			sessionStorage.removeItem("priviewType");
		},
		switchTab(key, path) {
			//先检查tabsList
			let chooseMenu = this.tabsList.find(item => item.key == key);
			if (!chooseMenu) {
				//从menuSourceMap取得
				let _m = null;
				this.menuSourceMap.forEach(menu => {
					let m = menu.subMenu.find(i => i.key === key);
					if (m) _m = m;
				});
				if (_m) {
					chooseMenu = {
						key: _m.key,
						title: _m.menu,
						route: _m.route,
						active: true
					};
					this.tabsList.push(chooseMenu);
				}
			}
			const arr = clone(this.tabsList);
			arr.forEach(item => {
				item.active = item.key === chooseMenu.key ? true : false;
			});
			this.tabsList = arr;
			//if (chooseMenu) window.location.hash = chooseMenu.key;
			this.$router.push({ path: path ? path : chooseMenu.route });
		},
		closeTab(key) {
			let chooseMenu = this.tabsList.find(item => item.key == key);
			const index = this.tabsList.indexOf(chooseMenu);
			this.tabsList = this.tabsList.filter(item => item.key !== key);
			if (this.tabsList.length === 0 || !chooseMenu.active) {
				return;
			}
			if (index > 0) {
				this.switchTab(this.tabsList[index - 1].key);
			} else {
				this.switchTab(this.tabsList[index].key);
			}
		},
		reload() {
			//重新加载组件
			const _tabsList = clone(this.tabsList);
			this.isShow = false;
			this.tabsList = this.tabsList.filter(item => !item.active);
			window.setTimeout(() => {
				this.tabsList = _tabsList;
				this.isShow = true;
			}, 100);
		},
		initPermission() {
			const permissionUrl = JSON.parse(
				sessionStorage.getItem("permissionUrl") || "[]"
			);
			let _menuSource = [];
			clone(this.menuSourceMap).forEach(per => {
				if (per.defaultDock) {
					_menuSource.push(per);
				} else {
					const willShowMenu = per.subMenu.filter(m => {
						if (m.visible) {
							return false;
						}
						// return true;
						return permissionUrl.find(p => p.module === m.permissionCode)
							? true
							: false;
					});
					if (willShowMenu.length !== 0) {
						per.subMenu = willShowMenu;
						_menuSource.push(per);
					}
				}
			});
			this.menuSource = _menuSource;
		}
		// initHeaderMenu() {
		// 	let _headerMenuGroup = []; //clone(this.headerMenuGroup);
		// 	const _headerMenu = this.headerMenu;
		// 	this.menuSourceMap.forEach(item => {
		// 		let obj = item.subMenu.find(menu => {
		// 			return _headerMenu.find(i => i === menu.key) ? true : false;
		// 		});
		// 		if (obj) {
		// 			obj["icon"] = item.icon;
		// 			_headerMenuGroup.push(obj);
		// 		}
		// 	});
		// 	this.headerMenuGroup = _headerMenuGroup;
		// }
	},
	mounted() {
		const hash = this.$route.path;
		for (let i = 0, l = this.menuSourceMap.length; i < l; i++) {
			for (let m = 0, n = this.menuSourceMap[i].subMenu.length; m < n; m++) {
				let isRoute = this.menuSourceMap[i].subMenu[m].routeReg
					? this.menuSourceMap[i].subMenu[m].routeReg.test(this.$route.fullPath)
					: this.menuSourceMap[i].subMenu[m].route === this.$route.path
					? true
					: false;
				if (isRoute) {
					this.switchTab(
						this.menuSourceMap[i].subMenu[m].key,
						this.$route.path
					);
				}
			}
		}
	},
	watch: {
		$route() {},
		tabsList() {
			this.cachedViews = this.tabsList.map(item => item.key);
		}
	},
	created() {
		let menuKey = sessionStorage.getItem("menuKey");
		this.menuSourceMap =
			menuKey == "production"
				? productionMap
				: menuKey == "home"
				? homeMap
				: menuKey == "design"
				? designMap
				: menuKey == "project"
				? projectMap
				: menuKey == "procurement"
				? procurementMap
				: menuKey == "system"
				? systemMap
				: homeMap;
		this.initPermission();
		// this.initHeaderMenu();
	}
};
</script>

<style lang="less">
@import url("./assets/font.css");
@import url("./assets/layout.less");
.ant-layout-content {
	overflow: scroll;
}
body {
	min-width: 1200px;
}
.ant-menu-root.ant-menu-vertical,
.ant-menu-root.ant-menu-vertical-left,
.ant-menu-root.ant-menu-vertical-right,
.ant-menu-root.ant-menu-inline {
	overflow-x: hidden;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
	-webkit-appearance: none;
}
input[type="number"] {
	-moz-appearance: textfield;
}
.header_menu_case {
	width: calc(100% - 118px);
	height: 100%;
	overflow: hidden;
	.header_menu_style {
		cursor: pointer;
		float: left;
		color: white;
		list-style-type: none;
		line-height: 24px;
		text-align: center;
		width: 120px;
		height: 60px;
		padding-top: 10px;
		&:hover {
			background-color: #14202b;
		}
		i {
			font-size: 24px;
		}
	}
}
</style>
