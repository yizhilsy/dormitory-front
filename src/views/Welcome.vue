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

</script>

<template>
welcome






</template>

<style lang="scss" scoped>


</style>