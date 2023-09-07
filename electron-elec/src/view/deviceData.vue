<template>
    <div class="manager">
        <div class="deviceDataTopBox">
            <el-form :inline="true" :model="deviceDataForm" class="demo-form-inline" size="small">
                <el-form-item>
                    <el-select v-model="deviceDataForm.groupName" class="m-2" placeholder="设备组">
                        <el-option v-for="(index,item) in deviceTypeOptions" :key="index"
                                   :value="deviceTypeOptions[item]"/>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="deviceDataForm.address" placeholder="设备地址"/>
                    <div class="my-2 flex items-center text-sm">
                        <el-radio-group v-model="deviceDataForm.radio" class="ml-4">
                            <el-radio style="color: aliceblue;" label="1">十进制</el-radio>
                            <el-radio style="color: aliceblue;" label="2">十六进制</el-radio>
                        </el-radio-group>
                    </div>
                </el-form-item>
                <el-form-item>
                    <div class="block">
                        <div class="demo-date-picker">
                            <el-date-picker v-model="deviceDate" type="daterange"
                                            format="YYYY/MM/DD"
                                            value-format="x"
                                            start-placeholder="开始时间"
                                            end-placeholder="结束时间"
                                            :disabled-date="disabledDate"
                            >
                            </el-date-picker>
                        </div>
                    </div>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                    <el-button type="success" @click="exportBulk">批量导出</el-button>
                    <el-button type="danger" @click="deleteBulk">批量删除</el-button>
                </el-form-item>
            </el-form>

            <div class="demo-pagination-block">
                <el-pagination
                        v-model:current-page="deviceDataForm.currentPage"
                        v-model:page-size="deviceDataForm.perPage"
                        :page-sizes="[100, 200, 300, 400]"
                        :pager-count="15"
                        small:true
                        layout="sizes, prev, pager, next"
                        :total="1000"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                />
            </div>
        </div>

        <div class="mainBox">
            <div v-for="(item,index) in deviceDataList">
                <CardComponent class="mainCard">
                    <template #context-header>
                        <span>{{ item.groupName }}</span>
                        <span>{{ timestampToTime(item.timestamp) }}</span>
                    </template>

                    <template #context-body>
                        <el-row :gutter="20">
                            <el-col :span="6">
                                <div class="lump-red"></div>
                                <span class="text">设备地址: {{ item.address }}</span>
                            </el-col>
                            <span class="text">| </span>
                            <el-col :span="8">
                                <div class="lump-blue"></div>
                                <span class="text">  采集周期: {{ item.circle }}</span>
                            </el-col>
                            <el-col :span="2">
                                <el-button @click="exportDataResult(item)">导出</el-button>
                            </el-col>
                            <el-col :span="2">
                                <el-button @click="getAtlas(item.data)">图谱</el-button>
                            </el-col>
                            <el-col :span="2">
                                <el-button @click="openTextBox">查看</el-button>
                            </el-col>
                            <el-col :span="2">
                                <el-button @click="deleteData(item, index)">删除</el-button>
                            </el-col>
                        </el-row>
                    </template>
                </CardComponent>
            </div>

        </div>

    </div>
</template>


<script setup>
import {onMounted, reactive, ref} from 'vue'
import CardComponent from '@/components/cardComponent.vue';
import {ElMessage, ElMessageBox} from 'element-plus'
import {
    getDeviceOneData,
    getDeviceData,
    exportData,
    exportDataBulk,
    deleteDataById,
    deleteDataBulk
} from '@/api/deviceDataAPI.ts'
import {isDigit, isHex} from '@/utils/validate.ts';
import {useIpcRenderer} from "@vueuse/electron";
import {useFileSystemAccess} from '@vueuse/core'
import {getGroupNames} from "@/api/deviceManagerAPI.ts";

const ipcRenderer = useIpcRenderer();
const {isSupported, data, file, fileName, open, create} = useFileSystemAccess()

//日期时间
let deviceDate = ref([])

// 设备类型列表
const deviceTypeOptions = reactive([])
// 表单数据
const deviceDataForm = reactive({
    groupName: "",
    minTimestamp: -1,
    maxTimestamp: -1,
    address: "",
    timestamp: Date.now(),
    currentPage: 1,
    perPage: 20,
    radio: '1',
})

