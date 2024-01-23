<template>
    <el-card class="page-container">
      <template #header>
          <div class="header">
              <span style="font-size: 15px;">
                <IconHeartFill :style="{ color: '#f53f3f' }"/>
                我的喜欢
              </span>
              <div class="extra">
                  <el-button type="primary" @click="gotoSHUer" round>返回广场</el-button>
              </div>
          </div>
      </template>

      <a-tabs default-active-key="0" type="rounded"
      @tab-click="onTabClick"
      >
        <a-tab-pane key="0" title="全部热帖">
          <!-- Content of Tab Panel 1 -->
        </a-tab-pane>
        <a-tab-pane key="1" title="求助">
          <!-- Content of Tab Panel 2 -->
        </a-tab-pane>
        <a-tab-pane key="2" title="拼单">
          <!-- Content of Tab Panel 2 -->
        </a-tab-pane>
        <a-tab-pane key="3" title="讨论">
          <!-- Content of Tab Panel 2 -->
        </a-tab-pane>
        <a-tab-pane key="4" title="交友">
          <!-- Content of Tab Panel 2 -->
        </a-tab-pane>
        <a-tab-pane key="5">
          <template #title>二手集市</template>
          <!-- Content of Tab Panel 3 -->
        </a-tab-pane>
      </a-tabs>

      <!-- 接入帖子板块 -->
      <a-list
        class="list-demo-action-layout"
        :bordered="false"
        :data="helpPages"
        :loading="listLoading"
      >

        <template #scroll-loading>
          <div v-if="bottom">
            <icon-check />
            帖子加载完啦
          </div>
          <a-spin v-else />
        </template>

        <template #item="{ item }">
          <a-list-item class="list-demo-item" action-layout="vertical"
          @mouseover="testmousein(item)" 
          @mouseout="testmouseout(item)"
          @click="alistitemClick(item)"
          :style="{ backgroundColor: item.hover ? 'lightblue' : 'white' }">
            <template #actions>
              <!-- 点赞功能的click标签 -->
              <span class="action" key="heart" @click="onLikeChange(item)"> 
                <span v-if="item.isLike">
                  <IconHeartFill :style="{ color: '#f53f3f' }"/>
                </span>
                <span v-else>
                  <IconHeart class="action"/>
                </span>
                  {{ item.likeNum}}
              </span>

              <span><icon-star />{{ item.id }}</span>
              <span><icon-message />Reply</span>
            </template>
            <template #extra>
              <div className="image-area">
                <img alt="arco-design" :src="item.image" />
              </div>
            </template>
              <a-typography-title :style="{ margin: 0, fontSize: '16px'}" :heading="5">
                {{ item.title }}
                <a-tag bordered style="margin-left: 10px;" :color="colors[item.typeId]">{{item.typeName}}</a-tag>
                <span style="margin-left: 20px;font-size: 13px;vertical-align: bottom;">创建时间:{{ item.createTime }}</span>
                <span style="margin-left: 20px;font-size: 13px;vertical-align: bottom;">最近修改:{{ item.updateTime }}</span>
              </a-typography-title>
              
            <a-list-item-meta
              :title="item.name"
              :description="item.content"
            >
              <template #avatar>
                <a-avatar shape="square">
                  <img alt="avatar" :src="item.userPic" />
                </a-avatar>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
  </el-card>
  

  




</template>

<script setup>
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

import { useRouter } from 'vue-router';
const router = useRouter();

import {useTokenStore} from '@/stores/token.js'
const tokenStore = useTokenStore();

import useUserInfoStore from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();
const userInfo = ref({...userInfoStore.info})

//文章分类数据模型
const categorys = ref([
    {
        "id": 1,
        "typename": "求助",
    }
])

// 用户搜索时选中的分类id
const categoryId=ref('')

// list方法回显帖子类别
import {typePageListService} from '@/api/square.js'
const typePageList = async()=>{
    let result = await typePageListService();
    console.log(result.data);
    categorys.value = result.data;
}
typePageList();

// 文章列表数据模型
const helpPages = ref([
    {
        "id": ' ',
        "username":' ',
        "name":' ',
        "phone":' ',
        "title": ' ',
        "content": ' ',
        "image":' ',
        "typeId":' ',
        "createTime": ' ',
        "updateTime": ' ',
    }
])

const appendPages = ref([
    {
        "id": ' ',
        "username":' ',
        "name":' ',
        "phone":' ',
        "title": ' ',
        "content": ' ',
        "image":' ',
        "typeId":' ',
        "createTime": ' ',
        "updateTime": ' '
    }
])

// 点赞系统
import {likeNumService} from '@/api/square.js'
import {whoLikeService} from '@/api/square.js'
import {nowLikeService} from '@/api/square.js'
import {nowCancelService} from '@/api/square.js'
import {hotest5Service} from '@/api/square.js'

