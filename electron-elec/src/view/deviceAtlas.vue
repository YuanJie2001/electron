<template>
    <div class="atlasBox">
        <div class="atlasTop">
            <div class="div1" ref="echarts1"></div>
            <div ref="echarts2"></div>
        </div>


        <div class="bottom">
            <div class="top">
                <div @click="test0">最大放电强度</div>
                <div @click="test1">平均放电强度</div>
                <div @click="test2">放电次数</div>
            </div>
            <div class="bot">
                <div ref="test"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref, onMounted, reactive, watch} from "vue";
import * as echarts from "echarts";
import "echarts-gl";
import {throttle} from 'lodash'
import {useIpcRenderer} from "@vueuse/electron";
import {dischargeData} from '@/api/deviceManagerAPI'

const ipcRenderer = useIpcRenderer();

//msg
let deviceMsg = ref('')

//2d
let atlasData = ref('')
let new2Data = reactive()
let new2DataMaxY = reactive()
//3D
let new3Data = reactive()
let new3DataMaxZ = reactive()

// 存放全部数据的变量
var coords = [];

// 存放要更新到图像的变量(周期为单位)，这个是用来方便取周期的，
var map2DData = [];
var map3DData = [];

// 存放实际上要更新到图像的变量，这个就是你需要监控的变量，它需要是不是的去更新到你图像实际的变量里面去
var realMap2DData = [];
var realMap3DData = [];

// 控制最多绘制多少的极限值
var circleMaxn2D = 150;
var circleMaxn3D = 50;

var map2DIndex = 0; // 用来控制取到哪个数据
var map3DIndex = 0;

var myChart1 = null
var myChart2 = null
var myChartMaximum = null
var myChartAverage = null
var myChartDischarge = null
const echarts1 = ref(null);
const echarts2 = ref(null);
const test = ref(null)

let comName = ref(0);

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
// console.log(JSON.parse(deviceMsg.value))
watch(deviceMsg, (oldVal, newVal) => {
    console.log(deviceMsg,"执行一次")
    dischargeData(JSON.parse(deviceMsg.value).groupName, JSON.parse(deviceMsg.value).address).then((res) => {
         console.log(res.data.data)
        averageDischarge7 = res.data.data.averageDischarge7
        averageDischarge7Key = Object.keys(averageDischarge7).slice(0, 7)
        averageDischarge7Value = Object.values(averageDischarge7).slice(0, 7)
        averageDischarge7ValueMax = (Math.ceil(Math.max(...averageDischarge7Value) * 100) / 100) * 1.2
        averageDischarge7ValueMaxinterval = averageDischarge7ValueMax / 5

        maxnDischarge7 = res.data.data.maxnDischarge7
        maxnDischarge7Key = Object.keys(maxnDischarge7).slice(0, 7)
        maxnDischarge7Value = Object.values(maxnDischarge7).slice(0, 7)
        maxnDischarge7ValueMax = (Math.ceil((Math.max(...maxnDischarge7Value) * 10) / 10) * 1.2).toFixed(2)
        // console.log(maxnDischarge7ValueMax)
        maxnDischarge7ValueMaxinterval = maxnDischarge7ValueMax / 5

        numOfDischarge7 = res.data.data.numOfDischarge7
        numOfDischarge7Key = Object.keys(numOfDischarge7).slice(0, 7)
        numOfDischarge7Value = Object.values(numOfDischarge7).slice(0, 7)
        numOfDischarge7ValueMax = Math.ceil((Math.max(...numOfDischarge7Value) / 10) * 10) * 1.2
        numOfDischarge7ValueMaxinterval = numOfDischarge7ValueMax / 5
    })
})

/**
 * 格式化时间戳
 * @param data
 * @returns {*}
 */
function formatDate(data){
    if (data === undefined) return
    return data.map(item => {
        const timestamp = parseInt(item) // 将字符串类型的时间戳转为数值类型
        const date = new Date(timestamp)
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        return year + '-' + month + '-' + day
    })
}

/**
 * 最大放电强度图
 */