// 获取的数据
const deviceDataList = reactive([])
// 提交表单
const textData = ref('')

const res = useFileSystemAccess({
    dataType: 'Text',
    types: [{
        description: 'text',
        accept: {
            'text/plain': ['.txt', '.xls', '.xlsx', '.csv', '.doc', '.docx'],
        },
    }],
    excludeAcceptAllOption: true,
})


const path = ref('')



const historyResp = ref(false)
/**
 * 时间戳转换
 * @param chinaStandard
 * @returns {string}
 */
function timestampToTime(chinaStandard) {
    console.log(chinaStandard)
    var date = new Date(chinaStandard);
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
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
}

/**
 * 禁用日期
 * @param time
 * @returns {boolean}
 */
function disabledDate(time) {
    //只能选择今天及今天之前的日期
    return time.getTime() > Date.now() + 8.64e7;
}

/**
 * 提交检索表单
 * @returns {Promise<void>}
 */
async function onSubmit() {
    console.log("提交表单")
    if (deviceDataForm.radio === '1') {
        // 正则校验纯数字
        if (!isDigit(deviceDataForm.address)) {
            ElMessage.error('请输入十进制设备地址')
            return
        }
    } else {
        // 正则校验十六进制
        if (!isHex(deviceDataForm.address)) {
            ElMessage.error('请输入十六进制设备地址')
            return
        }
        // 十六进制转为十进制
        deviceDataForm.address = parseInt(deviceDataForm.address, 16)
    }
    try {
        //单条查询
        if (deviceDate.value.length === 0) {
            let res = await getDeviceOneData(deviceDataForm);
            if (res.data.code === 0) {
                ElMessage.error({message: res.data.msg})
                return
            }
            deviceDataList.length = 0
            deviceDataList.push(...res.data.data)
            textData.value = res.data

        } else if (deviceDate.value.length) {
            //  console.log("区间查询",deviceDataForm,deviceDataForm.value)
            //区间查询
            deviceDataForm.minTimestamp = deviceDate.value[0]
            deviceDataForm.maxTimestamp = deviceDate.value[1]
            let res = await getDeviceData(deviceDataForm);
            if (res.data.code === 0) {
                ElMessage.error({message: res.data.msg})
                return
            }
            console.log(res.data.data.historyData, "--------------")
            deviceDataList.length = 0
            deviceDataList.push(...res.data.data.historyData)
            textData.value = res.data
        }
    } catch (err) {
        // console.log(err)
        ElMessage.error(err)
    }
}

/**
 * 获取设备组
 * @returns {Promise<void>}
 */
async function getDeviceGroup() {
    try {
        let res = await getGroupNames()
        deviceTypeOptions.push(...res.data.data)
    } catch (err) {
        ElMessage.error(err)
    }
}


/**
 * 导出数据
 * @param item
 * @returns {Promise<void>}
 */
async function exportDataResult(item) {
    try {
        path.value = ipcRenderer.sendSync('open-fileDir-dialog').value;
        // console.log(path.value)
        let res = await exportData(item.groupName, item.timestamp, item.address, path.value)
        // console.log(res)
        if (res.data.code === 0) {
            ElMessage.error(res.data.msg)
            return
        }
        ElMessage.success('导出成功')
    } catch (err) {
        ElMessage.error(err)
    }
}

/**
 * 批量导出数据
 * @returns {Promise<void>}
 */
async function exportBulk() {
    try {
        path.value = ipcRenderer.sendSync('open-fileDir-dialog').value;
        let res = await exportDataBulk(deviceDataForm, path.value)
        if (res.data.code === 0) {
            ElMessage.error(res.data.msg)
            return
        }
        ElMessage.success('批量导出成功')
    } catch (err) {
        ElMessage.error(err)
    }
}


/**
 * 获取图谱
 * @type {Ref<UnwrapRef<boolean>>}
 */
