import {createRouter,createWebHistory} from 'vue-router' 

//导入组件
import LoginVue from "@/views/Login.vue";
import LayoutVue from "@/views/Layout.vue";
import WelcomeVue from '@/views/Welcome.vue'

import AddUserVue from '@/views/manage/addUser.vue'
import ResetUserPwdVue from "@/views/manage/resetPwd.vue"
import UserAvatarVue from '@/views/user/UserAvatar.vue'
import UserInfoVue from '@/views/user/UserInfo.vue'
import UserResetPasswordVue from '@/views/user/UserResetPassword.vue'
import SquareBoardVue from '@/views/square/SquareBoard.vue'
import pageInfoVue from '@/views/page/pageInfo.vue'



//定义路由关系
const routes = [
    {path:'/login', component:LoginVue},
    {path:'/', component:LayoutVue,redirect: '/welcome', children:[
        {path:'/welcome',component:WelcomeVue},
        {path:'/manage/addUser',component:AddUserVue},
        {path:'/manage/resetUserPwd',component:ResetUserPwdVue},
        {path:'/user/info',component:UserInfoVue},
        {path:'/user/avatar',component:UserAvatarVue},
        {path:'/user/resetPassword',component:UserResetPasswordVue},
        {path:'/square',component:SquareBoardVue},
        {path:'/square/pageInfo',component:pageInfoVue}
    ]}
]

//创建路由器
const router = createRouter({
    history:createWebHistory(),
    routes:routes
})

//导出路由
export default router