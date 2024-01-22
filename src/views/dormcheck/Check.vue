<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import { format } from 'date-fns';

import {useTokenStore} from '@/stores/token.js'
const tokenStore = useTokenStore();

const categorys = ref([
    {
        "studentNumber":"",
        "dormNumber":"",
        "dailyScore":0,
        "monthlyScore":0,
        "balcony":0,
        "rubbish":0,
        "desk":0,
        "floor":0,
        "quilt":0,
        "dailyPenaltyImageUrlForBalcony":"",
        "dailyPenaltyImageUrlForRubbish":"",
        "dailyPenaltyImageUrlForDesk":"",
        "dailyPenaltyImageUrlForFloor":"",
        "dailyPenaltyImageUrlForQuilt":""
    }
])

const category = ref({
        "studentNumber":"",
        "checkTime":"",
        "balcony":0,
        "rubbish":0,
        "desk":0,
        "floor":0,
        "quilt":0,
        "dailyPenaltyImageUrlForBalcony":"",
        "dailyPenaltyImageUrlForRubbish":"",
        "dailyPenaltyImageUrlForDesk":"",
        "dailyPenaltyImageUrlForFloor":"",
        "dailyPenaltyImageUrlForQuilt":""
})

const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(5)//每页条数

const onSizeChange = (size) => {
    pageSize.value = size
    CheckList()
}

const onCurrentChange = (num) => {
    pageNum.value = num
    CheckList()
}

import {CheckService,checkCutService} from '@/api/check.js'
const CheckList = async()=>{
    let params = {
        pageNum:pageNum.value,
        pageSize:pageSize.value,
        dateStr: format(new Date() , 'yyyy-MM-dd HH:mm:ss')
    } 
    let result = await CheckService(params);
    total.value = result.data.total;
    categorys.value = result.data.items;
}
CheckList();

const uploadSuccess1 = (result)=>{
    category.value.dailyPenaltyImageUrlForBalcony = result.data
    console.log(result.data);
}
const uploadSuccess2 = (result)=>{
    category.value.dailyPenaltyImageUrlForDesk = result.data
    console.log(result.data);
}
const uploadSuccess3 = (result)=>{
    category.value.dailyPenaltyImageUrlForFloor = result.data
    console.log(result.data);
}
const uploadSuccess4 = (result)=>{
    category.value.dailyPenaltyImageUrlForQuilt = result.data
    console.log(result.data);
}
const uploadSuccess5 = (result)=>{
    category.value.dailyPenaltyImageUrlForRubbish = result.data
    console.log(result.data);
}

import {Plus} from '@element-plus/icons-vue'
//控制抽屉是否显示
const dialogVisible = ref(false)

import {ElMessage} from 'element-plus'
const onSubmit = async() =>{
    category.value.checkTime = format(new Date() , 'yyyy-MM-dd HH:mm:ss');
    category.value.balcony = parseInt(category.value.balcony ? category.value.balcony : "0")
    category.value.desk = parseInt(category.value.desk ? category.value.desk : "0")
    category.value.floor = parseInt(category.value.floor ? category.value.floor : "0")
    category.value.quilt = parseInt(category.value.quilt ? category.value.quilt : "0")
    category.value.rubbish = parseInt(category.value.rubbish ? category.value.rubbish : "0")
    let result = await checkCutService(category.value);
    ElMessage.success(result.msg ? result.msg :'检查成功')
    CheckList();
    dialogVisible.value = false;
}
const offSubmit = async() =>{
    category.value.checkTime = format(new Date() , 'yyyy-MM-dd HH:mm:ss');
    category.value.balcony = 0
    category.value.desk = 0
    category.value.floor = 0
    category.value.quilt = 0
    category.value.rubbish = 0
    let result = await checkCutService(category.value);
    ElMessage.success(result.msg ? result.msg :'检查成功')
    CheckList();
    dialogVisible.value = false;
}
console.log(category.value.balcony);
</script>