async function getAtlas(data) {
    let historicalData = JSON.stringify(data)
    // 创建新窗口
    // console.log(data)

    historyResp.value = ipcRenderer.invoke('atlas-historymsg', historicalData)
    if (historyResp.value) {
        ipcRenderer.send('textBox', '/historyAdd')
        historyResp.value = false
    }


}


/**
 * 删除单条数据
 * @param item
 * @param index
 */
function deleteData(item, index) {
    ElMessageBox.confirm("确定删除吗?",
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(async () => {
        let res = await deleteDataById(item.groupName, item.address, item.timestamp)
        if (res.data.code === 0) {
            deviceDataList.splice(index, 1)
            ElMessage.success('删除成功')
        }
        ElMessage.error(res.data.msg)
    })

}

/**
 * 批量删除
 * @returns {Promise<void>}
 */
async function deleteBulk() {
    ElMessageBox.confirm("确定批量删除吗?",
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(async () => {
        try {
            let res = await deleteDataBulk(deviceDate.value, deviceDataForm.groupName, deviceDataForm.address)
            if (res.data.code === 0) {
                ElMessage.error(res.data.msg)
                return
            }
            deviceDataList.length = 0
            ElMessage.success('批量删除成功')
        } catch (err) {
            ElMessage.error(err)
        }
    }).catch(() => {
        ElMessage.info("已取消删除")
    })
}

onMounted(() => {
    getDeviceGroup() // 获取设备类型列表
})


const handleSizeChange = (val) => {
    // console.log(val, "size")
    deviceDataForm.perPage = val
    deviceDataForm.minTimestamp = deviceDate.value[0]
    deviceDataForm.maxTimestamp = deviceDate.value[1]
    getDeviceData(deviceDataForm).then((res) => {
        console.log(res.data.data.historyData)
        deviceDataList.length = 0
        deviceDataList.push(...res.data.data.historyData)
    })

}
const handleCurrentChange = (val) => {
    // console.log(val, "current")
    deviceDataForm.currentPage = val
    deviceDataForm.minTimestamp = deviceDate.value[0]
    deviceDataForm.maxTimestamp = deviceDate.value[1]
    getDeviceData(deviceDataForm).then((res) => {
        console.log(res.data.data.historyData)
        deviceDataList.length = 0
        deviceDataList.push(...res.data.data.historyData)
    })
}

/**
 * 查看响应数据
 */
async function openTextBox() {
    // await res.open()
    console.log(textData.value, "textData.value")
    // 向发送数据
    ipcRenderer.send('product-msg', JSON.stringify(textData.value))
    // 创建新窗口
    ipcRenderer.send('textBox', '/browse')


}
</script>


<style lang="less">
@import "@/assets/css/index.css";

.manager {
  /* background-color: saddlebrown; */
  width: 90%;
  height: 100%;
  overflow: hidden;
}

.deviceDataTopBox {
  /* background-color: skyblue; */
  /* position: relative; */
  height: 100px;
  width: 100%;

  .demo-pagination-block {
    //  background-color: skyblue;

    .el-pagination {
      .el-pagination__sizes {
        // width: 200px;
        margin-right: 20px;
      }

      .btn-prev {
        background-color: rgba(220, 38, 38, 0);
        color: white;
      }

      .btn-next {
        background-color: rgba(220, 38, 38, 0);
        color: white;
      }

      .el-pager {
        li {
          background-color: rgba(220, 38, 38, 0);
          //    opacity: 0;

          color: white;
        }

      }
    }
  }
}

.mainBox {
  /* background: rgba(0, 0, 0, 0.5); */

  color: #333;
  text-align: center;
  margin-top: 40px;
  height: 700px;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.mainBox::-webkit-scrollbar {
  display: none;
}

.mainCard {
  margin-bottom: 20px;

  .el-row {
    margin-top: 15px;
  }

  .box-card {
    width: 860px;
  }

}

.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-date-picker {
  display: flex;
  width: 100%;
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


.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}


.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}


.lump-red {
  width: 20px;
  height: 20px;
  display: inline-block;
  background-color: #FF0000FF;
  border-radius: 5px;
}

.lump-blue {
  width: 20px;
  height: 20px;
  display: inline-block;
  background-color: #0000FFFF;
  border-radius: 5px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>