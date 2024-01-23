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
import { defineComponent } from 'vue';
  import { Message} from '@arco-design/web-vue';
  import {
    IconCaretRight,
    IconCaretLeft,
    IconHome,
    IconCalendar,
  } from '@arco-design/web-vue/es/icon';
import avatar from '@/assets/default.png'
import { ElNotification } from 'element-plus'
import { ref } from 'vue';

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
            let result = await userLogoutService();
            tokenStore.removeToken();
            userInfoStore.removeInfo();
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

// 同步侧栏和顶部导航栏的vue对象
const currentMenuItem = ref('/welcome');

const onClickMenuItem = (key) => {
    if(key=="github"){
        window.open('https://github.com/yizhilsy', '_blank');
        return;
    }
    if(key=="wechatpay"||key=="alipay"){
        ElNotification({
            title: '施工中',
            message: '即将上线 @Elegance-Modernization',
            type: 'info',
        })
        return;
    }
    if (key == "logokey"){
        ElNotification({
            title: '开发者信息',
            message: '陆诗雨，陈楠，王志伟，张泽毅 团队@Elegance-Modernization',
            type: 'info',
        })
        return;
    }
    // Message.info({ content: `You select ${key}`, showIcon: true });
    currentMenuItem.value = key;
    console.log("**********************");
    router.push(key);
}

// 帖子数据模型
const helpPages = ref([
    {
        "id": ' ',
        "username":' ',
        "name":' ',
        "phone":' ',
        "title": ' ',
        "content": ' ',
        "image":' ',
        "typeId":' ',
        "createTime": ' ',
        "updateTime": ' '
    }
])



let result = {
    flag:false,
}
let result2 = {
    flag:true,
}
console.log("initinitinit");
console.log(result);


import {usebitFlowFlagStore} from '@/stores/bitFlowFlag.js'
const bitFlowFlagStore = usebitFlowFlagStore();
bitFlowFlagStore.removeInfo();
bitFlowFlagStore.setInfo(result);
const bitFlowFlag = ref({
    ...bitFlowFlagStore.bitFlowFlagInfo
})
// 字节浪潮bitflow分页查询滚动条部分 createby @shiyulu
// 监听滚动条
const handleScroll = (e) => {
  const {scrollTop, clientHeight, scrollHeight} = e.target
  // console.log(scrollTop, clientHeight, scrollHeight)
  if (scrollTop + clientHeight === scrollHeight){
    console.log("reach the bottom!");
    // alert("reach the bottom!");
    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$");
    bitFlowFlagStore.removeInfo();
    bitFlowFlagStore.setInfo(result2);
    console.log(bitFlowFlagStore.bitFlowFlagInfo.flag);
    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
  }else{
    bitFlowFlagStore.setInfo(result);
    console.log(bitFlowFlag.value.flag);
  }
}

</script>

