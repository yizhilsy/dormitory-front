<template>
  <el-card class="page-container">
      <template #header>
          <div class="header">
              <span>🔥SHUer友热帖🔥</span>
              <div class="extra">
                  <el-button type="primary" @click="visibleDrawer=true">发布帖子</el-button>
                  <el-button type="primary" @click="gotoMyPage">我的帖子</el-button>
              </div>
          </div>
      </template>

    <!-- 接入帖子板块 -->
    <a-list
      class="list-demo-action-layout"
      :bordered="false"
      :data="helpPages"
      :loading="listLoading"
    >
      <template #item="{ item }">
        <a-list-item class="list-demo-item" action-layout="vertical"
        @mouseover="testmousein(item)" 
        @mouseout="testmouseout(item)"
        @click="getHelpPageId(item.id)"
        :style="{ backgroundColor: item.hover ? 'lightblue' : 'white' }">
          <template #actions>
            <span><icon-heart />11</span>
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
console.log(colors.value);

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
        "updateTime": ' '
    }
])

// 分页查询
//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(30)//每页条数


// 设置list表格的数据加载
const listLoading = ref(true);

//page方式回显帖子
import {echoUserAvatorService} from '@/api/square.js'
import {helpPagePageListService} from '@/api/square.js'
const helpPagePageList = async()=>{
    listLoading.value = true;

    let params = {
        page:pageNum.value,
        pageSize:pageSize.value,
        typeId:categoryId.value ? categoryId.value: null,
    }
    let result = await helpPagePageListService(params);
    total.value = result.data.total;
    helpPages.value = result.data.rows;
    console.log(result.data.rows);

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

    listLoading.value = false;
}
helpPagePageList();

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


</style>
