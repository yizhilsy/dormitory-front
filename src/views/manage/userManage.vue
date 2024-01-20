<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

//定义数据模型  添加用户
const addUserData = ref({
    username:'',
    role:''
})

//定义规则
const rules = {
    username:[
        {required:true, message:'请输入用户名', trigger:'blur'},
        {min:5, max:16, message:'用户名应为5~16位非空字符', trigger:'blur'}
    ]
}

//调用后台接口
import {addUserService} from '../../api/manager.js'
const addUser = async()=>{
    let result = await addUserService(addUserData.value);
    if(result.code === 1){
        ElMessage.success(result.msg?result.msg:"添加成功")
    }else{
        ElMessage.error(result.msg?result.msg:"添加失败")
    }
}

const resetPwdData = ref({
    username:''
});

import { resetUserPwdService } from "../../api/manager.js"
const resetUserPwd = async () => {
    let result = await resetUserPwdService(resetPwdData.value);
    if (result.code === 1) {
        ElMessage.success(result.msg ? result.msg : "重置成功")
    }
    else {
        ElMessage.error(result.msg ? result.msg : "重置失败")
    }
}

</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header" style="color: #409eff; font-weight: bold;">
                <span>添加用户</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form label-width="100px" size="large" :rules="rules" :model="addUserData">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addUserData.username" style="max-width: 270px;"></el-input>
                    </el-form-item>
                    <el-form-item label="用户类别">
                        <el-select size="large" v-model="addUserData.role">
                            <el-option label="管理员" value=0 />
                            <el-option label="宿管" value=1 />
                            <el-option label="水站工作人员" value=2 />
                            <el-option label="学生" value=3 />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addUser">提交</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <br><br>
        <span style="color: #409eff; font-weight: bold;">重置用户密码</span>
        <el-divider></el-divider>
        <br>

        <el-row>
            <el-col :span="12">
                <el-form label-width="100px" size="large" :rules="rules" :model="resetPwdData">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="resetPwdData.username" style="max-width: 270px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="resetUserPwd">提交</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>

<style scoped>
.el-input{
    --el-input-border-radius: 20px;
}
</style>