function test0() {
    console.log("0")
    echarts.dispose(test.value)
    myChartMaximum = echarts.init(test.value);
    // console.log("0",maxnDischarge7Key)
    //最大放电强度图参数
    const option3 = {

        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: formatDate(maxnDischarge7Key),
            axisLabel: {
                formatter: function (value) {
                    return value
                }
            }
        },
        yAxis: {
            max: maxnDischarge7ValueMax,
            interval: maxnDischarge7ValueMaxinterval,
        },
        tooltip: {
            trigger: 'axis'
        },
        series: [
            {
                type: 'line',
                name: "最大放电强度",
                showSymbol: false,
                data: maxnDischarge7Value
            }
        ]
    };
    myChartMaximum.setOption(option3);
}

/**
 * 平均放电强度图参数
 */
function test1() {
    echarts.dispose(test.value)
    myChartMaximum = echarts.init(test.value);
    // 平均放电强度图参数
    const option4={
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: formatDate(maxnDischarge7Key),
            axisLabel: {
                formatter: function (value) {
                    return value
                }
            }
        },
        yAxis: {
            max: averageDischarge7ValueMax,
            interval: averageDischarge7ValueMaxinterval,
        },
        series: [
            {
                type: 'line',
                name: "平均放电强度",
                showSymbol: false,
                data: averageDischarge7Value
            }
        ]
    }
    myChartMaximum.setOption(option4);
}

/**
 * 放电次数图参数
 */
function test2() {
    echarts.dispose(test.value)
    myChartMaximum = echarts.init(test.value);
    //放电次数图参数
    const option5 = {
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: formatDate(maxnDischarge7Key),
            axisLabel: {
                formatter: function (value) {
                    return value
                }
            }
        },
        yAxis: {
            max: numOfDischarge7ValueMax,
            interval: numOfDischarge7ValueMaxinterval,
        },
        series: [
            {
                type: 'line',
                name: "次数",
                showSymbol: false,
                data: numOfDischarge7Value
            }
        ]
    }
    myChartMaximum.setOption(option5);
}


watch(atlasData,(newVal, oldVal)=> {
    // console.log("atlas变化", JSON.parse(atlasData.value)) 
    processData(atlasData.value)
})

ipcRenderer.on('atlas-customer-msg', ((event, arg) => {
    atlasData.value = arg;   
    console.log(arg,"arg")
}))
    
//设备组名和设备地址信道
ipcRenderer.on('device-customer-msg', ((event, arg) => {
    //   console.log(arg,"arg")
      deviceMsg.value = arg;   
      
    }))
/**
 * 2d图参数
 * @type {{yAxis: {min: number, max: number, type: string}, xAxis: {axisLabel: {formatter: ((function(*): (string|string))|*)}, min: number, max: number, interval: number, type: string}, series: [{data: string, symbolSize: number, name: string, itemStyle: {color: string}, type: string, markLine: {data: [{yAxis: string, type: string}], animation: boolean}, animation: boolean}], title: {text: string}, visualMap: {max: number, inRange: {color: string[]}}}}
 */
const option1 = {
    title: {
        text: 'PRPD图谱'
    },
    visualMap: {
        max: 2.5,
        inRange: {
            color: [
                '#00ff2a',
                '#17e826',
                '#2ed122',
                '#46b91f',
                '#5da21b',
                '#748b17',
                '#8b7413',
                '#a25d0f',
                '#b9460b',
                "#d12e08",
                '#e81704',

            ]
        }
    },
    xAxis: {
        type: 'value',
        min: 0,
        max: 360,
        interval: 30,// 每30度一个刻度
        axisLabel: {
            formatter: function (value) {
                // 格式化 x 轴刻度显示
                // 每90度显示一个刻度
                if (value % 90 === 0) {
                    return value + '°';
                } else {
                    return '';
                }
            }
        },
    },
    yAxis: {
        type: 'value',
        min: 0,
        max: 2.5
    },
    series: [

        {
            name: '随机散点',
            type: 'scatter',
            animation: false,
            symbolSize: 6,
            itemStyle: {
                color: 'green'
            },
            data: '',
            markLine: {
                animation: false,
                data: [{
                    type: "average",
                    yAxis: ''
                }
                ],
            },
        },
    ]
};
/**
 * 3D图参数
 * @type {{yAxis3D: {axisLabel: {}, min: number, max: number, axisLine: {lineStyle: {}}, splitLine: {show: boolean}, interval: number, type: string}, zAxis3D: {axisLabel: {formatter: (function(*): string), show: boolean, textStyle: {color: string}}, min: number, max: number, axisLine: {lineStyle: {color: string}}, type: string}, series: [{shading: string, barSize: number, data: string, symbolSize: number[], emphasis: {label: {formatter: (function(*): string), show: boolean, textStyle: {borderWidth: number, fontSize: number}}}, itemStyle: {opacity: number}, label: {show: boolean}, type: string, animation: boolean}], tooltip: {}, xAxis3D: {axisLabel: {formatter: (function(*): string), show: boolean, interval: number, textStyle: {color: string}}, min: number, max: number, axisLine: {lineStyle: {color: string}}, splitLine: {show: boolean}, interval: number, type: string}, title: {text: string}, grid3D: {boxDepth: number, light: {main: {intensity: number, shadow: boolean}, ambient: {intensity: number}}, boxWidth: number, viewControl: {distance: number, alpha: number, beta: number}}, visualMap: {max: number, inRange: {color: string[]}}}}
 */
