<script setup>
import {
    Edit,
    Delete,
    View,
} from '@element-plus/icons-vue'

import { defineComponent } from 'vue';
  import { Message} from '@arco-design/web-vue';
  import {
    IconCaretRight,
    IconCaretLeft,
    IconHome,
    IconCalendar,
  } from '@arco-design/web-vue/es/icon';



import { ref } from 'vue'

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

//用户搜索时选中的分类id
const categoryId=ref('')

//用户搜索时选中的发布状态
const state=ref('')

//文章列表数据模型
const helpPages = ref([
    {
        "id": '',
        "username":'',
        "name":'',
        "phone":'',
        "title": '',
        "content": '',
        "image":'',
        "typeId":'',
        "createTime": '',
        "updateTime": ''
    }
])

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(5)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size;
    helpPagePageList();
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num;
    helpPagePageList();
}

//回显帖子类别
import {typePageListService} from '@/api/square.js'
const typePageList = async()=>{
    let result = await typePageListService();
    console.log(result.data);
    categorys.value = result.data;
}
typePageList();

//回显帖子
import {helpPageListService} from '@/api/square.js'
const helpPageList = async()=>{
    let result = await helpPageListService();
    console.log(result.data);
    helpPages.value = result.data;
}
//helpPageList()

//日期选择器的vue对象
const searchDateRange = ref('');


//控制表单加载的动画
const loading = ref(true)