<template>
    <el-container class="layout-container">
        <!-- 左侧菜单 -->
        <!-- <el-aside width="250px">
            <div class="el-aside__logo"></div>
            
        </el-aside> -->
        <a-layout-sider collapsible breakpoint="xl" width="250px">
            <div class="logo"></div>
            <a-menu
            :default-open-keys="['/welcome']"
            :default-selected-keys="['/welcome']"
            :selected-keys="[currentMenuItem]"
            :style="{ width: '100%' }"
            @menu-item-click="onClickMenuItem"
            >
            <a-menu-item key="/welcome">
                <icon-lark-color />👨SHUer友广场👩
            </a-menu-item>

            <a-sub-menu key="userCenter">
                <template #title>
                    <icon-user></icon-user>个人中心
                </template>
                <a-menu-item key="/user/info">
                    <icon-file />基本资料
                </a-menu-item>
                <a-menu-item key="/user/resetPassword">
                    <icon-edit />修改密码
                </a-menu-item>
            </a-sub-menu>

            <a-sub-menu key="Manage" v-if="userInfoStore.info.role === 0">
                <template #title>
                    <icon-command /> 管理菜单
                </template>
                <a-menu-item key="/manage/usermanage">
                    <icon-user-add />管理用户
                </a-menu-item>
                <a-menu-item key="/square">
                    <icon-tool />SHUer帖管理
                </a-menu-item>
            </a-sub-menu>

            <a-sub-menu key="DormCheck">
                <template #title>
                    <icon-find-replace />宿舍查寝
                </template>
                <a-menu-item key="/dormcheck/Check" v-if="userInfoStore.info.role === 0 || userInfoStore.info.role === 1">
                    <icon-bar-chart />扣分中心
                </a-menu-item>
                <a-menu-item key="/dormcheck/Process" v-if="userInfoStore.info.role === 0 || userInfoStore.info.role === 1">
                    <icon-import />申诉处理
                </a-menu-item>
                <a-menu-item key="/dormcheck/Appeal" v-if="userInfoStore.info.role === 3">
                    <icon-at />查询&&申诉
                </a-menu-item>
                <a-menu-item key="/dormcheck/Rank">
                    <icon-trophy />SHUer榜单
                </a-menu-item>
            </a-sub-menu>

            <a-sub-menu key="WaterCloud">
                <template #title>
                    <icon-bg-colors />云端订水
                </template>
                <a-menu-item key="/water/order" v-if="userInfoStore.info.role === 3">
                    <icon-send />我要订水
                </a-menu-item>
                <a-menu-item key="/water/backstage" v-if="userInfoStore.info.role === 0 || userInfoStore.info.role === 2">
                    <icon-tool />水站后台
                </a-menu-item>
            </a-sub-menu>

            <a-menu-item key="github">
                <template #icon>
                    <icon-github/>
                </template>
                Github
            </a-menu-item>

            <a-menu-item key="wechatpay">
                <template #icon>
                    <icon-wechatpay />
                </template>
                微信支付
            </a-menu-item>

            <a-menu-item key="alipay">
                <template #icon>
                    <icon-alipay-circle />
                </template>
                支付宝
            </a-menu-item>

            </a-menu>
            
            <!-- trigger -->
            <template #trigger="{ collapsed }">
                <IconCaretRight v-if="collapsed"></IconCaretRight>
                <IconCaretLeft v-else></IconCaretLeft>
            </template>
        </a-layout-sider>




        <!-- 右侧主区域 -->
        <el-container>
            <!-- 头部区域 -->
            <el-header>
                <div class="menu-demo">
                    <a-menu 
                        mode="horizontal" theme="light" 
                        :default-open-keys="['/welcome']"
                        :default-selected-keys="['/welcome']"
                        :selected-keys="[currentMenuItem]"
                        :style="{ width: '100%' }"
                        @menu-item-click="onClickMenuItem"
                    >
                    <a-menu-item key="logokey" :style="{ padding: 0, marginRight: '38px' }" >
                        <!-- <div :style="{width: '60px',height: '40px',cursor: 'text',color: '#1d2129'}">
                            <span>111</span>
                        </div> -->
                        <a-space>
                            <img alt="logo" src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/dfdba5317c0c20ce20e64fac803d52bc.svg~tplv-49unhts6dw-image.image" style="vertical-align: middle;height: 20px;"/>
                            <a-typography-title :style="{ margin: 0, fontSize: '18px' }" :heading="5">
                            Dorm Life
                            </a-typography-title>
                        </a-space>
                        
                    </a-menu-item>
                    <a-menu-item key="/welcome">
                        <icon-lark-color />👨SHUer友广场👩
                    </a-menu-item>

                    <a-sub-menu key="userCenter">
                        <template #title>
                            <icon-user></icon-user>个人中心
                        </template>
                        <a-menu-item key="/user/info">
                            <icon-file />基本资料
                        </a-menu-item>
                        <a-menu-item key="/user/resetPassword">
                            <icon-edit />修改密码
                        </a-menu-item>
                    </a-sub-menu>

                    <a-sub-menu key="Manage" v-if="userInfoStore.info.role === 0">
                        <template #title>
                            <icon-command /> 管理菜单
                        </template>
                        <a-menu-item key="/manage/usermanage">
                            <icon-user-add />用户管理
                        </a-menu-item>
                        <a-menu-item key="/square">
                            <icon-tool />SHUer帖管理
                        </a-menu-item>
                    </a-sub-menu>
                    <a-sub-menu key="DormCheck">
                        <template #title>
                            <icon-find-replace />宿舍查寝
                        </template>
                        <a-menu-item key="/dormcheck/Check" v-if="userInfoStore.info.role === 0 || userInfoStore.info.role === 1">
                            <icon-bar-chart />扣分中心
                        </a-menu-item>
                        <a-menu-item key="/dormcheck/Process" v-if="userInfoStore.info.role === 0 || userInfoStore.info.role === 1">
                            <icon-import />申诉处理
                        </a-menu-item>
                        <a-menu-item key="/dormcheck/Appeal" v-if="userInfoStore.info.role === 3">
                            <icon-at />查询&&申诉
                        </a-menu-item>
                        <a-menu-item key="/dormcheck/Rank">
                            <icon-trophy />SHUer榜单
                        </a-menu-item>
                    </a-sub-menu>

                    <a-sub-menu key="WaterCloud">
                        <template #title>
                            <icon-bg-colors />云端订水
                        </template>
                        <a-menu-item key="/water/order" v-if="userInfoStore.info.role === 3">
                            <icon-send />我要订水
                        </a-menu-item>
                        <a-menu-item key="/water/backstage" v-if="userInfoStore.info.role === 2 || userInfoStore.info.role === 0">
                            <icon-tool />水站后台
                        </a-menu-item>
                    </a-sub-menu>
                    </a-menu>
                </div>

                <div style="white-space: nowrap;margin-right: 30px;">
                    <span v-show="userInfoStore.info.role == 0">管理员：</span>
                    <span v-show="userInfoStore.info.role == 1">宿管：</span>
                    <span v-show="userInfoStore.info.role == 2">水站工作人员：</span>
                    <span v-show="userInfoStore.info.role == 3">学生：</span>
                    <strong>{{ userInfoStore.info.nickname }}</strong>
                </div>
                
                <!-- 下拉菜单 -->
                <!-- command: 条目被点击后会触发，在事件函数上可声明一个参数接收条目对应的指令 -->
                <el-dropdown placement="bottom-end" @command="handleCommand" >
                    <span class="el-dropdown__box">
                        <el-avatar :src="userInfoStore.info.userPic ? userInfoStore.info.userPic : avatar" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="info" :icon="User">基本资料</el-dropdown-item>
                            <el-dropdown-item command="resetPassword" :icon="EditPen">修改密码</el-dropdown-item>
                            <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>


            <!-- 中间区域 -->
            <el-main style="width: 82%;margin: 0 auto;" @scroll="handleScroll">
                <a-back-top target-container="#basic-demo" :style="{position:'absolute'}" />
                <!-- <div style="width: 1290px; height: 570px;border: 1px solid red;">
                    内容展示区
                </div> -->
                <router-view></router-view>
            </el-main>
            <!-- 底部区域 -->
            <el-footer>
                Dorm Life 生活轻舍 ©2024 Created by Elegance-Modernization
                <a-tag color="gray"><template #icon><icon-github/></template>Github</a-tag>
                <a-tag color="blue"><template #icon><icon-twitter/></template>Twitter</a-tag>
                <a-tag color="arcoblue"><template #icon><icon-facebook/></template>Facebook</a-tag>
                <a-tag color="gray"><template #icon><icon-google /></template>Google</a-tag>
            </el-footer>
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

