<script setup>
import { ref } from 'vue'
import {
    Star,
    ChatRound,
} from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'


import {useHelpPageStore} from '@/stores/helpPage.js'
//获取当前详情页在后端数据库的互助帖信息,pinia加载
const HelpPageStore = useHelpPageStore();
//helppage的数据模型
const helpPages = ref({
    ...HelpPageStore.helpPageInfo
})
console.log("主帖信息！！！！");
console.log(helpPages);


import useUserInfoStore from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();
const userInfo = ref({...userInfoStore.info})


//replyPages的数据模型
const replyPages = ref([
    {
        "id":'',
        "username":'',
        "name":'',
        "content":'',
        "replyTime":'',
    }
])

const articleReplyPage = ref({
        username:'',
        name:'',
        content:'',
        replyTime:'',
})

//获取replyPages回复贴
import {replyPageListByMainPageIdService} from '@/api/square.js'
import {echoUserAvatorService} from '@/api/square.js'
const replyPageListByMainPageId = async() => {
    let param = helpPages.value.id;
    console.log("主贴的id参数在这里！！！"+param);
    let result =  await replyPageListByMainPageIdService(param);
    console.log(result.data);
    replyPages.value = result.data;
    
    //为replyPages添加头像url数据
    for(let i=0;i<replyPages.value.length;i++){
        let page = replyPages.value[i];
        let result = await echoUserAvatorService(page.username);
        console.log(i);
        console.log(result.data);
        page.userPic = result.data.userPic;
    }
}

//获取helppage后根据helppage的username查询头像url
const getLandlordAvator = async()=>{
    let result = await echoUserAvatorService(helpPages.value.username);
    helpPages.value.userPic = result.data.userPic;
}
getLandlordAvator();
replyPageListByMainPageId();

const urls = [
  'https://shiyulu-dormhelppage.oss-cn-shanghai.aliyuncs.com/880b6663-b2db-435c-99b2-cc7155f90b3b.png',
]

//返回SHUer友广场
import { useRouter } from 'vue-router';
const router = useRouter();
const backsquare = ()=>{
    router.push('/welcome');
}

const url =
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
const srcList = [
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
  'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
  'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
  'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
  'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
  'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
  'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
]

//控制回复贴输入抽屉
const visibleDrawer = ref(false);

//回复指定帖子
import {replyPagePostService} from '@/api/square.js'
import { ElMessage } from 'element-plus';
const replyPagePost = async(id) =>{
    articleReplyPage.value.username = userInfo.value.username;
    articleReplyPage.value.name = userInfo.value.nickname;
    let result = await replyPagePostService(id,articleReplyPage.value)
    console.log(result.message);
    ElMessage.success(result.code===1?'回复成功⭐':'回复失败');
    //让抽屉消失
    visibleDrawer.value = false;

    //清空articleModel中的value数据
    articleReplyPage.value.content='';

    //重新载入回复帖子
    replyPageListByMainPageId();
}

const cancelreply = () =>{
    //清空articleModel中的value数据
    articleReplyPage.value.content='';
    //让抽屉消失
    visibleDrawer.value = false;
}

// 文章分类标签的颜色
const colors = ref([
      'orangered',
      'orange',
      'gold',
      'lime',
      'green',
      'cyan',
      'blue',
      'arcoblue',
      'purple',
      'pinkpurple',
      'magenta',
      'gray'
]);


import {likeNumService} from '@/api/square.js'
import {whoLikeService} from '@/api/square.js'
const getLikeInfo = async() => {
    let result = await likeNumService(helpPages.value.id);
    helpPages.value.likeNum = result.data;
    let whoLikeR = await whoLikeService(helpPages.value.id);
    let whoLike = whoLikeR.data;
    let flag = false;
    for(let j=0;j<whoLike.length;j++){
        if(userInfo.value.id == whoLike[j]){
            helpPages.value.isLike = true;
            flag = true;break;
        }
    }
    if(flag == false){
        helpPages.value.isLike = false;
    }
}
getLikeInfo();

import {nowLikeService} from '@/api/square.js'
import {nowCancelService} from '@/api/square.js'

const nowLike = async(id,uid) => {
  await nowLikeService(id,uid);
}

const nowCancel = async(id,uid) => {
  await nowCancelService(id,uid);
}

const onLikeChange = (item) => {
  if(helpPages.value.isLike){  //此时是取消喜欢
    helpPages.value.isLike = !helpPages.value.isLike;
    helpPages.value.likeNum = helpPages.value.likeNum-1;
    nowCancel(helpPages.value.id,userInfo.value.id);
    ElMessage.success('取消喜欢');
  }else{  //此时是添加喜欢
    helpPages.value.isLike = !helpPages.value.isLike;
    helpPages.value.likeNum = helpPages.value.likeNum+1;
    nowLike(helpPages.value.id,userInfo.value.id);
    ElMessage.success('喜欢成功(❤ ω ❤)');
  }
  // 阻止事件冒泡，确保不触发默认区域的操作
  event.stopPropagation();
}
</script>

<template>