<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>👨‍🏫学生列表👨‍🏫</span>
            </div>
        </template>
        <el-table :data="categorys" style="width: 100%">
            <el-table-column label="学号" prop="studentNumber"> </el-table-column>
            <el-table-column label="宿舍号" prop="dormNumber"></el-table-column>
            <el-table-column label="当日分数" prop="dailyScore"></el-table-column>
            <el-table-column label="当月已得分数" prop="monthlyScore"></el-table-column>
            <el-table-column label="当前状态" prop="status"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="dialogVisible = true; category=row; " 
                    :disabled="row.status!=='未查房'"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>

        <el-drawer v-model="dialogVisible" title="扣分提交" direction="rtl" size="40%">
            <el-form :model="category" label-width="100px" >
                <el-form-item label="阳台扣分：">
                    <el-select v-model="category.balcony" placeholder="请选择">
                        <el-option label="0" value="0"></el-option>
                        <el-option label="1" value="1"></el-option>
                        <el-option label="2" value="2"></el-option>
                        <el-option label="3" value="3"></el-option>
                        <el-option label="4" value="4"></el-option>
                        <el-option label="5" value="5"></el-option>
                    </el-select>
                </el-form-item>
                    <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false"
                    action="https://47.115.229.197:8445/upload" :on-success="uploadSuccess1" name="image"
                    :headers="{'Authorization':tokenStore.token}"
                    v-if="category.balcony == 0 ? false:true">
                        <img v-if="category.dailyPenaltyImageUrlForBalcony" :src="category.dailyPenaltyImageUrlForBalcony" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                <el-divider/>

                <el-form-item label="垃圾扣分：">
                    <el-select v-model="category.rubbish" placeholder="请选择">
                        <el-option label="0" value="0"></el-option>
                        <el-option label="1" value="1"></el-option>
                        <el-option label="2" value="2"></el-option>
                        <el-option label="3" value="3"></el-option>
                        <el-option label="4" value="4"></el-option>
                        <el-option label="5" value="5"></el-option>
                    </el-select>
                </el-form-item>
                    <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false"
                    action="https://47.115.229.197:8445/upload" :on-success="uploadSuccess2" name="image"
                    :headers="{'Authorization':tokenStore.token}"
                    v-if="category.rubbish == 0 ? false:true"
                    >
                        <img v-if="category.dailyPenaltyImageUrlForRubbish" :src="category.dailyPenaltyImageUrlForRubbish" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                <el-divider/>

                <el-form-item label="桌面扣分：">
                    <el-select v-model="category.desk" placeholder="请选择">
                        <el-option label="0" value="0"></el-option>
                        <el-option label="1" value="1"></el-option>
                        <el-option label="2" value="2"></el-option>
                        <el-option label="3" value="3"></el-option>
                        <el-option label="4" value="4"></el-option>
                        <el-option label="5" value="5"></el-option>
                    </el-select>
                </el-form-item>
                    <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false"
                    action="https://47.115.229.197:8445/upload" :on-success="uploadSuccess3" name="image"
                    :headers="{'Authorization':tokenStore.token}"
                    v-if="category.desk == 0 ? false:true"
                    >
                        <img v-if="category.dailyPenaltyImageUrlForDesk" :src="category.dailyPenaltyImageUrlForDesk" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                <el-divider/>

                <el-form-item label="地面扣分：">
                    <el-select v-model="category.floor" placeholder="请选择">
                        <el-option label="0" value="0"></el-option>
                        <el-option label="1" value="1"></el-option>
                        <el-option label="2" value="2"></el-option>
                        <el-option label="3" value="3"></el-option>
                        <el-option label="4" value="4"></el-option>
                        <el-option label="5" value="5"></el-option>
                    </el-select>
                </el-form-item>
                    <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false"
                    action="https://47.115.229.197:8445/upload" :on-success="uploadSuccess4" name="image"
                    :headers="{'Authorization':tokenStore.token}"
                    v-if="category.floor == 0 ? false:true"
                    >
                        <img v-if="category.dailyPenaltyImageUrlForFloor" :src="category.dailyPenaltyImageUrlForFloor" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                <el-divider/>

                <el-form-item label="被子扣分：">
                    <el-select v-model="category.quilt" placeholder="请选择">
                        <el-option label="0" value="0"></el-option>
                        <el-option label="1" value="1"></el-option>
                        <el-option label="2" value="2"></el-option>
                        <el-option label="3" value="3"></el-option>
                        <el-option label="4" value="4"></el-option>
                        <el-option label="5" value="5"></el-option>
                    </el-select>
                </el-form-item>
                    <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false"
                    action="https://47.115.229.197:8445/upload" :on-success="uploadSuccess5" name="image"
                    :headers="{'Authorization':tokenStore.token}"
                    v-if="category.quilt == 0 ? false:true"
                    >
                        <img v-if="category.dailyPenaltyImageUrlForQuilt" :src="category.dailyPenaltyImageUrlForQuilt" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                <el-divider/>

                <el-form-item>
                    <el-button type="primary" @click="onSubmit">扣分</el-button>
                    <el-button type="primary" @click="offSubmit">优秀</el-button>
                    <!-- <el-button type="primary" @click="dialogVisible =false ">优秀</el-button> -->

                </el-form-item>
            </el-form>
        </el-drawer>
        
        <!-- 分页条 -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5 ,10, 15]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
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