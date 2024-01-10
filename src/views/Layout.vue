<script setup>
import {
    Management,
    Promotion,
    UserFilled,
    User,
    Crop,
    EditPen,
    SwitchButton,
    CaretBottom
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'

import { userInfoService } from '@/api/user.js';
import useUserInfoStore from '@/stores/userInfo.js'
import { useTokenStore } from '@/stores/token.js'
const tokenStore = useTokenStore();
const userInfoStore = useUserInfoStore();
//调用函数，获取用户详细信息

const getUserInfo = async () => {
    //调用接口
    const result = await userInfoService();
    //数据存储到pinia
    userInfoStore.setInfo(result.data)
}

getUserInfo();

//条目被点击后，调用的函数
import { userLogoutService } from '@/api/user.js';
import { useRouter } from 'vue-router';
const router = useRouter();
import { ElMessage, ElMessageBox } from 'element-plus';
const handleCommand = (command) => {
    //判断指令
    if (command === 'logout') {
        //退出登录
        ElMessageBox.confirm(
            '您确认退出登录吗？',
            '温馨提示',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(async () => {
            //退出登录
            //1.清空pinia中存储的token以及个人信息
            tokenStore.removeToken();
            userInfoStore.removeInfo();
            let result = userLogoutService();
            //2.跳转到登录页面
            router.push('/login')
            ElMessage({
                type: 'success',
                message: result.msg?result.msg:"退出登录成功"
            })
        }).catch(() => {
            ElMessage({
                type: 'info',
                message: '用户已取消退出登录'
            })
        })
    } else {
        //路由
        router.push('/user/' + command)
    }
}
</script>

<template>
    <el-container class="layout-container">
        <!-- 左侧菜单 -->
        <el-aside width="250px">
            <div class="el-aside__logo"></div>
            <el-menu active-text-color="#ffd04b" background-color="#232323" text-color="#fff" router>
                <el-sub-menu v-show="userInfoStore.info.role==0" index="1">
                    <template #title>
                        <el-icon>
                            <Management />
                        </el-icon>
                        <span>用户管理</span>
                    </template>
                    <el-menu-item index="/manage/addUser">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>添加用户</span>
                    </el-menu-item>
                    <el-menu-item index="/manage/resetUserPwd">
                        <el-icon>
                            <Crop />
                        </el-icon>
                        <span>重置用户密码</span>
                    </el-menu-item>
                </el-sub-menu>

                <el-menu-item index="/square">
                    <el-icon>
                        <Promotion />
                    </el-icon>
                    <span>👨SHUer友广场👩</span>
                </el-menu-item>

                <el-sub-menu index="2">
                    <template #title>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>个人中心</span>
                    </template>
                    <el-menu-item index="/user/info">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>基本资料</span>
                    </el-menu-item>
                    <el-menu-item index="/user/avatar">
                        <el-icon>
                            <Crop />
                        </el-icon>
                        <span>更换头像</span>
                    </el-menu-item>
                    <el-menu-item index="/user/resetPassword">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        <span>修改密码</span>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>
        <!-- 右侧主区域 -->
        <el-container>
            <!-- 头部区域 -->
            <el-header>
                <div>
                    <span v-show="userInfoStore.info.role == 0">管理员：</span>
                    <span v-show="userInfoStore.info.role == 1">宿管：</span>
                    <span v-show="userInfoStore.info.role == 2">水站工作人员：</span>
                    <span v-show="userInfoStore.info.role == 3">学生：</span>
                    <strong>{{ userInfoStore.info.nickname }}</strong>
                </div>
                <!-- 下拉菜单 -->
                <!-- command: 条目被点击后会触发，在事件函数上可声明一个参数接收条目对应的指令 -->
                <el-dropdown placement="bottom-end" @command="handleCommand">
                    <span class="el-dropdown__box">
                        <el-avatar :src="userInfoStore.info.userPic ? userInfoStore.info.userPic : avatar" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="info" :icon="User">基本资料</el-dropdown-item>
                            <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>
                            <el-dropdown-item command="resetPassword" :icon="EditPen">修改密码</el-dropdown-item>
                            <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <!-- 中间区域 -->
            <el-main>
                <!-- <div style="width: 1290px; height: 570px;border: 1px solid red;">
                    内容展示区
                </div> -->
                <router-view></router-view>
            </el-main>
            <!-- 底部区域 -->
            <el-footer>校园轻舍 ©2023 Created by Elegance-Modernization</el-footer>
        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
    height: 100vh;

    .el-aside {
        background-color: #232323;

        &__logo {
            height: 200px;
            background: url('@/assets/google.png') no-repeat center / 200px auto;
        }

        .el-menu {
            border-right: none;
        }
    }

    .el-header {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-dropdown__box {
            display: flex;
            align-items: center;

            .el-icon {
                color: #999;
                margin-left: 10px;
            }

            &:active,
            &:focus {
                outline: none;
            }
        }
    }

    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
    }
}
</style>
