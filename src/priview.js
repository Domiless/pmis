import Vue from 'vue';
import PriviewAPP from './PriviewAPP';
import Axios from './AxiosRequest';
Vue.prototype.Axios = Axios;
new Vue({
  el: '#priview',
  components: {
    PriviewAPP
  },
  template: '<PriviewAPP/>'
});
