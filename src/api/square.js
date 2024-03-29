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

//调用后端回显该用户帖子的函数
export const echoMyPageService = (username) =>{
    return request.get('/square/mypage'+'/'+username);
}

//调用后端回显指定帖子点赞数
export const likeNumService = (id) => {
    return request.get('/square/like'+'/'+id);
}

//调用后端回显喜欢指定帖子的用户id
export const whoLikeService = (id) => {
    return request.get('/square/like/who'+'/'+id);
}

//调用后端当前用户喜欢了指定的帖子
export const nowLikeService = (id,u_id) => {
    return request.get('/square/addlike'+'/'+id+'/'+u_id);
}

//调用后端当前用户取消喜欢了指定的帖子
export const nowCancelService = (id,u_id) => {
    return request.get('/square/cancellike'+'/'+id+'/'+u_id);
}

// 调用后端查询点赞数最高的几个帖子
export const hotest5Service = () => {
    return request.get('/square/hotest5');
}

// 调用后端回显当前用户喜欢的帖子
export const myLikePageService = (params,uid) => {
    return request.get('/square/mylike'+'/'+uid,{params:params});
}


