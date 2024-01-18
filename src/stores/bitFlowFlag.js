import { defineStore } from "pinia";
import { ref } from "vue";

export const usebitFlowFlagStore = defineStore('bitFlowFlag',()=>{
    //定义状态相关的内容

    const bitFlowFlagInfo = ref('')

    const setInfo = (newInfo)=>{
        bitFlowFlagInfo.value = newInfo
    }

    const removeInfo = ()=>{
        bitFlowFlagInfo.value = ''
    }

    return {bitFlowFlagInfo,setInfo,removeInfo}
},{persist:true})
