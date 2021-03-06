import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import store from './store'
import VueI18n from 'vue-i18n';
import request from "@/utils/request";
import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import {getToken} from "@/utils/auth";

Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});
const i18n = new VueI18n({
    locale: 'zh',
    messages
});
Vue.prototype.$request = request //显式的绑定
// 使用钩子函数对路由进行权限跳转
// router.beforeEach((to, from, next) => {
//     document.title = `${to.meta.title} | vue-manage-system`;
//     const role = localStorage.getItem('ms_username');
//     if (!role && to.path !== '/login') {
//         next('/login');
//     } else if (to.meta.permission) {
//         // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
//         role === 'admin' ? next() : next('/403');
//     } else {
//         // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
//         if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
//             Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
//                 confirmButtonText: '确定'
//             });
//         } else {
//             next();
//         }
//     }
// });
router.beforeEach((to, from, next) => {
    if (getToken() !== 'undefined' && getToken()){//已登录
        if (to.path === '/login') next('/') // 如果访问的是登陆页面，直接跳转到主页
        else next() //想去哪里就去哪里
    }else if (to.path !== '/login')
        //没有登录
        next('/login') //如果不是登陆页面，重定向到登陆页面
    else next() //如果是登陆页面，就直接放行
    const role = localStorage.getItem("userName").replace(/^(\s|")+|(\s|")+$/g, '');
    if(to.meta.permission){
        if(to.path === '/table'){
            role === 'admin' ? next() : next('/403');
        }
        if(to.path === '/hoteltable'){
            role === 'admin' ? next() : next('/403');
        }
        if(to.path === '/ordertable'){
            role !== 'admin' ? next() : next('/403');
        }
        if(to.path === '/roomtable'){
            role !== 'admin' ? next() : next('/403');
        }
        if(to.path === '/charts'){
            role !== 'admin' ? next() : next('/403');
        }
    }
})

new Vue({
    router,
    i18n,
    store,
    render: h => h(App)
}).$mount('#app');