//page方式回显帖子
import {echoUserAvatorService} from '@/api/square.js'
import {helpPagePageListService} from '@/api/square.js'
const helpPagePageList = async()=>{
    loading.value = true;
    //获取查询日期区间
    let leftdate = searchDateRange.value[0];
    let rightdate = searchDateRange.value[1];

    let params = {
        page:pageNum.value,
        pageSize:pageSize.value,
        typeId:categoryId.value ? categoryId.value: null,
        begin:leftdate,
        end:rightdate
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

    loading.value = false;
}
helpPagePageList();

import {Plus} from '@element-plus/icons-vue'
//控制抽屉是否显示
const visibleDrawer = ref(false)
const editDrawer = ref(false)

//控制dialog是否显示
const dialogVisible = ref(false)

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

// 添加quill组件
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'


//上传图片成功后绑定到数据模型
const uploadSuccess = (result)=>{
    articleModel.value.image = result.data;
    console.log(result.data);
}

//修改帖子上传图片成功后绑定到数据模型
const edit_uploadSuccess = (result)=>{
    echoHelpPage.value.image = result.data;
    console.log(result.data);
}

//添加帖子
import { ElMessage } from 'element-plus';
import {helpPageAddService} from '@/api/square.js'
const helpPageAdd = async()=>{
    //与userInfo这个vue对象绑定
    articleModel.value.name = userInfo.value.nickname;
    articleModel.value.username = userInfo.value.username;
    
    //调用接口
    let result = await helpPageAddService(articleModel.value);
    ElMessage.success(result.code===1?'发帖成功⭐':'发帖失败');

    //让抽屉消失
    visibleDrawer.value = false;

    //清空articleModel中的value数据
    articleModel.value='';

    //刷新当前帖子列表
    helpPagePageList();

}


import { useRouter } from 'vue-router';
const router = useRouter();
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

const echoHelpPage = ref({
    "id": '',
    "username":'',
    "name":'',
    "phone":'',
    "title": '',
    "content": '',
    "image":'',
    "typeId":'',
    "createTime": '',
    "updateTime": ''
})

import {editHelpPageByIdService} from '@/api/square.js'
//回显互助帖
const echoHelpPageById = async(param) => {
    console.log(param);
    let result = await gethelpPageByIdService(param);
    echoHelpPage.value = result.data;
    //editDrawer.value = true;
    dialogVisible.value = true;
}

//修改互助帖
const editHelpPageById = async () =>{
    let result = await editHelpPageByIdService(echoHelpPage.value);
    dialogVisible.value = false;
    ElMessage.success(result.code===1?'修改成功⭐':'修改出错');
    //重新加载分页数据
    helpPagePageList();
}

import {deleteHelpPageByIdService} from '@/api/square.js'
//删除指定的互助帖
const deleteHelpPageById = async (id)=>{
    let result = await deleteHelpPageByIdService(id);
    ElMessage.success(result.code===1?'删除成功⭐':'修改出错');
    dialogVisible.value = false;
    //重新加载分页数据
    helpPagePageList();
}

//路由跳转到我的帖子
const gotoMyPage = ()=>{
    router.push('/square/mypage');
}


</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                
                <span style="font-size: 15px;"><icon-settings size="20px"/> 管理SHUer友热帖</span>
                <div class="extra">
                    <!-- <el-button type="primary" @click="visibleDrawer=true">发布帖子</el-button> -->
                    <!-- <el-button type="primary" @click="gotoMyPage">我的帖子</el-button> -->
                </div>
            </div>
        </template>
        <!-- 搜索表单 -->
        <el-form :inline="true" >
            <el-form-item label="帖子分类：" style="width: 230px;">
                <el-select placeholder="请选择" v-model="categoryId">
                    <el-option 
                        v-for="c in categorys" 
                        :key="c.id" 
                        :label="c.typename"
                        :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <!-- <el-form-item label="发布状态：">
                <el-select placeholder="请选择" v-model="state">
                    <el-option label="已发布" value="已发布"></el-option>
                    <el-option label="草稿" value="草稿"></el-option>
                </el-select>
            </el-form-item> -->
            
            <el-form-item label="发布时间">
                <el-date-picker
                    v-model="searchDateRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="YYYY-MM-DD">
                </el-date-picker>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click = "helpPagePageList" round>搜索</el-button>
                <el-button @click="categoryId='';searchDateRange=''" round>重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 帖子列表 -->
        <el-table :data="helpPages" style="width: 100%" v-loading="loading" >

            <el-table-column label="帖子标题" width="400" prop="title"></el-table-column>
            <el-table-column label="分类" width="100" prop="typeName"></el-table-column>

            <el-table-column width="70">
                <template #default="{ row }">
                    <el-avatar :src= "row.userPic ? row.userPic:avatar" />
                </template>
            </el-table-column>
            <el-table-column label="楼主" width="150" prop="name"></el-table-column>
            <el-table-column label="正文" prop="content"></el-table-column>
            <el-table-column label="发表时间" width="200" prop="createTime"> </el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <!-- <el-button :icon="Edit" circle plain type="primary"></el-button>
                    <el-button :icon="Delete" circle plain type="danger"></el-button> -->
                    <!-- 查看详情页的组件 -->
                    <el-button :icon="View" circle plain type="primary" @click="getHelpPageId(row.id)"></el-button>
                    <el-button :icon="Edit" circle plain type="info" @click="echoHelpPageById(row.id)" v-show="userInfoStore.info.role==0"></el-button>
                </template>
            </el-table-column>
            
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>

        <!-- 分页条 -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5 ,10, 15]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
    
    </el-card>

    <!-- 抽屉 -->
    <el-drawer v-model="visibleDrawer" title="发布帖子📕" direction="rtl" size="40%" style="background-color: #fef7ff;">
        <!-- 发布帖子表单 -->
        <el-form :model="articleModel" label-width="100px" >
            <el-form-item label="帖子标题" style = "width:60%">
                <el-input v-model="articleModel.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="帖子分类">
                <el-select placeholder="请选择" v-model="articleModel.typeId">
                    <el-option v-for="c in categorys" :key="c.id" :label="c.typename" :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发张图片🤳">
                <!-- auto-upload -->

                <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false"
                    action="https://47.115.229.197:8445/upload"
                    name="image"
                    :on-success="uploadSuccess"
                    :headers="{'Authorization':tokenStore.token}"
                >
                    <img v-if="articleModel.image" :src="articleModel.image" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="帖子内容">
                <div class="editor">
                    <!-- <quill-editor theme="snow" v-model:content="articleModel.content" contentType="html"></quill-editor> -->
                    <el-input
                        v-model="articleModel.content"
                        maxlength="200"
                        placeholder="Please input"
                        show-word-limit
                        type="textarea"
                        :autosize="{ minRows: 4, maxRows: 10 }"
                    />
                </div>
            </el-form-item>

            <el-row>
                <el-col span="12">
                    <el-form-item label="联系方式📞" >
                        <el-input v-model="articleModel.phone" placeholder="请输入手机号码"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>


            <el-form-item>
                <el-button type="primary" @click="helpPageAdd">发布🚀</el-button>
                <el-button type="info">草稿📫</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>


    <!-- 修改回显用的抽屉 -->
    <el-drawer v-model="editDrawer" title="编辑帖子" direction="ttb" size="40%">
        <el-form  label-width="100px" >
            
            <el-form-item label="留言内容">

            </el-form-item>
        </el-form>
    </el-drawer>

    <!-- 修改回显用的dialog -->
    <el-dialog v-model="dialogVisible" title="修改帖子" width="40%" :before-close="handleClose">
        <el-form :model="echoHelpPage" label-width="100px" >
            <el-form-item label="帖子标题" style = "width:60%">
                <el-input v-model="echoHelpPage.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            
            <el-form-item label="帖子分类">
                <el-select placeholder="请选择" v-model="echoHelpPage.typeId">
                    <el-option v-for="c in categorys" :key="c.id" :label="c.typename" :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="帖子图片">
                <!-- auto-upload -->
                <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false"
                    action="https://47.115.229.197:8445/upload"
                    name="image"
                    :on-success="edit_uploadSuccess"
                    :headers="{'Authorization':tokenStore.token}"
                >
                    <img v-if="echoHelpPage.image" :src="echoHelpPage.image" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>

            <el-form-item label="帖子内容">
                <div class="editor">
                    <!-- <quill-editor theme="snow" v-model:content="articleModel.content" contentType="html"></quill-editor> -->
                    <el-input
                        v-model="echoHelpPage.content"
                        maxlength="200"
                        placeholder="Please input"
                        show-word-limit
                        type="textarea"
                        :autosize="{ minRows: 4, maxRows: 10 }"
                    />
                </div>
            </el-form-item>

            <el-form-item label="联系方式" style = "width:60%">
                <el-input v-model="echoHelpPage.phone" placeholder="请输入标题"></el-input>
            </el-form-item>
            
        </el-form>

        <template #footer>
        <span class="dialog-footer">
            <el-button type="primary" @click="editHelpPageById" round>确认修改</el-button>
            <el-button @click="dialogVisible = false" round>取消修改</el-button>
            <el-button type="danger" @click="deleteHelpPageById(echoHelpPage.id)" round>删除帖子</el-button>
        </span>
        </template>

    </el-dialog>

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

.dialog-footer button:first-child {
  margin-right: 10px;
}

// 日期选择器的样式
.demo-date-picker {
  display: flex;
  width: 60%;
  padding: 0;
  flex-wrap: wrap;
}
.demo-date-picker .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}
.demo-date-picker .block:last-child {
  border-right: none;
}
.demo-date-picker .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}


</style>