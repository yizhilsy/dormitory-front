<script setup>
import { ref } from 'vue'
import {
    Star,
    ChatRound,
    Edit,
    Delete,
    View,
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'


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

//回显帖子类别
import {typePageListService} from '@/api/square.js'
const typePageList = async()=>{
    let result = await typePageListService();
    console.log(result.data);
    categorys.value = result.data;
}
typePageList();

const helpPages = ref([
    {
        "id": '',
        "username": '',
        "name": '',
        "phone": '',
        "title": '',
        "content": '',
        "image": '',
        "typeId": '',
        "createTime": '',
        "updateTime": '',
    }
])

//回显我的帖子
import {echoMyPageService} from '@/api/square.js'
const echoMyPage = async()=>{

    let result = await echoMyPageService(userInfo.value.username);
    helpPages.value = result.data;

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

}
echoMyPage();

const backsquare = ()=>{
    router.push('/welcome');
}

//保存回显指定id号的帖子的vue对象
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

import {gethelpPageByIdService} from '@/api/square.js'
import {editHelpPageByIdService} from '@/api/square.js'

const dialogVisible = ref(false)

//回显互助帖
const echoHelpPageById = async(param) => {
    console.log(param);
    let result = await gethelpPageByIdService(param);
    echoHelpPage.value = result.data;
    dialogVisible.value = true;
}

//图片上传成功后对于echoHelpPage这个vue对象做的操作
const edit_uploadSuccess = (result)=>{
    echoHelpPage.value.image = result.data;
    console.log(result.data);
}

//修改互助帖
const editHelpPageById = async () =>{
    let result = await editHelpPageByIdService(echoHelpPage.value);
    dialogVisible.value = false;
    ElMessage.success(result.code===1?'修改成功⭐':'修改出错⚠');
    //重新载入我的帖子
    echoMyPage();
}

import {deleteHelpPageByIdService} from '@/api/square.js'

//删除指定的互助帖
const deleteHelpPageById = async (id)=>{
    let result = await deleteHelpPageByIdService(id);
    ElMessage.success(result.code===1?'删除成功⭐':'删除出错❌');
    //重新载入我的帖子
    echoMyPage();
    //抽屉放回
    dialogVisible.value = false;
}

//删除帖子前的确认
const reConfirm = (param) => {
    ElMessageBox.confirm(
    '您是否要删除',
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then( async() => {
        deleteHelpPageById(param);
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })

}


</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>🏠我的帖子🏠</span>
                <div class="extra">
                    <el-button type="primary" @click="backsquare">返回广场</el-button>
                    <el-button type="primary" @click="">草稿箱</el-button>
                </div>
            </div>
        </template>

        <el-table :data="helpPages" stripe style="width: 100%">
            <el-table-column label="帖子标题" width="400" prop="title"></el-table-column>
            <el-table-column label="分类" width="100" prop="typeName"></el-table-column>
            <el-table-column label="楼主" width="150" prop="name"></el-table-column>
            <el-table-column label="正文" prop="content" show-overflow-tooltip></el-table-column>
            <el-table-column label="发表时间" width="200" prop="createTime"> </el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="echoHelpPageById(row.id)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="reConfirm(row.id)" ></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>



    </el-card>
    
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
                <el-input v-model="echoHelpPage.phone" placeholder="请输入电话"></el-input>
            </el-form-item>
            
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="editHelpPageById">确认修改</el-button>
                <el-button @click="dialogVisible = false">取消修改</el-button>
                <!-- <el-button type="danger" @click="deleteHelpPageById(echoHelpPage.id)">删除帖子</el-button> -->
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

.avatar-uploader {
    :deep() {
        .avatar {
            width: 500px;
            height: 350px;
            display: block;
            object-fit: cover;
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


</style>