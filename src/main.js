import Vue from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';

Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});
const i18n = new VueI18n({
    locale: 'zh',
    messages
});

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | eachdemo`;
    const role = localStorage.getItem('access_token');
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
});
let baseURL = 'http://rbac6.me/' /*本地*/
// let baseURL = 'http://rbacapi.wuyan94zl.cn/' /*本地*/
Vue.prototype.$baseURL = baseURL;
// 创建axios实例
const service = axios.create({
    baseURL: baseURL,
    timeout: 10000 // 请求超时时间
});
// request拦截器
service.interceptors.request.use(config => {
    let access_token = localStorage.getItem('access_token');
    if (access_token) {
        config.headers['Authorization'] = 'Bearer ' + access_token // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
}, error => {
    Promise.reject(error);
});

// respone拦截器
service.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            let status = error.response.status;

            if (status == 401) {
                Vue.prototype.$message({
                    type: 'error',
                    message: '登录失败或失效!'
                });
                router.replace({
                    path: '/login'
                })
            } else if (status == 403) {
                Vue.prototype.$message({
                    type: 'error',
                    message: '您没有访问权限!'
                });
            } else if (status == 429) {
                Vue.prototype.$message({
                    type: 'error',
                    message: '请求频繁, 请稍后再试!'
                });
            } else if (status == 400) {
                if (error.response.data.status == 'INVALID_DATA') {
                    error.response.data.message.forEach(function(item) {
                        item.items.forEach(function(msg) {
                            setTimeout(() => {
                                Vue.prototype.$notify.error({
                                    title: '错误',
                                    message: msg,
                                });
                            }, 10);
                        })
                    });
                } else {
                    Vue.prototype.$message({
                        type: 'error',
                        message: error.response.data.message
                    });
                }
            } else if (status == 500) {
                Vue.prototype.$message({
                    type: 'error',
                    message: '服务器错误, 请联系管理员!'
                });
            } else if (status == 422) {
                let errors = error.response.data.errors;
                let message = '';
                for (let err in errors) {
                    message += errors[err][0] + '<br/>';
                }
                Vue.prototype.$message({
                    dangerouslyUseHTMLString: true,
                    message: message
                });
            }
        }
        Loading.service().close();
        return Promise.reject(error)
    }
);
export default service

Vue.prototype.$axios = service;

new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#app');
