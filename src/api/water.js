import request from '@/utils/request.js'

export const WaterOrderSelectService = (param) =>{
    return request.get('/water/listbystation',{params:param})
}

export const OrderWaterService = (param) =>{
    return request.post('/water/order',param)
}

export const GetWaterStationService = () =>{
    return request.get('/water/waterstationInfo')
}

export const ProcessOrderStates = (param) =>{
    return request.post('/water/changestate',param)
}

export const CancelOrderService = (param) =>{
    return request.post('/water/cancel',param)
}

export const GetWaterConditionService = (param) =>{
    return request.get('/water/waterstationMonthlyData',{params:param})
}

export const GetWaterBillService = (param) =>{
    return request.get('/water/listbystudent',{params:param})
}

export const GetstuInformationService = (param) =>{
    return  request.get('/user/getStudentInfo',{params:param})
}

export const GetPriceService = (param) =>{
    return request.get('/water/monthlydata',{params:param})
}

export const GetStationAndPrice = (param) =>{
    return request.get('/water/liststations',{params:param})
}

export const GetBillsService = (param) =>{
    return request.get('/water/listbill',{params:param})
}

export const GetTwoTimeService = (param) =>{
    return request.get('/water/getOrderDetail',{params:param})
}

export const PayService = (param) =>{
    return request.post('/water/pay',param)
}