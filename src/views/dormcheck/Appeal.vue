<script setup>
const dialogVisible = ref(false)
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
  import { ref } from 'vue'
  import {Plus} from '@element-plus/icons-vue'
  const cid = ref()
  const appeal = ref(
    {
      "checkId": "",
      "appealReason": "",
      "appealImg": ""
    })
  const appeals = ref([
    {
      "id": 1,
      "studentUserName": "wwwww",
      "studentNumber": "21120992",
      "checkTime": "2024-01-08T00:00:00",
      "checkReason": "阳台",
      "checkImg": null,
      "checkValue": 1,
      "checker": "suguan001",
      "appealReason": null,
      "appealImg": null,
      "status": "已扣分"
    }])

    const appealNow = ref(
    {
      "id": 1,
      "studentUserName": "wwwww",
      "studentNumber": "21120992",
      "checkTime": "2024-01-08T00:00:00",
      "checkReason": "阳台",
      "checkImg": null,
      "checkValue": 1,
      "checker": "suguan001",
      "appealReason": null,
      "appealImg": null,
      "status": "已扣分"
    })

    const student = ref({
        "studentId": 6,
        "studentName": "cn",
        "dormNumber": "1208",
        "location": null,
        "bedNumber": 1,
        "phone": null,
        "email": null,
        "studentNumber": "21120987",
        "password": null
    })

import useUserInfoStore from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();
const userInfo = ref({...userInfoStore.info})

import {useTokenStore} from '@/stores/token.js'
const tokenStore = useTokenStore();

//获取本人的扣分原因以及图片，发出本人的扣分申请
import {AppealListService,SendAppealService,GetstuInformation} from '@/api/check.js'
const GetStudentInfo = async() =>{
  let params = {
    studentUserName: userInfo.value.username
  }
  let result = await GetstuInformation(params);
  student.data = result.data;
}
GetStudentInfo();

const AppealList = async()=>{
  let params = {
        pageNum:1,
        pageSize:100,
        studentNumber:student.value.studentNumber 
    } 
    let result = await AppealListService(params);
    appeals.value = result.data.items;
}
AppealList();

const SendAppeal = async()=>{
  appeal.value.checkId = cid.value;
  console.log(appeal.value);
  let result = await SendAppealService(appeal.value);
  AppealList();
  dialogVisible.value = false;
}

const uploadSuccess = (result)=>{
    appeal.value.appealImg = result.data
}
</script>

<template>
  <br/>
  <el-row class="container" style="margin-top: -20px;">
    <el-col :span="24" style="text-align: center;" >
      <el-text tag="mark" style="font-size: 35px; font-weight: bold;" >🏠合理申诉，当天处理，快乐生活🏠</el-text>
    </el-col>

    <el-table :data="appeals" style="width: 100%;margin-top: 20px;">
            <el-table-column label="学号" prop="studentNumber"> </el-table-column>
            <el-table-column label="检查时间" prop="checkTime"></el-table-column>
            <el-table-column label="扣分原因" prop="checkReason"></el-table-column>
            <el-table-column label="被扣分数" prop="checkValue"></el-table-column>
            <el-table-column label="状态" prop="status"></el-table-column>
            <el-table-column label="申诉" width="100" >
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="dialogVisible = true; cid = row.id; appealNow = row"
                    :disabled="row.status!=='已扣分'"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>

        <el-drawer v-model="dialogVisible" title="扣分申诉" direction="rtl" size="45%">
            <el-form-item label="扣分理由："> <el-image :src="appealNow.checkImg" ></el-image></el-form-item>
            <el-form :model="appeal" label-width="100px" >
                <el-form-item label="申诉理由：">
                    <el-input v-model="appeal.appealReason">
                    </el-input>
                </el-form-item>
                <el-form-item label="您的证明：">
                     <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false"
                    action="https://47.115.229.197:8445/upload" :on-success="uploadSuccess" name="image"
                    :headers="{'Authorization':tokenStore.token}">
                        <img v-if="appeal.appealImg" :src="appeal.appealImg" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
               
                <el-form-item>
                    <el-button type="primary" @click="SendAppeal">提交</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>

  </el-row>
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

.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 80px;
            height: 80px;
            text-align: center;
        }
    }
}

</style>