// 分页查询
//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(10)//总条数
const pageSize = ref(10)//每页条数

const bottom = ref(false);//是否请求完毕

// 设置list表格的数据加载
const listLoading = ref(true);

// page方式我喜欢的帖子初始第一次的回显10页
import {echoUserAvatorService} from '@/api/square.js'
import {myLikePageService} from '@/api/square.js'
const myLikePage = async() => {
    listLoading.value = true;
    bottom.value = false;
    let params = {
        page:pageNum.value,
        pageSize:pageSize.value,
        typeId:categoryId.value ? categoryId.value: null,
    }
    let result = await myLikePageService(params,userInfo.value.id);
    total.value = result.data.total;
    helpPages.value = result.data.rows;

    //设置helppage的typename字段
    for(let i=0;i<helpPages.value.length;i++){
        let page = helpPages.value[i];
        for(let j=0;j<categorys.value.length;j++){
            if(page.typeId==categorys.value[j].id){
                page.typeName = categorys.value[j].typename;
            }
        }
    }

    //设置helppage的createTime和updateTime字段
    for(let i=0;i<helpPages.value.length;i++){
        let page = helpPages.value[i];
        page.createTime = page.createTime.replaceAll('T',' ');
        page.updateTime = page.updateTime.replaceAll('T',' ');
    }

    //设置helppage的userPic字段
    for(let i=0;i<helpPages.value.length;i++){
        let page = helpPages.value[i];
        let result = await echoUserAvatorService(page.username);
        page.userPic = result.data.userPic;
    }

    //设置helppage的hover字段
    for(let i=0;i<helpPages.value.length;i++){
        let page = helpPages.value[i];
        page.hover = false;
    }
    
    //设置helppage的likeNum字段
    for(let i=0;i<helpPages.value.length;i++){
        let page = helpPages.value[i];
        let numR = await likeNumService(page.id);
        page.likeNum = numR.data
    }

    //设置helpPage的isLike字段
    for(let i=0;i<helpPages.value.length;i++){
        let page = helpPages.value[i];
        let whoLikeR = await whoLikeService(page.id);
        let whoLike = whoLikeR.data;
        let flag = false;
        for(let j=0;j<whoLike.length;j++){
          if(userInfo.value.id == whoLike[j]){
            page.isLike = true;
            flag = true;break;
          }
        }
        if(flag == false){
          page.isLike = false;
        }
    }
    if(pageNum.value*pageSize.value>=total.value){
        bottom.value = true;
    }
    //加载完成
    listLoading.value = false;
}
myLikePage();

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
console.log("^^^^^^^^^^^^^^^^^");
console.log(colors);

// page方式追加帖子尝试一次追加10页到appendPages中
const Append_helpPagePageList = async()=>{
    //listLoading.value = true;
    bottom.value = false;
    appendPages.value = [];
    let params = {
        page:pageNum.value,
        pageSize:pageSize.value,
        typeId:categoryId.value ? categoryId.value: null,
    }
    let result = await myLikePageService(params,userInfo.value.id);
    total.value = result.data.total;
    appendPages.value = result.data.rows;
    console.log(result.data.rows);

    //设置appendPages的typename字段
    for(let i=0;i<appendPages.value.length;i++){
        let page = appendPages.value[i];
        for(let j=0;j<categorys.value.length;j++){
            if(page.typeId==categorys.value[j].id){
                page.typeName = categorys.value[j].typename;
            }
        }
    }

    //设置appendPages的createTime和updateTime字段
    for(let i=0;i<appendPages.value.length;i++){
        let page = appendPages.value[i];
        page.createTime = page.createTime.replaceAll('T',' ');
        page.updateTime = page.updateTime.replaceAll('T',' ');
    }

    //设置appendPages的userPic字段
    for(let i=0;i<appendPages.value.length;i++){
        let page = appendPages.value[i];
        let result = await echoUserAvatorService(page.username);
        page.userPic = result.data.userPic;
    }

    //设置appendPages的hover字段
    for(let i=0;i<appendPages.value.length;i++){
        let page = appendPages.value[i];
        page.hover = false;
    }

    //设置appendPages的like字段
    for(let i=0;i<appendPages.value.length;i++){
      let page = appendPages.value[i];
      let numR = await likeNumService(page.id);
      page.likeNum = numR.data;
    }

    //设置appendPages的isLike字段
    for(let i=0;i<appendPages.value.length;i++){
      let page = appendPages.value[i];
      let whoLikeR = await whoLikeService(page.id);
      let whoLike = whoLikeR.data;
      let flag = false;
      for(let j=0;j<whoLike.length;j++){
        if(userInfo.value.id == whoLike[j]){
          page.isLike = true;
          flag = true;break;
        }
      }
      if(flag == false){
        page.isLike = false;
      }
    }

    // 追加数据
    for(let i=0;i<appendPages.value.length;i++){
        let page = appendPages.value[i];
        helpPages.value.push(page);
    }
    if(pageNum.value*pageSize.value>=total.value){
        bottom.value = true;
    }
    //listLoading.value = false;
}

