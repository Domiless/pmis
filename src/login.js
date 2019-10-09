import Vue from 'vue';
import LoginApp from './LoginApp';
// import './assets/threeEf';
import Axios from './AxiosRequest';
import axios from 'axios'
import global from './components/global/Global'
Vue.prototype.Axios = Axios;
Vue.prototype.$axios = axios;
Vue.prototype.global = global;
new Vue({
  el: '#app',
  components: {
    LoginApp
  },
  template: '<LoginApp/>'
});
