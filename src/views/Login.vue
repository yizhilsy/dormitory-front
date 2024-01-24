<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus';
//控制注册与登录表单的显示， 默认显示登录
const isRegister = ref(false)

//定义数据模型  注册
const registerData = ref({
    username:'',
    password:'',
    rePassword:''
})

//校验密码函数  注册
const checkRePassword = (rule,value,callback) => {
    if(value===''){
        callback(new Error('请再次确认密码'))
    }else if(value !== registerData.value.password){
        callback(new Error('请确保两次输入的密码一样'))
    }else{
        callback()
    }
}

//定义表单校验规则  注册
const rules = {
    username:[
        {required:true, message:'请输入用户名', trigger:'blur'},
        {min:5, max:16, message:'用户名应为5~16位非空字符', trigger:'blur'}
    ],
    password:[
        {required:true, message:'请输入密码', trigger:'blur'},
        {min:5, max:16, message:'密码应为5~16位非空字符', trigger:'blur'}
    ],
    rePassword:[
        {validator:checkRePassword,trigger:'blur'}
    ]
}

//调用后台接口，完成注册
import {userRegisterService,userLoginService} from '@/api/user.js'
const register = async()=>{
    //调用访问后台接口，并接收响应数据Result
    let result = await userRegisterService(registerData.value);
    /* if(result.code===0){
        //成功
        alert(result.message ? result.message : "注册成功");
    }else{
        //失败
        alert(result.message ? result.message : "注册失败");
    } */
    //alert(result.message ? result.message : "注册成功");
    ElMessage.success(result.msg ? result.msg : "注册成功");
}

//登录的数据模型以及校验规则可以复用注册的
//登录函数
import { useTokenStore } from '@/stores/token.js';
import {useRouter} from 'vue-router'
const router = useRouter()
const tokenStore = useTokenStore();
const login = async()=>{
    //调用接口，完成登录
    let result = await userLoginService(registerData.value);
    /* if(result.code===0){
        //成功
        alert(result.message ? result.message : "登录成功");
    }else{
        //失败
        alert(result.message ? result.message : "登录失败");
    } */
    //alert(result.message ? result.message : "登录成功");
    ElMessage.success(result.msg ? result.msg : "登录成功");
    //将响应的token存到pinia中
    tokenStore.setToken(result.data)
    //跳转到首页 路由完成跳转
    router.push('/')
}


//定义函数，清空数据模型数据
const clearRegisterData = ()=>{
    registerData.value={
        username:'',
        password:'',
        rePassword:''
    }
}
</script>

<template>
    <el-row class="login-page">
        <el-col :span="12" class="bg">
            <div class="hero">
                <h1>Dorm Life<br><br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;生活轻舍</h1>
            </div>
        </el-col>
        <el-col :span="6" :offset="3" class="form">
            <!-- 注册表单 -->
            <el-form ref="form" size="large" autocomplete="off" v-if="isRegister" :model="registerData" :rules="rules">
                <el-form-item>
                    <h1>注册</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="registerData.password"></el-input>
                </el-form-item>
                <el-form-item prop="rePassword">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请再次输入密码" v-model="registerData.rePassword"></el-input>
                </el-form-item>
                <!-- 注册按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="register();isRegister = false;clearRegisterData()">
                        注册
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = false;clearRegisterData()">
                        ← 返回
                    </el-link>
                </el-form-item>
            </el-form>
            <!-- 登录表单 -->
            <el-form ref="form" size="large" autocomplete="off" v-else :model="registerData" :rules="rules">
                <el-form-item>
                    <h1>登录</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="registerData.password"></el-input>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="login">登录</el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = true;clearRegisterData()">
                        注册 →
                    </el-link>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style>
:root {
    --primary-color: #4460f1;
    --white-color: #ffffff;

    --light-text-color: #9398b3;
    --light-bg-color: #f2f4ff;
    --dark-color: #333333;

    --background-color: #fcfcff;

    --el-border-radius-base: 50px;
}

* {
    font-family: 'Noto Sans SC', sans-serif;
}

.hero {
    position: absolute;
    top: 200px;
    left: 200px;
}

.hero h1 {
    font-size: 100px;
}
.hero::before {
    content: '';
    position: absolute;
    top: 20%;
    left: 10%;
    width: 380px;
    height:280px;
    background: linear-gradient(to right, var(--primary-color), #c471ed, #f64f59);
    z-index: -1;
    filter: blur(70px);
}


.login-page {
    height: 100vh;

    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;

        .title {
            margin: 0 auto;
        }

        .button {
            width: 100%;
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}


/*搜索input框 */
.el-input{
    --el-input-border-radius: 20px;
}


</style>