// 设置帖子鼠标进入的高亮
const testmousein = (item) => {
  item.hover = true;
}
const testmouseout = (item) => {
  item.hover = false;
}


import {useHelpPageStore} from '@/stores/helpPage.js'
const HelpPageStore = useHelpPageStore();
//查看详情帖的js函数
import {gethelpPageByIdService} from '@/api/square.js'

const getHelpPageId = async(param)=>{
    console.log(param);
    let result = await gethelpPageByIdService(param);

    result.data.createTime = result.data.createTime.replaceAll('T',' ');
    result.data.updateTime = result.data.updateTime.replaceAll('T',' ');

    let data = result.data;

    //设置data的typename字段
    for(let i=0;i<categorys.value.length;i++){
        if(data.typeId==categorys.value[i].id){
            data.typeName = categorys.value[i].typename;
        }
    }
    console.log(data);
    HelpPageStore.removeInfo();
    HelpPageStore.setInfo(data);
    router.push('/square/pageInfo');
}

//路由跳转到我的帖子
const gotoSHUer = ()=>{
    router.push('/welcome');
}


// const bottom = ref(false);
// bitflow字节浪潮核心技术
import {usebitFlowFlagStore} from '@/stores/bitFlowFlag.js'
//获取当前详情页在后端数据库的互助帖信息,pinia加载
const bitFlowFlagStore = usebitFlowFlagStore();
//helppage的数据模型
const bitFlowFlag = ref({
    ...bitFlowFlagStore.bitFlowFlagInfo
})

console.log("90909090909090909090");
console.log(bitFlowFlag.value.flag);
import { watchEffect } from 'vue';
// 监听 bitFlowFlagStore.bitFlowFlagInfo.flag 的变化
import { watch } from 'vue';
watch(
  () => bitFlowFlagStore.bitFlowFlagInfo.flag,
  (newValue, oldValue) => {
    // 在这里执行当 bitFlowFlagStore.bitFlowFlagInfo.flag 发生变化时的操作
    console.log("======================================");
    console.log('bitFlowFlagStore.bitFlowFlagInfo.flag 发生变化', newValue, oldValue);

    // 触发您想要执行的事件
    // 例如：this.$emit('bitFlowFlagStoreChanged', newValue);
    if(newValue==true&&oldValue==false){ //layout布局滑到底部了
      //判断是否还能继续请求
      if(pageNum.value*pageSize.value<total.value){ //可以继续请求
        pageNum.value = pageNum.value + 1;
        console.log(pageNum.value,pageSize.value,"再次请求！！！");
        Append_helpPagePageList();
      }else{
        // 帖子已经全部请求，设置bottom为false;
        bottom.value = true;
        console.log("all helpPages has been there...");
      }
    }
  },
  { deep: true } // 使用深度监听，以便在对象内部属性发生变化时也触发
);


//发布帖子数据模型
const articleModel = ref({
    id: '',
    username: '',
    name: '',
    phone: '',
    title: '',
    content:'',
    image: '',
    typeId: '',
    createTime: '',
    updateTime: '',
})


//上传图片成功后绑定到数据模型
const uploadSuccess = (result) => {
    articleModel.value.image = result.data;
    console.log(result.data);
}

const images = ref([
      'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp',
      'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/6480dbc69be1b5de95010289787d64f1.png~tplv-uwbnlip3yd-webp.webp',
      'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/0265a04fddbd77a19602a15d9d55d797.png~tplv-uwbnlip3yd-webp.webp',
    ]);

// 点击tab后触发的事件
const onTabClick = (key) => {
  if(key != 0 ){
    categoryId.value = key;
    pageNum.value = 1;
    //初始请求
    myLikePage();
  }else {
    categoryId.value = null;
    pageNum.value = 1;
    //初始请求
    myLikePage();
  }
  
}

const nowLike = async(id,uid) => {
  await nowLikeService(id,uid);
}

const nowCancel = async(id,uid) => {
  await nowCancelService(id,uid);
}

const gotoMyLike = () => {
  router.push('/mylike');
}

