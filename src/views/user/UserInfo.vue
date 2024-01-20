<script setup>
import { ref } from 'vue'
import useUserInfoStore from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();
const userInfo = ref({...userInfoStore.info})
const roleUser = ref('')
console.log(roleUser.value)
switch(userInfo.value.role){
    case 0:
        roleUser.value='管理员'
        break
    case 1:
        roleUser.value='宿管'
        break
    case 2:
        roleUser.value='水站工作人员'
        break
    default:
        roleUser.value='学生'
        break

}
console.log(roleUser.value)

const rules = {
    nickname: [
        { required: true, message: '请输入用户昵称', trigger: 'blur' },
        {
            pattern: /^\S{2,10}$/,
            message: '昵称必须是2-10位的非空字符串',
            trigger: 'blur'
        }
    ],
    email: [
        { required: true, message: '请输入用户邮箱', trigger: 'blur' },
        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
    ]
}

//修改个人信息
import {userInfoUpdateService} from '@/api/user.js'
import {ElMessage} from 'element-plus'
const updateUserInfo = async()=>{
    //调用接口
    let result = await userInfoUpdateService(userInfo.value);
    ElMessage.success(result.msg?result.msg:"修改成功");

    //修改pinia中的个人信息
    userInfoStore.setInfo(userInfo.value)

    updateAvatar();
}

//头像上传
const uploadRef = ref()

import {useTokenStore} from '@/stores/token.js'
const tokenStore = useTokenStore();

//用户头像地址
const imgUrl= ref(userInfoStore.info.userPic)

//头像上传成功的回调函数
const uploadSuccess = (result)=>{
    imgUrl.value = result.data;
}

//头像修改
import {userAvatarUpdateService} from '@/api/user.js'
import SpaceItem from 'element-plus/es/components/space/src/item';
const updateAvatar = async()=>{
    //调用接口
    let result = await userAvatarUpdateService(imgUrl.value);

    //修改pinia中的数据
    userInfoStore.info.userPic=imgUrl.value;
}
</script>
<template>
    <el-card class="page-container" shadow="hover">
        <template #header>
            <div class="header" style="color: #409eff; font-weight: bold;">
                <span>基本资料</span>
            </div>
        </template>
        <el-row class="demo-radius">
            <el-col :span="12">
                <el-form :model="userInfo" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="登录名称">
                        <el-input v-model="userInfo.username" disabled :style="{ maxWidth: '280px'}"></el-input>
                    </el-form-item>
                    <el-form-item label="角色">
                        <el-input v-model="roleUser" disabled :style="{ maxWidth: '280px'}"></el-input>
                    </el-form-item>
                    <el-form-item label="用户昵称" prop="nickname">
                        <el-input v-model="userInfo.nickname" :style="{ maxWidth: '280px'}"></el-input>
                    </el-form-item>
                    <el-upload 
                        ref="uploadRef"
                        class="avatar-uploader" 
                        :show-file-list="false"
                        :auto-upload="true"
                        action="https://47.115.229.197:8445/upload"
                        name="image"
                        :headers="{'Authorization':tokenStore.token}"
                        :on-success="uploadSuccess"
                        >
                        <img v-if="imgUrl" :src="imgUrl" class="avatar" />
                        <img v-else src="avatar" width="278" />
                    </el-upload>
                    <br><br>
                    <el-form-item label="用户邮箱" prop="email">
                        <el-input v-model="userInfo.email" :style="{ maxWidth: '280px'}"></el-input>
                    </el-form-item>
                    <el-form-item>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <el-button type="primary" @click="updateUserInfo">提交修改</el-button>
                </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        
    </el-card>
</template>

<style lang="scss" scoped>
.avatar-uploader {
    :deep() {
        .avatar {
            width: 278px;
            height: 278px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
            margin-right: 100px;
            margin-left: 100px;
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 278px;
            height: 278px;
            text-align: center;
        }
    }
}

.el-input{
    --el-input-border-radius: 20px;
}
</style>
