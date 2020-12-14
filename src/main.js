import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


import axios from 'axios'
import VueAxios from 'vue-axios'


//导入rem配置文件
import 'lib-flexible/flexible'
//从vant框架导入组件
import { 
  Button,
  Icon,
  Swipe,
  SwipeItem,
  Tabbar, 
  TabbarItem,
  NavBar,
  Toast,
  Search,
  PullRefresh,
  Checkbox, 
  CheckboxGroup
 } from 'vant';



//注册组件
Vue.use(Button);
Vue.use(Icon);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(NavBar);
Vue.use(Toast);
Vue.use(Search);
Vue.use(PullRefresh);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);






//axios拦截器，在发起请求之前执行
axios.interceptors.request.use(config =>{
  //处理post请求参数, 进行参数序列化
  if(config.method == 'post'){

     //序列化post请求参数
    let paramsString ='';

    for(let key in config.data){
      paramsString += `${key}=${config.data[key]}&`;
  }

   //重新赋值config.data
   config.data = paramsString.slice(0, -1);

   
}

//必须返回config
return config;
})



Vue.use(VueAxios, axios)

Vue.config.productionTip = false

import normalizeBooks from "./dom/BooksDom"
Vue.prototype.normalizeBooks = normalizeBooks;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