const option2 = {
    tooltip: {},
    title: {
        text: 'PRPS图谱'
    },
    visualMap: {
        max: 2.5,
        inRange: {
            color: [
                '#00ff2a',
                '#17e826',
                '#2ed122',
                '#46b91f',
                '#5da21b',
                '#748b17',
                '#8b7413',
                '#a25d0f',
                '#b9460b',
                "#d12e08",
                '#e81704',
            ]
        }
    },
    yAxis3D: {
        type: 'value',
        min: 0,
        max: 50,
        interval: 25, // 设置 x 轴刻度的间隔为 25
        axisLine: {
            lineStyle: {
                // color: '#000'
            }
        },
        axisLabel: {},
        splitLine: {
            show: false
        },
    },
    xAxis3D: {
        type: 'value',
        min: 0,
        max: 360,
        interval: 90,
        axisLine: {
            lineStyle: {
                color: '#000',
            }
        },
        splitLine: {
            show: false
        },
        axisLabel: {
            show: true,
            interval: 90,
            textStyle: {
                color: '#000'
            },
            formatter: function (value) {
                return value + '°'; // 给刻度加上单位 "°"
            }
        }
    },
    zAxis3D: {
        type: 'value',
        min: 0.00,
        max: 2.5,
        axisLine: {
            lineStyle: {
                color: '#000000'
            }
        },
        axisLabel: {
            show: true,
            textStyle: {
                color: '#000'
            },
            formatter: function (value) {
                return value.toFixed(2); // 将 z 轴刻度显示为小数点后两位
            }
        }
    },
    grid3D: {
        boxWidth: 180, // 盒子大小使得 xy 平面变成正方形
        boxDepth: 180,
        viewControl: {
            distance: 380,// 设置视角距离为 200
            alpha: 35, //俯视角度
            beta: 320,
        },
        light: {
            main: {
                intensity: 1.2,
                shadow: false
            },
            ambient: {
                intensity: 0.3
            }
        }
    },
    series: [
        {
            barSize: 5,
            animation: false,
            type: 'bar3D', // 设置图表类型为 bar3D
            data: '',
            shading: 'lambert', // 设置柱状图的颜色渲染方式
            symbolSize: [200, 10],
            label: {
                show: false // 不显示柱状图上的标签
            },
            itemStyle: {
                // 设置柱状图的透明度
                opacity: 1, // 1 表示完全不透明，0 表示完全透明
            },
            emphasis: {
                label: {
                    show: true, // 高亮状态下显示标签
                    textStyle: {
                        fontSize: 16,
                        borderWidth: 1
                    },
                    formatter: function (params) {
                        return 'Value: ' + params.data[2]; // 设置标签显示的内容
                    }
                }
            }
        }
    ]
};

/**
 * 更新2D图数据
 */
function update2DMapData() {
    if (coords.length <= 0) {
        return;
    }
    let tmpCurrentMaxn = 0
    let idxCircle = 1;
    if(coords.length > 8)
    {
        idxCircle = 8;
    }
    for(let idx = 0; idx < idxCircle; idx++){
        map2DIndex = (map2DIndex + 1) % coords.length;
        if (map2DData.length >= circleMaxn2D) {
            map2DData.shift();
        }
        map2DData.push(coords[map2DIndex]);
    }
    let tmpReal2DMapData = [];
    for (let i = 0; i < map2DData.length; i++) {
        let tmp2DData = map2DData[i];
        for (let j = 0; j < tmp2DData.length; j++) {
            if (tmp2DData[j][1] > tmpCurrentMaxn) {
                tmpCurrentMaxn = tmp2DData[j][1];
            }
            tmpReal2DMapData.push(tmp2DData[j]);
        }
    }
    new2Data = tmpReal2DMapData;
    new2DataMaxY = tmpCurrentMaxn;
    // console.log(realMap2DData,"realdata")
}