<el-card class="page-container">
    <template #header>
        <div class="header">
            <a-typography-title :style="{ margin: 0, fontSize: '16px'}" :heading="5">
                帖子详情
            </a-typography-title>
            <div class="extra">
                <el-button type="primary" @click="backsquare" round>返回广场</el-button>
            </div>
        </div>
    </template>
    
    <div class="border-container">
        <el-row>
            <el-col :span="20">
                <el-form :model="helpPages" label-width="100px" size="large" height="auto">
                    <el-text class="mx-1" size="large" tag="b">帖子标题：</el-text>
                    <el-text class="mx-1" size="large" tag="b" v-text="helpPages.title"></el-text>
                    <a-tag bordered style="margin-left: 30px;font-size:medium;vertical-align: bottom;" :color="colors[helpPages.typeId]">{{helpPages.typeName}}</a-tag>
                    <!-- 点赞功能的click标签 -->
                    <span class="action" key="heart" @click="onLikeChange" style="margin-left: 20px;font-size: 18px;"> 
                        <span v-if="helpPages.isLike">
                        <IconHeartFill :style="{ color: '#f53f3f' }"/>
                        </span>
                        <span v-else>
                        <IconHeart class="action"/>
                        </span>
                        {{ helpPages.likeNum }}
                    </span>

                    <br/><br/>
                    <el-row>
                        <el-col :span="1">
                            <el-avatar :src= "helpPages.userPic ? helpPages.userPic:avatar" />
                        </el-col>
                        <el-col :span="3">
                            <!-- <br/> -->
                            <el-text class="mx-1" >楼主：</el-text>
                            <el-text class="mx-1" v-text="helpPages.name"></el-text>
                        </el-col>
                        <el-col :span="6">
                            <!-- <br/> -->
                            <el-text class="mx-1" >创建时间：</el-text>
                            <el-text class="mx-1" v-text="helpPages.createTime"></el-text>
                        </el-col>
                        <el-col :span="6">
                            <!-- <br/> -->
                            <el-text class="mx-1" >更新时间：</el-text>
                            <el-text class="mx-1" v-text="helpPages.updateTime"></el-text>
                        </el-col>
                    </el-row>
                    
                    <br/><br/>
                    <el-row>
                        <!-- 放置图片 -->
                        <el-col :span="11">
                            <div class="demo-image__lazy">
                                <el-image  :key="helpPages.image" :src="helpPages.image" lazy />
                            </div>
                            
                        </el-col>
                        <el-col :span="1">  </el-col>
                        <el-col :span="12">
                                <el-text class="mx-1" v-text="helpPages.content"></el-text>    
                                <br/><br/><br/><br/><br/><br/>

                                <el-text class="mx-1">联系方式📞：</el-text>
                                <el-text class="mx-1" v-text="helpPages.phone"></el-text>

                        </el-col>
                    </el-row>
                </el-form>
            </el-col>
        </el-row>    
    </div>

    <br/><br/>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>回帖详情</span>
                <div class="extra">
                    <el-button :icon="ChatRound" type="primary" @click="visibleDrawer=true" round>发表留言</el-button>
                </div>
            </div>
        </template>
        

        <div v-for = "item in replyPages" :key="item">
            <el-card class="page-container2">
                <template #header>
                    <div class="header2">
                        <el-avatar :src="item.userPic ? item.userPic : avatar" />
                        <div style="margin-right:10px"></div>
                        <el-text class="mx-1" v-text="item.name"></el-text>
                        <el-text class="mx-1" style = "text-indent:20px" v-text="item.replyTime"></el-text>
                        <el-text class="mx-1" style = "text-indent:20px;margin-right: 20px;" ></el-text>
                        <span></span>
                        <el-icon ><Star /></el-icon>
                    </div>
                </template>
                
                <el-text class="mx-1" v-text="item.content" style = "text-indent:20px;"></el-text>

            </el-card>
            <br/>
        </div>
        
        <el-drawer v-model="visibleDrawer" title="输入留言" direction="btt" size="40%">
            <el-form  label-width="100px" >
                <el-row>
                    <el-col :span="1">
                        <el-avatar :src= "userInfo.userPic ? userInfo.userPic : avatar" :size="60"/>
                    </el-col>
                    <el-col :span="14">
                        <div class="editor">
                            <!-- <quill-editor theme="snow"  contentType="html">
                                
                            </quill-editor> -->

                            <el-input
                                v-model="articleReplyPage.content"
                                maxlength="100"
                                placeholder="Please input"
                                show-word-limit
                                type="textarea"
                            />
                        </div>        
                    </el-col>
                </el-row>
                <br/>
                
                <el-form-item>
                    <el-button type="primary" @click="replyPagePost(helpPages.id)" round>回帖</el-button>
                    <el-button type="info" @click="cancelreply" round>取消</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>


    </el-card>


    
</el-card>

</template>

<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;
    background-color: #fffbff;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}

.page-container2 {
    min-height: 100%;
    box-sizing: border-box;
    background-color: #f8ebea;

    .header2 {
        display: flex;
        align-items: center;
        // justify-content: space-between;
    }
}



//图片样式
.demo-image__lazy {
  height: 500px;
  overflow-y: auto;
}
.demo-image__lazy .el-image {
  display: block;
  min-height: 200px;
  margin-bottom: 10px;
}
.demo-image__lazy .el-image:last-child {
  margin-bottom: 0;
}


.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: left;
  height: 100px;
//   width: 1200px;
  margin: 10px;
  text-align: left;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}


.editor {
  width: 60%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}


//边框样式
.border-container {
  border: 1px solid #e4e7ed;    /* 设置边框颜色和宽度 */
  box-sizing: border-box;    /* 边框宽度不占用内部空间 */
  padding: 20px;             /* 设置内边距，如果需要 */
  /* 可以根据需要设置其他样式 */
}

// 圆角滑动条样式
::-webkit-scrollbar {
width: 12px;
height: 4px;
}

::-webkit-scrollbar-thumb {
border: 4px solid transparent;
background-clip: padding-box;
border-radius: 10px;
background-color: var(--color-text-4);
}

::-webkit-scrollbar-thumb:hover {
background-color: var(--color-text-3);
}

// arco爱心样式
.action {
  display: inline-block;
  padding: 0 4px;
  color: var(--color-text-1);
  line-height: 24px;
  background: transparent;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.1s ease;
}
.action:hover {
  background: var(--color-fill-3);
}
</style>



