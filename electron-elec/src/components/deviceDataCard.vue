<template>
    <div class="deviceDataBox">
        <div class="top">
            <div @click="test0">最大</div>
            <div @click="test1">平均</div>
            <div @click="test2">次数</div>
        </div>
        <div id="top" ref="top" @click="openAtlas"></div>
        <div id="bottom">
            <el-row :gutter="20">

                <el-col ref="address" style="background-color: #d4e9f4" :span="10"
                >
                    设备地址:
                    <el-tooltip placement="top" :content="item.address">{{ item.address }}</el-tooltip>
                </el-col
                >
                <el-col style="background-color: #d4f0f4" :span="10"
                >
                    <el-tooltip placement="top" :content="item.maxnDischarge">最大放电强度:
                        {{ item.maxnDischarge }}
                    </el-tooltip>
                </el-col
                >
            </el-row>
            <el-row :gutter="20">
                <el-col style="background-color: #daf3f3" :span="10">
                    <el-tooltip placement="top" :content="item.port">设备端口:{{ item.port }}</el-tooltip>
                </el-col>
                <el-col style="background-color: #d4f4ec" :span="10">
                    <el-tooltip placement="top" :content="item.averageDischarge">平均放电强度:
                        {{ item.averageDischarge }}
                    </el-tooltip>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col style="background-color: #d8f6eb" :span="10">
                    <el-tooltip placement="top" :content="item.mapType">警告类型:{{ item.mapType }}</el-tooltip>
                </el-col>
                <el-col style="background-color: #d4e8f4" :span="10">
                    <el-tooltip placement="top" :content="item.numOfDischarge">放电次数:
                        {{ item.numOfDischarge }}
                    </el-tooltip>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col style="background-color: #d4f4ec" :span="10">
                    <el-tooltip placement="top" :content="timestampToTime(item.timestamp)">
                        时间:{{ timestampToTime(item.timestamp) }}
                    </el-tooltip>
                </el-col>
                <el-col style="background-color: #d4f0f4" :span="10">
                    <el-tooltip placement="top" :content="item.threshold">阈值:{{ item.threshold }}</el-tooltip>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col style="background-color: #daf3f3;padding-left: 20px;" :span="20">
                    <el-tooltip placement="top" :content="item.groupName">设备组名称:{{ item.groupName }}</el-tooltip>
                </el-col>
            </el-row>
        </div>
    </div>
</template>


<script setup>
import * as echarts from "echarts";
import {defineProps, onMounted, reactive, ref, toRefs, watch} from "vue";
import {useIpcRenderer} from "@vueuse/electron";
import {dischargeData, startSingleDeviceAPI, stopSingleDeviceAPI} from '@/api/deviceManagerAPI'

const ipcRenderer = useIpcRenderer();
const top = ref();
const props = defineProps({
    item: Object,
    itemMapData: Object,
})

const {item, itemMapData} = toRefs(props)
let myChartMaximum = null
let myChart4 = null
let myChart5 = null
let newData = reactive(itemMapData)

// 存放全部数据的变量
var coords = [];

// 存放要更新到图像的变量(周期为单位)，这个是用来方便取周期的，
var map2DData = [];

// 存放实际上要更新到图像的变量，这个就是你需要监控的变量，它需要是不是的去更新到你图像实际的变量里面去
var realMap2DData = [];

// 控制最多绘制多少的极限值
var circleMaxn2D = 150;

var map2DIndex = 0; // 用来控制取到哪个数据

let atlasInterval = null
let atlas = ''
let deviceMsg = reactive({
    groupName: '',
    address: ''
})
const deviceMsgData = {
    groupName: item.value.groupName,
    address:item.value.address
}

let averageDischarge7 = reactive()
let averageDischarge7Key = reactive()
let averageDischarge7Value = reactive()
let averageDischarge7ValueMax = reactive()
let averageDischarge7ValueMaxinterval = reactive()
let maxnDischarge7 = reactive()
let maxnDischarge7Key = reactive()
let maxnDischarge7Value = reactive()
let maxnDischarge7ValueMax = reactive()
let maxnDischarge7ValueMaxinterval = reactive()
let numOfDischarge7 = reactive()
let numOfDischarge7Key = reactive()
let numOfDischarge7Value = reactive()
let numOfDischarge7ValueMax = reactive()
let numOfDischarge7ValueMaxinterval = reactive()
// 监听父组件传递子组件数据变化
watch(itemMapData, (newVal, oldValue) => {
    coords = itemMapData
    // console.log(newData.value.coords)
});
/**
 * 获取小图数据
 */
