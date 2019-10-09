// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex'
import App from './App';
import store from './store'
import axios from 'axios'
import router from './router';
import base from "./base.js";
import Axios from './AxiosRequest';
import global from './components/global/Global'
import menuSourceMap from "./router/routeMap";
import permissionPacker from "./PermissionPacker.js"
import {
  Alert,
  Button,
  Icon,
  message,
  notification,
  Modal
  // Mention,
  // version,
} from 'ant-design-vue';
Vue.config.productionTip = false;
Vue.prototype.Axios = Axios;
Vue.prototype.$axios = axios;
Vue.prototype.router = router;
Vue.prototype.global = global;
Vue.use(Vuex)
Vue.prototype.$message = message;
Vue.prototype.$notification = notification;
Vue.prototype.$info = Modal.info;
Vue.prototype.$success = Modal.success;
Vue.prototype.$error = Modal.error;
Vue.prototype.$warning = Modal.warning;
Vue.prototype.$confirm = Modal.confirm;
Vue.use(permissionPacker);
Vue.use(Button);
Vue.use(Icon);
Vue.use(Alert);

const instance = axios.create({});
let permissionUrl = [];
// 登录拦截
router.beforeEach((to, from, next) => {
  // global.imgPath = sessionStorage.getItem("imgPath");
  if (permissionUrl.length === 0) permissionUrl = JSON.parse(sessionStorage.getItem("permissionUrl") || '[]');
  let isLogin = sessionStorage.getItem('token')
  instance.defaults.headers.common["Authorization"] = "bearer " + isLogin;
  if (to.meta.requireAuth) { // 判断是否需要登录权限
    if (isLogin) { // 判断是否登录
      let isHasPermission = false;
      for (let i = 0, l = menuSourceMap.length; i < l; i++) {
        for (let m = 0, n = menuSourceMap[i].subMenu.length; m < n; m++) {
          let isCheck = permissionUrl.find(p => p.module === menuSourceMap[i].subMenu[m].permissionCode) ? true : false;
          let isRoute = menuSourceMap[i].subMenu[m].routeReg ? menuSourceMap[i].subMenu[m].routeReg.test(to.fullPath) : (menuSourceMap[i].subMenu[m].route === to.path) ? true : false;
          if ('/Organization' === menuSourceMap[i].subMenu[m].route) {

          }
          if (isRoute && (isCheck || menuSourceMap[i].defaultDock)) {
            isHasPermission = true;
            break;
          }
        }
      }
      if (isHasPermission) {
        next()
      } else {
        message.error("抱歉，您无权访问该页面！")
      }
    } else { // 没登录则跳转到登录界面
      window.location.href = "/login.html"
      // next({
      //   path: 'login.html',
      //   query: {
      //     redirect: to.fullPath
      //   }
      // })
    }
  } else {
    next()
  }
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>',
  store
})