// arco左侧导航栏样式
.layout-demo {
    height: 1000px;
    background: var(--color-fill-2);
    border: 1px solid var(--color-border);
  }
  .layout-demo :deep(.arco-layout-sider) .logo {
    height: 32px;
    margin: 12px 8px;
    background: rgba(255, 255, 255, 0.2);
  }
  .layout-demo :deep(.arco-layout-sider-light) .logo{
    background: var(--color-fill-2);
  }
  .layout-demo :deep(.arco-layout-header)  {
    height: 64px;
    line-height: 64px;
    background: var(--color-bg-3);
  }
  .layout-demo :deep(.arco-layout-footer) {
    height: 48px;
    color: var(--color-text-2);
    font-weight: 400;
    font-size: 14px;
    line-height: 48px;
  }
  .layout-demo :deep(.arco-layout-content) {
    color: var(--color-text-2);
    font-weight: 400;
    font-size: 14px;
    background: var(--color-bg-3);
  }
  .layout-demo :deep(.arco-layout-footer),
  .layout-demo :deep(.arco-layout-content)  {
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: var(--color-white);
    font-size: 16px;
    font-stretch: condensed;
    text-align: center;
  }



// arco上侧导航栏样式  
.menu-demo {
  box-sizing: border-box;
  width: 100%;
  padding: 40px;
  background-color: var(--color-neutral-2);
  margin: 0 auto;
  padding: 0%;
}

// 圆角滑动条样式
::-webkit-scrollbar {
width: 16px;
height: 4px;
}

::-webkit-scrollbar-thumb {
border: 4px solid transparent;
background-clip: padding-box;
border-radius: 10px;
background-color: var(--color-text-4);
}

::-webkit-scrollbar-thumb:hover {
background-color: var(--color-text-3);
}

</style>