watch(deviceMsg, (oldVal, newVal) => {
    console.log(deviceMsg,"执行一次")
    getAtlasData(deviceMsg)
}, {
    deep: true,
    immediate:true
})
ipcRenderer.on("stopSingleDevice", ((event, arg) => {
    stopSingleDeviceAPI().then((res) => {
        console.log(res.data)
    })
}))


// console.log(item.value, "949494")
/**
 * 日期格式化
 * @param chinaStandard
 * @returns {string}
 */
function timestampToTime(chinaStandard) {
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
 * 打开图谱
 * @returns {Promise<void>}
 */
async function openAtlas() {

    startSingleDeviceAPI({
        "groupName": item.value.groupName,
        "address": item.value.address
    }).then(res => {
        atlasInterval =  setInterval(() => {
            atlas = JSON.stringify(item.value)
            ipcRenderer.send('device-msg', JSON.stringify(deviceMsg))
            ipcRenderer.send('atlas-msg', atlas)
        }, 100)
        console.log(res.data)
        ipcRenderer.send('textBox', '/add')
    })
    //ipcRenderer.send('textBox', '/add')
    ipcRenderer.on('stopSingleDevice', (event, arg) => {
        atlasInterval && clearInterval(atlasInterval)
    })
}

/**
 * 获取图谱数据,1小时更新一次
 */
setInterval(() => {
    getAtlasData(deviceMsg)
    console.log("定时器执行")
},86400000)

/**
 * 获取图谱数据
 * @param deviceMsg
 */
function getAtlasData(deviceMsg) {
    dischargeData(deviceMsg.groupName, deviceMsg.address).then((res) => {
        console.log(res.data.data)
        test0()
        averageDischarge7 = res.data.data.averageDischarge7
        averageDischarge7Key = Object.keys(averageDischarge7).slice(0, 7)
        averageDischarge7Value = Object.values(averageDischarge7).slice(0, 7)
        averageDischarge7ValueMax = (Math.ceil(Math.max(...averageDischarge7Value) * 100) / 100) * 1.2
        averageDischarge7ValueMaxinterval = averageDischarge7ValueMax / 5

        maxnDischarge7 = res.data.data.maxnDischarge7
        maxnDischarge7Key = Object.keys(maxnDischarge7).slice(0, 7)
        maxnDischarge7Value = Object.values(maxnDischarge7).slice(0, 7)
        maxnDischarge7ValueMax = Math.ceil((Math.max(...maxnDischarge7Value) * 10) / 10) * 1.2
        maxnDischarge7ValueMaxinterval = maxnDischarge7ValueMax / 5

        numOfDischarge7 = res.data.data.numOfDischarge7
        numOfDischarge7Key = Object.keys(numOfDischarge7).slice(0, 7)
        numOfDischarge7Value = Object.values(numOfDischarge7).slice(0, 7)
        numOfDischarge7ValueMax = Math.ceil((Math.max(...numOfDischarge7Value) / 10) * 10) * 1.2
        numOfDischarge7ValueMaxinterval = numOfDischarge7ValueMax / 5
    })
}

/**
 * 格式化日期
 * @param data
 * @returns {*}
 */
function formatDate(data) {
    if (data === undefined) return
    return data.map((item, index) => {
        const timestamp = parseInt(item) // 将字符串类型的时间戳转为数值类型
        const date = new Date(timestamp)
        const month = date.getMonth() + 1
        const day = date.getDate()
        return month + '/' + day
    })
}

//最大放电强度图参数
const option3 = {
    grid: {
        left:40
    },
    xAxis: {
        type: 'category',
        data: maxnDischarge7Key,
        boundaryGap: false,
        axisLabel: {
            formatter: function (value) {
                // 将时间戳转为日期
                const timestamp = parseInt(value) // 将字符串类型的时间戳转为数值类型
                const date = new Date(timestamp)
                const month = date.getMonth() + 1
                const day = date.getDate()
                return month + '-' + day
            }
        }
    },
    yAxis: {
        type: 'value',
        min: 0,
        max: 3,
        interval: 0.5,
        axisLabel: {
            formatter: function (value) {
                return value.toFixed(2); // 将 y 轴刻度显示为小数点后两位
            }
        }
    },
    series: [{
        type: 'line',
        data: maxnDischarge7Value,
        // animation:false,
        label: {
            show: true,
            position: 'top',
            formatter: (params) => {
                return params.value.toFixed(4)
            }
        }
    }]
};
//平均放电强度图参数
const option4 = {
    grid: {
        left:40
    },
    xAxis: {
        type: 'category',
        data: averageDischarge7Key,
        boundaryGap: false,
        axisLabel: {
            formatter: function (value) {
                const timestamp = parseInt(value) // 将字符串类型的时间戳转为数值类型
                const date = new Date(timestamp)
                const month = date.getMonth() + 1
                const day = date.getDate()
                return month + '-' + day
            }
        }
    },
    yAxis: {
        type: 'value',
        min: 0,
        max: 0.5,
        interval: 0.13,
        axisLabel: {
            formatter: function (value) {
                return value.toFixed(3); // 将 y 轴刻度显示为小数点后位
            }
        }
    },
    series: [{
        type: 'line',
        data: averageDischarge7Value,
        label: {
            show: true,
            position: 'top',
            formatter: (params) => {
                return params.value.toFixed(4)
            }
        }
    }]
};
//放电次数图参数
const option5 = {
    grid: {
        left:40
    },
    xAxis: {
        type: 'category',
        data: numOfDischarge7Key,
        boundaryGap: false,
        axisLabel: {
            formatter: function (value) {
                const timestamp = parseInt(value) // 将字符串类型的时间戳转为数值类型
                const date = new Date(timestamp)
                const month = date.getMonth() + 1
                const day = date.getDate()
                return month + '-' + day
            }
        }
    },
    yAxis: {
        type: 'value',
        min: 0,
        max: 200,
        interval: 20,
        axisLabel: {
            formatter: function (value) {
                return value.toFixed(0); // 将 y 轴刻度显示为小数点后位
            }
        }
    },
    series: [{
        type: 'line',
        data: numOfDischarge7Value,
        label: {
            show: true,
            position: 'top',
            formatter: (params) => {
                return params.value.toFixed(0)
            }
        }
    }]
};

function test0() {
    console.log("test0")
    // 绘制图表
    myChartMaximum.setOption(option3);
    myChartMaximum.setOption({
        xAxis: {
            data: maxnDischarge7Key,
            axisLabel: {
                formatter: function (value) {
                    const timestamp = parseInt(value) // 将字符串类型的时间戳转为数值类型
                    const date = new Date(timestamp)
                    const month = date.getMonth() + 1
                    const day = date.getDate()
                    return  month + '-' + day
                }
            }
        },
        yAxis: {
            max: maxnDischarge7ValueMax,
            interval: maxnDischarge7ValueMaxinterval,
        },
        series: [
            {
                data: maxnDischarge7Value
            }
        ]
    });
}

function test1() {
    // console.log("1",averageDischarge7Key)\
    myChartMaximum.setOption(option4);
    myChartMaximum.setOption({
        xAxis: {
            data: averageDischarge7Key,
            axisLabel: {
                formatter: function (value) {
                    const timestamp = parseInt(value) // 将字符串类型的时间戳转为数值类型
                    const date = new Date(timestamp)
                    const month = date.getMonth() + 1
                    const day = date.getDate()
                    return  month + '-' + day
                }
            }
        },
        yAxis: {
            max: averageDischarge7ValueMax,
            interval: averageDischarge7ValueMaxinterval,
        },
        series: [
            {
                data: averageDischarge7Value
            }
        ]
    });
}

function test2() {
    // console.log(numOfDischarge7Value)\
    myChartMaximum.setOption(option5);
    myChartMaximum.setOption({
        xAxis: {
            data: numOfDischarge7Key,
            axisLabel: {
                formatter: function (value) {
                    const timestamp = parseInt(value) // 将字符串类型的时间戳转为数值类型
                    const date = new Date(timestamp)
                    const month = date.getMonth() + 1
                    const day = date.getDate()
                    return   month + '-' + day
                }
            }
        },
        yAxis: {
            max: numOfDischarge7ValueMax,
            interval: numOfDischarge7ValueMaxinterval,
        },
        series: [
            {
                data: numOfDischarge7Value
            }
        ]
    });
}


onMounted(() => {
    // 绘制图表
        // 基于准备好的dom，初始化echarts实例
        myChartMaximum = echarts.init(top.value);
    myChartMaximum.setOption(option3);
    deviceMsg.groupName = item.value.groupName
    deviceMsg.address = item.value.address

});
</script>


<style scoped lang="less">
@import "@/assets/css/index.css";

.deviceDataBox {
  width: 300px;
  height: 400px;
  background-color: #ebeef2;
  border-radius: 5px;
  box-shadow: 2px 2px 2px #1f1f1f;
  margin-bottom: 10px;

  #top {
    height: 230px;
    // background-color: skyblue;
    padding: 10px;
    padding-top: 0;
  }

  #bottom {
    margin-top: -20px;
    margin-left: 30px;
  }
}

.el-row {
  margin-bottom: 10px;

  .el-col {
    font-size: small;
    border-radius: 0;
    margin-right: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.deviceDataBox{
    .top {
        height: 30px;
        display: flex;
        justify-content: left;
        background-color: #f0f0f0;

        div {
            padding: 3px 5px;
            margin-left: 5px;
            background-color: #dedede;
            user-select: none;
            cursor: pointer;
        }
    }
}
</style>