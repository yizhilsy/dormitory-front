<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref, onMounted, watch} from 'vue';
import { useTransition } from '@vueuse/core'
import { ChatLineRound, Male } from '@element-plus/icons-vue'
import * as echarts from 'echarts';

const chartRef = ref(null);
const pageNum = ref(1)//当前页
const pageSize = ref(100)//每页条数

const stationInformation = ref({
    "waterStationId":0,
    "waterStationUsername":"",
    "waterStationName":"",
    "waterStationLocation":"",
    "waterPrice":""
})

const waterCondition = ref({
    "waterStationId": "",
    "finished": 2,
    "delivering": 3,
    "unconfirmed": 1,
    "canceled": 4
})

import{GetWaterConditionService} from "@/api/water.js"

const loading = ref(true)

const waters = ref([{
    "waterOrderId": "1",
    "waterOrderNumber": "1",
    "dormNumber": "1",
    "studentId": "1",
    "waterOrderTime": "1",
    "waterDeliverTime": "1",
    "waterOrderStatus": "1",
    "waterStationId": "1",
    "waterCount": "1"
}])

const stationId = ref()

import {GetWaterStationService, WaterOrderSelectService, ProcessOrderStates,GetTwoTimeService} from '@/api/water.js'
const GetStationInfo = async() =>{
  let result = await GetWaterStationService();
  stationInformation.value = result.data;

  stationId.value = result.data.waterStationId;

  // console.log(stationId.value);

  const tempModel = ref({
    "waterStationId": stationId.value
  })

  // console.log(stationId.value);
  // console.log(tempModel.value);

  let result1 = await GetWaterConditionService(tempModel.value);

  waterCondition.value = result1.data;
  source1.value = waterCondition.value.unconfirmed;
  source2.value = waterCondition.value.delivering;
  source3.value = waterCondition.value.finished;
  source4.value = waterCondition.value.canceled;
  // console.log(waterCondition.value.canceled);
  loading.value = false;
  
}
GetStationInfo();

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    CheckList()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    CheckList()
}

const handleButtonClick = async (state) => {
    // console.log(state + "QWEQWE");
    let param = {
      waterStationId:stationId.value,
      state: state,
      pageNum: pageNum.value,
      pageSize: pageSize.value
    };
    let result = await WaterOrderSelectService(param);
    waters.value = result.data.items;
}

handleButtonClick(0);

const waterOrderItem = ref({
    "waterOrderId":"",
    "waterOrderNumber":""
})
//修改信息接口
const processStates = async (param) =>{

  const myMap = new Map();
  myMap.set("未接收", 0);
  myMap.set("运送中", 1);
  myMap.set("已完成", 2);
  myMap.set("已取消", 3);


  let result = await ProcessOrderStates(param);
  await GetStationInfo();
  console.log(myMap.get(param.waterOrderStatus));
  handleButtonClick(myMap.get(param.waterOrderStatus));
}

// onMounted(() => {
//   // 初始化ECharts图表
//   const myChart = echarts.init(chartRef.value);
//   renderChart(myChart);
// });

// // 监听waterCondition的变化，重新渲染图表
// watch(() => waterCondition.value, (newValue, oldValue) => {
//   const myChart = echarts.init(chartRef.value);
//   renderChart(myChart);
// });

// const renderChart = (chart) => {
//   const option = {
//     title: {
//       text: '水站情况状态图',
//       left: 'center',
//     },
//     series: [
//       {
//         name: '访问来源',
//         type: 'pie',
//         radius: '55%',
//         data: [
//           { value: waterCondition.unconfirmed, name: '未接收' },
//           { value: waterCondition.delivering, name: '运送中' },
//           { value: waterCondition.finished, name: '已确认' },
//           { value: waterCondition.canceled, name: '已取消' },
//         ],
//         label: {
//           show: true,
//           formatter: '{b} : {c} ({d}%)',
//         },
//         emphasis: {
//           itemStyle: {
//             shadowBlur: 10,
//             shadowOffsetX: 0,
//             shadowColor: 'rgba(0, 0, 0, 0.5)',
//           },
//         },
//       },
//     ],
//   };
//   // 使用刚指定的配置项和数据显示图表
//   chart.setOption(option);
// };
// const OrderInfo = ref([{
//     "waterOrderTime": "",
//     "waterDeliverTime": "",
// }])
const DeliverTime = ref("");
const OrderTime = ref("");
const GetTwoTime = async(param1,param2) => {
  let param = {
    waterOrderId:param1,
    waterOrderNumber:param2
  }
  let result = await GetTwoTimeService(param);
  DeliverTime.value = result.data.waterDeliverTime;
  console.log(DeliverTime.value);
  OrderTime.value = result.data.waterOrderTime;
  console.log(OrderTime.value);

}
const source1 = ref(0)
const source2 = ref(0)
const source3 = ref(0)
const source4 = ref(0)

const outputValue1 = useTransition(source1, {
  duration: 1500,
})
const outputValue2 = useTransition(source2, {
  duration: 1500,
})
const outputValue3 = useTransition(source3, {
  duration: 1500,
})
const outputValue4 = useTransition(source4, {
  duration: 1500,
})


</script>