//listitem的点赞script板块
const like = ref(false);
const onLikeChange = (item) => {
  if(item.isLike){  //此时是取消喜欢
    item.isLike = !item.isLike;
    item.likeNum = item.likeNum-1;
    nowCancel(item.id,userInfo.value.id);
    ElMessage.success('取消喜欢');
    
  }else{  //此时是添加喜欢
    item.isLike = !item.isLike;
    item.likeNum = item.likeNum+1;
    nowLike(item.id,userInfo.value.id);
    ElMessage.success('喜欢成功(❤ ω ❤)');

  }
  
  // 阻止事件冒泡，确保不触发默认区域的操作
  event.stopPropagation();
}

// 这个需要优化一下，逻辑上的冗余
const alistitemClick = (item) => {
  const clickedElement = event.target;
  // 判断点击的是点赞组件
  if (clickedElement.classList.contains('action')) {
        console.log('Clicked on span.action inside list item:', item.id);
        onLikeChange();
        // 阻止事件冒泡，确保不触发默认区域的操作
        event.stopPropagation();
        
    } else {  //非点赞组件，执行查看详情页的操作
      console.log('Clicked on default area in list item:', item.id);
      // 执行默认区域的操作
      getHelpPageId(item.id);
  }

}

// 向后端请求最热的5个帖子
// 最热帖子的数据模型
const hotest5Pages = ref([
    {
        "id": ' ',
        "username":' ',
        "name":' ',
        "phone":' ',
        "title": ' ',
        "content": ' ',
        "image":' ',
        "typeId":' ',
        "createTime": ' ',
        "updateTime": ' ',
    }
])

const getHotest5Pages = async() => {
  let result = await hotest5Service();
  hotest5Pages.value = result.data;
  //设置hotest5Pages的typename字段
  for(let i=0;i<hotest5Pages.value.length;i++){
      let page = hotest5Pages.value[i];
      for(let j=0;j<categorys.value.length;j++){
          if(page.typeId==categorys.value[j].id){
              page.typeName = categorys.value[j].typename;
          }
      }
  }

  //设置hotest5Pages的createTime和updateTime字段
  for(let i=0;i<hotest5Pages.value.length;i++){
      let page = hotest5Pages.value[i];
      page.createTime = page.createTime.replaceAll('T',' ');
      page.updateTime = page.updateTime.replaceAll('T',' ');
  }

  //设置hotest5Pages的userPic字段
  for(let i=0;i<hotest5Pages.value.length;i++){
      let page = hotest5Pages.value[i];
      let result = await echoUserAvatorService(page.username);
      page.userPic = result.data.userPic;
  }
  
  //设置hotest5Pages的likeNum字段
  for(let i=0;i<hotest5Pages.value.length;i++){
      let page = hotest5Pages.value[i];
      let numR = await likeNumService(page.id);
      page.likeNum = numR.data
  }

  //设置hotest5Pages的underHover字段
  for(let i=0;i<hotest5Pages.value.length;i++){
      let page = hotest5Pages.value[i];
      page.underHover = false;
  }
}
getHotest5Pages();

// 控制热帖下划线的js逻辑
const hotmousein = (item) => {
  item.underHover = true;
}
const hotmouseout = (item) => {
  item.underHover = false;
}
const hotestClick = (item) => {
  // 跳转到详情页
  getHelpPageId(item.id);
}

</script>

<style lang="scss" scoped>
.list-demo-action-layout .image-area {
  width: 183px;
  height: 119px;
  border-radius: 2px;
  overflow: hidden;
}

.list-demo-action-layout .list-demo-item {
  padding: 20px 0;
  border-bottom: 1px solid var(--color-fill-3);
}

.list-demo-action-layout .image-area img {
  width: 100%;
}

.list-demo-action-layout .arco-list-item-action .arco-icon {
  margin: 0 4px;
}

// 卡片样式
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}

/* 抽屉样式 */
.avatar-uploader {
    :deep() {
        .avatar {
            width: 500px;
            height: 350px;
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
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}
.editor {
  width: 60%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}

// arco卡片样式
.card-demo {
  width: 400px;
  margin-left: 24px;
  transition-property: all;
}
.card-demo:hover {
  transform: translateY(-4px);
}

.card-demoright {
  width: 120px;
  margin-left: 24px;
  transition-property: all;
}
.card-demoright:hover {
  transform: translateX(-4px);
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

// 热榜css样式
.item {
    display: flex;
    align-items: center;
    width: 100%;
    height: 24px;
    margin-bottom: 4px;
    .item-content {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-left: 4px;
      color: var(--color-text-2);
      text-decoration: none;
      font-size: 13px;
      cursor: pointer;
    }
}

//快捷操作卡片样式
.general-card {
  width: 100px;
  border-radius: 4px;
  border: none;
  & > .arco-card-header {
    height: auto;
    padding: 20px;
    border: none;
  }
  & > .arco-card-body {
    padding: 0 20px 20px 20px;
  }
}
</style>
