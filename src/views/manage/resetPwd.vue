<script lang="ts" setup>
import { ref } from 'vue'
const resetPwdData = ref({
    username:''
});

const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 5, max: 16, message: '用户名应为5~16位非空字符', trigger: 'blur' }
    ]
}

import { resetUserPwdService } from "../../api/manager.js"
import { ElMessage } from 'element-plus'
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
            <div class="header">
                <span>重置用户密码</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form label-width="100px" size="large" :rules="rules" :model="resetPwdData">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="resetPwdData.username"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="resetUserPwd">提交</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>