<template>
    <!-- <el-card class="box-card">
      <div ref="chartRef" style="height: 300px;"></div>
    </el-card> -->

    <el-card>
      <el-row>
    <el-col :span="6">
          <!-- <el-statistic title="未接收(桶)" :value="waterCondition.unconfirmed" /> -->
          <el-statistic title="未接收(桶)" :value="outputValue1" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="运送中(桶)" :value="outputValue2" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="已完成(桶)" :value="outputValue3" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="已取消(桶)" :value="outputValue4" />
        </el-col>
      </el-row>
    </el-card>


    <el-card class="page-container">
            <el-tabs type="border-card" class="demo-tabs">
      <el-tab-pane>
        <template #label>
          <span class="custom-tabs-label" @click="handleButtonClick(0)">
            <el-icon><calendar /></el-icon>
            <span>未接收</span>
          </span>
        </template>
        <el-table :data="waters" style="width: 100%" v-loading="loading">
          <el-table-column prop="waterOrderId" label="订单ID"></el-table-column>
          <el-table-column prop="waterOrderNumber" label="订单编号"></el-table-column>
          <el-table-column prop="dormNumber" label="客户宿舍"></el-table-column>
          <el-table-column prop="waterCount" label="本单桶数"></el-table-column>         
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
            <el-popover placement="right" :width="380" trigger="hover" @show="GetTwoTime(row.waterOrderId,row.waterOrderNumber)">
                <template #reference>
                  <el-button :icon="Edit" circle plain type="primary" @click="processStates(row);"></el-button>
                </template>
                <el-descriptions column="1">
                  <el-descriptions-item label="预定时间">{{ OrderTime }}</el-descriptions-item>
                  <el-descriptions-item label="送达时间">暂无</el-descriptions-item>
                </el-descriptions>
              </el-popover>
        </template>
          </el-table-column>
          </el-table>
      </el-tab-pane>
      
      <el-tab-pane label="Config">
          <template #label>
          <span class="custom-tabs-label" @click="handleButtonClick(1)">
            <el-icon><calendar /></el-icon>
            <span>运送中</span>
          </span>
        </template>
        <el-table :data="waters" style="width: 100%" v-loading="loading">
          <el-table-column prop="waterOrderId" label="订单ID"></el-table-column>
          <el-table-column prop="waterOrderNumber" label="订单编号"></el-table-column>
          <el-table-column prop="dormNumber" label="客户宿舍"></el-table-column>
          <el-table-column prop="waterCount" label="本单桶数"></el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
            <el-popover placement="right" :width="380" trigger="hover" @show="GetTwoTime(row.waterOrderId,row.waterOrderNumber)">
                <template #reference>
                  <el-button :icon="Edit" circle plain type="primary" @click="processStates(row);"></el-button>
                </template>
                <el-descriptions column="1">
                  <el-descriptions-item label="预定时间">{{ OrderTime }}</el-descriptions-item>
                  <el-descriptions-item label="送达时间">暂无</el-descriptions-item>
                </el-descriptions>
              </el-popover>
        </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>


      <el-tab-pane label="Role">
          <template #label>
          <span class="custom-tabs-label" @click="handleButtonClick(2)">
            <el-icon><calendar /></el-icon>
            <span>已完成</span>
          </span>
        </template>
        <el-table :data="waters" style="width: 100%" v-loading="loading">
          <el-table-column prop="waterOrderId" label="订单ID"></el-table-column>
          <el-table-column prop="waterOrderNumber" label="订单编号"></el-table-column>
          <el-table-column prop="dormNumber" label="客户宿舍"></el-table-column>
          <el-table-column prop="waterCount" label="本单桶数"></el-table-column>
          <el-table-column prop="waterOrderStatus" label="订单状态"></el-table-column>
          <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-popover placement="right" :width="380" trigger="hover" @show="GetTwoTime(row.waterOrderId,row.waterOrderNumber)">
                <template #reference>
                  <el-button :icon="Edit" circle plain type="primary" @click="processStates(row);" :disabled="true"></el-button>
                </template>
                <el-descriptions column="1">
                  <el-descriptions-item label="预定时间">{{ OrderTime }}</el-descriptions-item>
                  <el-descriptions-item label="送达时间">{{ DeliverTime }}</el-descriptions-item>
                </el-descriptions>
              </el-popover>
        </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>


      <el-tab-pane label="Task">
          <template #label>
          <span class="custom-tabs-label" @click="handleButtonClick(3)">
            <el-icon><calendar /></el-icon>
            <span>已取消</span>
          </span>
        </template>
        <el-table :data="waters" style="width: 100%" v-loading="loading">
          <el-table-column prop="waterOrderId" label="订单ID"></el-table-column>
          <el-table-column prop="waterOrderNumber" label="订单编号"></el-table-column>
          <el-table-column prop="dormNumber" label="客户宿舍"></el-table-column>
          <el-table-column prop="waterCount" label="本单桶数"></el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
            <el-popover placement="right" :width="380" trigger="hover" @show="GetTwoTime(row.waterOrderId,row.waterOrderNumber)">
                <template #reference>
                  <el-button :icon="Edit" circle plain type="primary" @click="processStates(row);" :disabled="true"></el-button>
                </template>
                <el-descriptions column="1">
                  <el-descriptions-item label="预定时间">{{ OrderTime }}</el-descriptions-item>
                  <el-descriptions-item label="送达时间">暂无</el-descriptions-item>
                </el-descriptions>
              </el-popover>
        </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
      </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;

  // .header {
  //   display: flex;
  //   align-items: center;
  //   justify-content: space-between;
  // }
}

// .container {
//   display: flex;
// }

.page-container {
  width: 100%;
}

// .box-card {
//   width: 100%;
// }

</style>
