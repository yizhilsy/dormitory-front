<script setup>
import {
    Edit,
    Delete,
    Document
} from '@element-plus/icons-vue'
import { ref,watch  } from 'vue'
const dialogVisibleOrder = ref(false)
const dialogVisibleDelete = ref(false)
const dialogVisibleSelect = ref(false)
const dialogVisiblePay = ref(false)

import useUserInfoStore from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();
const userInfo = ref({...userInfoStore.info})

import {useTokenStore} from '@/stores/token.js'
const tokenStore = useTokenStore();

const AllOrders = ref([{
    "waterOrderId": 1,
    "waterOrderNumber": "f363156729",
    "dormNumber": "1210",
    "studentId": 2,
    "waterOrderTime": "2024-01-13 00:05:15",
    "waterDeliverTime": "2024-01-11 00:00:00",
    "waterOrderStatus": "已完成",
    "waterStationId": 1,
    "waterCount": 2

}])

const studentInfomation = ref({
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

const waterOrder = ref({
    "dormNumber":"",
    "studentId":"",
    "waterDeliverTime":"",
    "waterStationId":"",
    "waterCount":""
})

const monthlyData = ref({
    "dormNumber": "1210",
    "totalOrdered": 1,
    "totalWaterCount": 2,
    "unconfirmed": 0,
    "delivering": 0,
    "finished": 1,
    "canceled": 0,
    "currentPrice": 20.0
})

const StationAndPrice = ref([{
    "waterStationId": 3,
    "waterStationUsername": "glszsz",
    "waterStationName": "甘露水站",
    "waterStationLocation": "校内",
    "waterPrice": 11
}])

const Bills = ref([{
    "waterBillId": 0,
    "waterBillNumber": "",
    "dormNumber": "",
    "waterBillStatus": "",
    "waterStationId": 0,
    "waterStationName": "",
    "totalPrice": 0,
    "waterCount": 0
}])

const PayBills = ref([{
    "waterBillId": 0,
    "waterBillNumber": "",
    "dormNumber": "",
    "waterBillStatus": "",
    "waterStationId": 0,
    "waterStationName": "",
    "totalPrice": 0,
    "waterCount": 0
}])

const PayParam = ref({
    "waterBillId": 0,
    "waterBillNumber": "",
    "dormNumber": "",
    "waterBillStatus": "",
    "waterStationId": 0,
    "waterStationName": "",
    "totalPrice": 0,
    "waterCount": 0
})

import {GetWaterBillService,GetstuInformationService,CancelOrderService,GetPriceService,GetStationAndPrice,OrderWaterService,GetBillsService,PayService} from '@/api/water.js';
import { format } from 'date-fns'

const GetstationAndprice = async()=>{
    let params = {
        pageNum:1,
        pageSize:100
    }
    let result = await GetStationAndPrice(params)
    StationAndPrice.value = result.data.items;
}
GetstationAndprice();

const GetStudentInfo = async()=>{
    let params = {
        studentUserName:userInfo.value.username
    }
    let result = await GetstuInformationService(params);
    studentInfomation.value = result.data;
}
GetStudentInfo();

const GetBills = async() =>{
    let params = {
        pageNum:1,
        pageSize:100,
        dormNumber: studentInfomation.value.dormNumber
    }
    let result = await GetBillsService(params);
    Bills.value = result.data.items;
    console.log(Bills.value);
    PayBills.value = Bills.value.filter(bill => bill.waterBillStatus === "未缴费");
    // PayBills.value = Bills.value
    console.log(PayBills.value);
    // console.log(PayBills.value.length);
}
GetBills();

const orderList = async()=>{
    let params = {
        pageNum:1,
        pageSize:100,
        dormNumber: studentInfomation.value.dormNumber
    } 
    let result = await GetWaterBillService(params);
    AllOrders.value = result.data.items;
}
orderList();

const CancelOrder = async(row)=>{
    let params={
        waterOrderId:row.waterOrderId,
        waterOrderNumber:row.waterOrderNumber
    }
    let result = await CancelOrderService(params);
    orderList();
}

const Getprice = async()=>{
    let params = {
        dormNumber: studentInfomation.value.dormNumber
    }
    let result = await GetPriceService(params)
    monthlyData.value = result.data;
}
Getprice();

const date = ref('')

const disabledDate = (time) => {
    let today = new Date();
    let maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 10);
    return time < today || time > maxDate;
}

import {ElMessage} from 'element-plus'
const submitOrder = async() =>{
    waterOrder.value.waterDeliverTime = format(new Date(date.value), 'yyyy-MM-dd HH:mm:ss')
    waterOrder.value.dormNumber = studentInfomation.value.dormNumber;
    waterOrder.value.studentId = studentInfomation.value.studentId;
    let result = await OrderWaterService(waterOrder.value);
    ElMessage.success(result.msg ? result.msg :'订水成功！')
    // console.log(111);
    dialogVisibleOrder.value = false;
}

const PayForAll = async() => {
    for(var i=0; i<PayBills.value.length; i++){
        PayParam.value = PayBills.value[i];
        console.log(PayParam.value);
        let result = await PayService(PayParam.value);
        ElMessage.success(result.msg ? result.msg :'支付成功！')
    }
    dialogVisiblePay.value = false;
    Getprice();
    // console.log(PayBills.value.length);
    // console.log(PayBills.value);
}



</script>

<template>
 <div class="container">
    <el-card class="box-card">
        <div class="text item" style="font-size: 25px;">
            <p style="font-size: 30px;">您的用户名🤡: <br>
                <el-text tag="mark" style="font-size: 25px; font-weight: bold; margin-left: 20px;">{{userInfo.username}}</el-text></p>
            <p style="font-size: 30px;">您的宿舍号📜: <br>
                <el-text tag="mark" style="font-size: 25px; font-weight: bold; margin-left: 20px;">{{studentInfomation.dormNumber}}</el-text></p>
            <p style="font-size: 30px;">当前应缴费💰: <br>
                <el-text tag="mark" style="font-size: 25px; font-weight: bold; margin-left: 20px; margin-right: 20px;">{{monthlyData.currentPrice}}元</el-text>
                <el-button type="warning"  @click="dialogVisiblePay = true">一键付款</el-button>
            </p>
        </div>
    </el-card>

    <el-card class="page-container">
        <template #header>
        <div class="header">
            <span>操作列表</span>
        </div>
    </template>
        <div class="button-container">
            <el-button type="primary"  @click="dialogVisibleOrder = true; " circle class="enlarged-button">订个水吧</el-button>
            <el-button type="primary"  @click="dialogVisibleDelete = true; " circle class="enlarged-button">查询&取消</el-button>
        </div>
    </el-card>

    <el-dialog v-model="dialogVisiblePay" title="💰您的帐单💰" width="30%">
        <el-table
            :data="PayBills"
            height="200"
            :summary-method="getSummaries"
            show-summary
            style="width: 100%; margin-top: 20px"
          >
            <el-table-column prop="waterStationName" label="水站名称"/>
            <el-table-column prop="waterBillNumber" label="账单编号" />
            <el-table-column prop="totalPrice" label="应付金额" />
          </el-table>
          <div style="margin-top: 10px"></div>
          <div style="text-align: center;">
            <el-button type="warning" @click="PayForAll">付款</el-button>
        </div>         
    </el-dialog>


    <el-drawer v-model="dialogVisibleOrder" title="💰订个水吧💰" direction="rtl" size="40%">
        <el-table :data="StationAndPrice" style="width: 100%">
            <template #header>
            <div class="header">
                <span>水站详情</span>
            </div>
            </template>
            <el-table-column label="水站名称" prop="waterStationName"></el-table-column>
            <el-table-column label="水站位置" prop="waterStationLocation"></el-table-column>
            <el-table-column label="单桶价格" prop="waterPrice"></el-table-column>
        </el-table>
        <p></p>
        <el-form>
            <el-form-item label="🏠所选水站">
                <el-select v-model="waterOrder.waterStationId" placeholder="请选择水站">
                    <el-option
                        v-for="station in StationAndPrice"
                        :key="station.waterStationId"
                        :label="station.waterStationName"
                        :value="station.waterStationId"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="📈定水数量">
                <el-select v-model="waterOrder.waterCount" placeholder="请选择定水数量">
                    <el-option label="1" value="1"></el-option>
                    <el-option label="2" value="2"></el-option>
                    <el-option label="3" value="3"></el-option>
                    <el-option label="4" value="4"></el-option>
                    <el-option label="5" value="5"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="⏰️配送日期">
                <el-date-picker
                    v-model="date"
                    type="datetime"
                    placeholder="选择送水时间"
                    format="YYYY-MM-DD HH:mm:ss"
                    date-format="MMM DD, YYYY"
                    time-format="HH:mm"
                    :disabled-date="disabledDate"
                    style="width: 44%"
                ></el-date-picker>
            </el-form-item>
            <el-form-item>
                    <el-button type="primary" @click="submitOrder" size="large" center>提交订单</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>


    <el-drawer v-model="dialogVisibleDelete" title="✅查询❌取消" direction="rtl" size="50%">
        <el-table :data="AllOrders" style="width: 100%">
            <el-table-column label="账单编号" prop="waterOrderId"></el-table-column>
            <el-table-column label="订单编号" prop="waterOrderNumber"></el-table-column>
            <el-table-column label="订水时间" prop="waterOrderTime"></el-table-column>
            <el-table-column label="订单状态" prop="waterOrderStatus"></el-table-column>
            <el-table-column label="取消">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="CancelOrder(row)" :disabled="row.waterOrderStatus!=='未接收'"></el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-drawer>

 </div>
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

    .button-container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%; 
    }

    .enlarged-button {
    font-size: 30px;
    width: 150px;
    height: 150px;
    margin-right: 100px; /* 可根据需要调整按钮之间的右边距 */
}
}
.container {
  display: flex;
}

.page-container {
    width: 70%;
}

.box-card {
  width: 30%; 
  margin-right: 10px;
}
</style>