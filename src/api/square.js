//导入request.js请求工具
import request from "@/utils/request.js"

//调用后端获取帖子list函数
export const helpPageListService = ()=>{
    return request.get('/square');
}

//调用后端以page方式获取帖子的函数
export const helpPagePageListService = (params)=>{
    return request.get('/square/query',{params:params});
}

//调用后端回显指定的互助贴的函数
export const gethelpPageByIdService = (param)=>{
    return request.get('/square'+'/'+param);
}

//调用后端回显指定互助贴的回复贴的函数
export const replyPageListByMainPageIdService = (id)=>{
    return request.get('/square/read'+'/'+id);
}

//调用后端回显帖子种类的函数
export const typePageListService = ()=>{
    return request.get('/type');
}

//调用后端新增帖子的函数
export const helpPageAddService = (helpPageData)=>{
    return request.post('/square',helpPageData);
}
 
//调用后端上传图片的函数，使用阿里云OSS
export const pageImgPostService = (file)=>{
    return request.post('/upload',file);
}

//调用后端回复指定帖子的函数
export const replyPagePostService = (id,replypage)=>{
    return request.post('/square/read/addreply'+'/'+id,replypage);
}

//调用后端修改指定帖子的函数
export const editHelpPageByIdService = (param) =>{
    return request.put('/square',param);
}

//调用后端删除指定的帖子的函数
export const deleteHelpPageByIdService = (id)=>{
    return request.delete('/square'+'/'+id);
}

//调用后端回显用户头像url的函数
export const echoUserAvatorService = (username) =>{
    return request.get('/avator'+'/'+username);
}


