import request from '@/utils/request.js'

export const CheckService = (params) =>{
    return request.get('/check/dailyscoreboard',{params:params})
}

export const ProcessService = (params) =>{
    return request.get('/check/appeal/list',{params:params})
}

export const finalService = (params) =>{
    return request.post('/check/appeal/verifyYes',params)
}

export const final2Service = (params) =>{
    return request.post('/check/appeal/verifyNo',params)
}

export const checkCutService = (params) =>{
    return request.post('/check/add',params)
}

export const AppealListService = (params) =>{
    return request.get('/check/list',{params:params})
}

export const SendAppealService = (params) =>{
    return request.post('/check/appeal',params)
}

export const GetTopService = () =>{
    return request.get('/check/rank/top')
}

export const GetBottomService = () =>{
    return request.get('/check/rank/bottom')
}

export const GetstuInformation = (params) =>{
    return request.get('/user/getStudentInfo',{params:params})
}
