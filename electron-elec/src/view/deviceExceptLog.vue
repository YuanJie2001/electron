<template>
    <div>
        <div  class="deviceLogContain">
            <div class="demo-pagination-block">
                
                <el-pagination
                        v-model:current-page="currentPage"
                        v-model:page-size="pageSize"
                        :page-sizes="[20,100, 200, 300, 400]"
                        :pager-count="15"
                        small:true
                        layout="sizes, prev, pager, next"
                        :total="1000"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                />
            </div>
            <el-table :data="tableData.arr" stripe style="width: 100%;">
                <el-table-column prop="timestamp" label="时间" :formatter="timestampToTime" width="200"/>
                <el-table-column prop="address" label="地址" width="100"/>
                <el-table-column prop="port" label="端口" width="80"/>
                <el-table-column prop="circle" label="周期" width="80"/>
                <el-table-column prop="averageDischarge" label="平均放电强度" width="140"/>
                <el-table-column prop="maxnDischarge" label="最大放电强度" width="140"/>
                <el-table-column prop="numOfDischarge" label="放电次数" width="80"/>
                <el-table-column prop="mapType" label="类型" width="80"/>
                <el-table-column prop="groupName" label="设备组名称"/>
            </el-table>
        </div>

    </div>
</template>


<script setup lang="ts">
import {onMounted, reactive, ref,watch} from 'vue'
import { getCurrentPageData } from "@/api/deviceLogAPI.ts";
import  {useCardArrayStore}  from "@/store/cardStore.ts"
import { storeToRefs } from "pinia";

const store = useCardArrayStore()
let tableData = reactive({
    arr: []
})
const currentPage = ref(1)
const pageSize = ref(100)

setInterval(() => {
    getTableData()
},1000)

/**
 * 时间戳转换为时间
 * @param chinaStandard
 */
function timestampToTime(chinaStandard) {
    // console.log(chinaStandard.timestamp)
            var date = new Date(chinaStandard.timestamp);
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var h = date.getHours();
            var minute = date.getMinutes();
            minute = minute < 10 ? ('0' + minute) : minute;
            var second = date.getSeconds();
            second = second < 10 ? ('0' + second) : second;
            return y + '-' + m + '-' + d+' '+h+':'+minute+ ':' + second;
}

async function getTableData() {
    tableData.arr = store.exceptMessage.slice(
        (currentPage.value - 1) * pageSize.value,
        currentPage.value * pageSize.value
    );
}

const handleSizeChange = (val: number) => {
    console.log("改变每页多少条，当前一页多少条数据", val);
    pageSize.value = val
    currentPage.value = 1
    getTableData()
    // getTableData(currentPage.value, pageSize.value)
}

const handleCurrentChange = (val: number) => {
    console.log("翻页，当前为第几页", val);
    currentPage.value = val
    getTableData()
    // getTableData(currentPage.value, pageSize.value)
}

onMounted(() => {
    getTableData()
})
</script>
<style lang="less" >
@import "@/assets/css/index.css";

.deviceLogContain{
    // background-color: saddlebrown;
    .demo-pagination-block{
        //  background-color: skyblue; 
         .el-pagination{
            // background-color: black;
            .el-pager{
                li{
                    background-color:rgba(220,38,38,0);
                    color: white;
                }
                
            }
            .el-pagination__sizes{
                 // width: 200px;
                 margin-right: 20px;
            }
            .btn-prev{
                background-color:rgba(220,38,38,0);
                color: white;
            }
            .btn-next{
                background-color:rgba(220,38,38,0);
                color: white;
            }
            
 
         }
    }
    .el-table{
        margin-top: 40px;
        height: 700px;
         overflow-y: scroll;
    }
    .el-table::-webkit-scrollbar{
        display: none;
    }
}
.demo-pagination-block + .demo-pagination-block {
    margin-top: 10px;
}

.demo-pagination-block .demonstration {
    margin-bottom: 16px;
}


</style>