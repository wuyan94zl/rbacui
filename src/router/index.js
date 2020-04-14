import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
            redirect: '/index'
        },
        {
            path: '/',
            component: () => import( /* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [{
                    path: '/menu',
                    component: () => import('../components/system/menu.vue'),
                    meta: { title: '菜单权限' }
                },
                {
                    path: '/role',
                    component: () => import('../components/system/role.vue'),
                    meta: { title: '角色管理' }
                },
                {
                    path: '/admin',
                    component: () => import('../components/system/admin.vue'),
                    meta: { title: '用户管理' }
                },

                {
                    path: '/news',
                    component: () => import('../components/content/news.vue'),
                    meta: { title: '新闻管理' }
                },
                {
                    path: '/index',
                    component: () => import('../components/page/index.vue'),
                    meta: { title: '系统首页' }
                },

                {
                    path: '/404',
                    component: () => import('../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import('../components/page/403.vue'),
                    meta: { title: '403' }
                },
            ]
        },
        {
            path: '/login',
            component: () => import('../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});