/**
 * 更新3d数据的函数，和2D一样的方法启动,也是需要用一个20ms的定时器去启动
 */
function update3DMapData() {
    if (coords.length <= 0) {
        return;
    }
    let tmpCurrentMaxn = 0
    let idxCircle = 1;
    if(coords.length > 8)
    {
        idxCircle = 8;
    }
    for(let idx = 0; idx < idxCircle; idx++){
        map3DIndex = (map3DIndex + 1) % coords.length;
        if (map3DData.length >= circleMaxn3D) {
            map3DData.shift();
        }
        map3DData.push(coords[map3DIndex]);
    }
    // console.log(map3DData)
    let tmpReal3DMapData = [];
    for (let i = map3DData.length - 1, index = 0; i >= 0; i--, index++) {
        let tmp3DData = map3DData[i];
        for (let j = 0; j < tmp3DData.length; j++) {
            if (tmp3DData[j][1] > tmpCurrentMaxn) {
                tmpCurrentMaxn = tmp3DData[j][1];
            }
            tmpReal3DMapData.push([tmp3DData[j][0], index, tmp3DData[j][1]]);
        }
    }
    new3Data = tmpReal3DMapData;
    new3DataMaxZ = tmpCurrentMaxn;
    // console.log(realMap3DData,"realdata3D")
}

/**
 * 处理数据
 * @param {*} data
 */
function processData(data) {
    map2DIndex = 0
    map3DIndex = 0
    new2DataMaxY = 2.5
    new3DataMaxZ = 2.5
    coords = JSON.parse(data).mapData
};

/**
 * 定时更新数据
 */
setInterval(() => {
    update3DMapData()
    update2DMapData()
}, 80)

/**
 * 定时更新图表
 */
setInterval(() => {
    myChart1.setOption({
        visualMap: {
            max: (new2DataMaxY > 2.5 ? 5 : 2.5),
        },
        yAxis: {
            max: (new2DataMaxY > 2.5 ? 5 : 2.5)
        },
        series: [
            {
                data: new2Data,
                markLine: {
                    data: [{
                        yAxis: new2DataMaxY
                    }
                    ],
                },
            },

        ]
    });
    myChart2.setOption({
        visualMap: {
            max: (new3DataMaxZ > 2.5 ? 5 : 2.5),
        },
        zAxis3D: {
            max: (new3DataMaxZ > 2.5 ? 5.00 : 2.5),
        },
        series: [
            {
                data: new3Data
            }
        ]
    });

}, 100)

/**
 * 初始化图表
 */
onMounted(() => {
    // 基于准备好的dom，初始化echarts实例
    myChart1 = echarts.init(echarts1.value);
    // 绘制图表
    myChart1.setOption(option1);

    // 基于准备好的dom，初始化echarts实例 3D
    myChart2 = echarts.init(echarts2.value);
    // 绘制图表
    myChart2.setOption(option2);



});
</script>

<style scoped lang="less">
.atlasBox {
  height: 800px;
  width: 1100px;

  // background-color: rebeccapurple;

  .atlasTop {
    width: 1100px;
    height: 600px;
    // background-color: red;
    display: flex;
    justify-content: space-between;

    div {
      width: 540px;
      // background-color: skyblue;
      border: 2px solid #e0e0e0;
      box-shadow: 2px 2px 2px #e0e0e0;
      border-radius: 5px;
    }

    .div1 {
      background-image: url(../assets/bg-正铉.png);
    }

  }

  .bottom {
    width: 100%;
    height: 20px;
    // background-color: red;
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

    .bot {
      div {
        width: 100%;
        height: 300px;
        box-shadow: 2px 2px 2px #e0e0e0;
        border-radius: 5px;
        border: 2px solid #e0e0e0;
      }
    }
  }
}
</style>
