<script setup>
import { ref } from 'vue'
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import {useTokenStore} from '@/stores/token.js'
const tokenStore = useTokenStore();

import useUserInfoStore from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();
const userInfo = ref({...userInfoStore.info})

const processes = ref([
    {
        "id": 0,
        "studentUserName": "",
        "studentNumber": "",
        "checkTime": "",
        "checkReason": "",
        "checkImg": "",
        "checkValue": 4,
        "checker": "",
        "appealReason": "",
        "appealImg": "",
        "status": "申诉中"
    }
])

const process = ref(
    {
        "id": 0,
        "studentUserName": "",
        "studentNumber": "",
        "checkTime": "",
        "checkReason": "",
        "checkImg": "",
        "checkValue": 4,
        "checker": "",
        "appealReason": "",
        "appealImg": "",
        "status": "申诉中"
    }
)


import {ProcessService, finalService, final2Service} from '@/api/check.js'
// 宿管名字的获取

const dialogVisible = ref(false);
const ScoreAgain = ref(0);

const ProcessList = async()=>{
    let params = {
        pageNum:1,
        pageSize:100,
        checkerUserName:userInfo.value.username 
    } 
    let result = await ProcessService(params);
    processes.value = result.data.items;
}
ProcessList();


import {ElMessage} from 'element-plus'
const agree = async() =>{
    let params = {
      id:process.value.id,
      checkValue:ScoreAgain.value
    };
    let result = await finalService(params);
    ElMessage.success(result.msg ? result.msg :'处理申诉成功')
    ProcessList();
    dialogVisible.value = false;
}

const disagree = async() =>{
    let params = {
      id:process.value.id,
    };
    let result = await final2Service(params);
    ElMessage.success(result.msg ? result.msg :'处理申诉成功')
    ProcessList();
    dialogVisible.value = false;
}
</script>

<template>
    <el-card class="page-container">
    <template #header>
        <div class="header">
            <span>👨‍🏫申诉列表👨‍🏫</span>
        </div>
    </template>
    <el-table :data="processes" style="width: 100%">
        <el-table-column label="学号" prop="studentNumber"> </el-table-column>
        <el-table-column label="扣分原因" prop="checkReason"></el-table-column>
        <el-table-column label="检查时间" prop="checkTime"></el-table-column>
        <el-table-column label="所扣分数" prop="checkValue"></el-table-column>
        <el-table-column label="处理" width="100">
            <template #default="{ row }">
                <el-button :icon="Edit" circle plain type="primary" @click="dialogVisible = true; process=row"></el-button>
            </template>
        </el-table-column>
        <template #empty>
            <el-empty description="没有数据" />
        </template>
    </el-table>

    <el-dialog v-model="dialogVisible" title="处理申诉" width="50%">
        <h3>申诉理由：</h3>
    <el-row>
        {{ process.appealReason }}
    </el-row>

    <el-row justify="center" style="margin-top: 20px;">
        <el-col :span="12">
            <div style="text-align: center; font-size: 18px;">扣分图片</div>
            <el-image style="width: 300px; height: 300px; margin-bottom: 10px; margin-top: 10px;" :src="process.checkImg" :fit="fill" />
        </el-col>
        <el-col :span="12">
            <div style="text-align: center; font-size: 18px;" >申诉图片</div>
            <el-image style="width: 300px; height: 300px; margin-bottom: 10px; margin-top: 10px;" :src="process.appealImg" :fit="fill" />
        </el-col>
    </el-row>


    <el-form-item label="应扣分数">
        <el-select v-model="ScoreAgain" placeholder="请选择">
            <el-option label="0" value="0"></el-option>
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="3" value="3"></el-option>
            <el-option label="4" value="4"></el-option>
            <el-option label="5" value="5"></el-option>
        </el-select>
    </el-form-item>

    <el-row justify="center" style="margin-top: 20px;">
        <el-button @click="disagree()" style="margin-right: 10px;">不同意</el-button>
        <el-button type="primary" @click="agree()">同意</el-button>
    </el-row>
    </el-dialog>
</el-card>
</template>

<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
:deep(.el-dialog__body){
    padding-top: 0;
}
</style>