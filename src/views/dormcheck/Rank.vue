<script setup>
import { ref } from 'vue'
const rankRed = ref([
    {
        "studentNumber":"",
        "dormitoryNumber":"",
        "dailyScore":0,
        "monthlyScore":0,
        "balcony":false,
        "rubbish":false,
        "desk":false,
        "floor":false,
        "quilt":false,
        "dailyPenaltyImageUrl":"",
        "status":""
    }
])

const categorys1 = ref([
    {
        "studentNumber":"qwe",
        "dormitoryNumber":"123",
        "dailyScore":20,
        "monthlyScore":0,
        "balcony":false,
        "rubbish":false,
        "desk":false,
        "floor":false,
        "quilt":false,
        "dailyPenaltyImageUrl":"",
        "status":""
    }
])

import { GetTopService,GetBottomService } from '@/api/check.js';
const TopList = async()=>{
    let result = await GetTopService();
    rankRed.value = result.data;
    console.log(rankRed.value);
}
TopList();

const BottomList = async()=>{
    let result = await GetBottomService();
    categorys1.value = result.data;
}
BottomList();

</script>


<template>
  <el-row>
    <el-col :span="12">
      <el-card class="page-container">
        <template #header>
          <div class="header">
            <span>👨‍🏫鼠鼠红榜👨‍🏫</span>
          </div>
        </template>
        <el-table :data="rankRed" style="width: 100%">
          <el-table-column label="学号" prop="studentNumber"> </el-table-column>
          <el-table-column label="本月得分" prop="monthlyScore"> </el-table-column>
        </el-table>
      </el-card>
    </el-col>

    <el-col :span="12">
      <el-card class="page-container">
        <template #header>
          <div class="header">
            <span>👨‍🏫鼠鼠黑榜👨‍🏫</span>
          </div>
        </template>
        <el-table :data="categorys1" style="width: 100%">
          <el-table-column label="学号" prop="studentNumber"> </el-table-column>
          <el-table-column label="本月得分" prop="monthlyScore"> </el-table-column>
        </el-table>
      </el-card>
    </el-col>
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
</style>