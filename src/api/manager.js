//导入request.js请求工具
import request from "@/utils/request.js"

//添加用户
export const addUserService = (addUserData)=>{
    const params = new URLSearchParams()
    for(let key in addUserData){
        params.append(key,addUserData[key]);
    }
   return request.post('/manager/addUser',params);
}

//重置用户密码
export const resetUserPwdService = (resetPwdData)=>{
    const params = new URLSearchParams()
    for(let key in resetPwdData){
        params.append(key,resetPwdData[key]);
    }
    return request.post('/manager/resetPwd', params);
}