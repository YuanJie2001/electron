<template>
  <div class="atlasBox">
    <div class="atlasTop">
      <div class="div1" ref="echarts1"></div>
      <div ref="echarts2"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from "vue";
import * as echarts from "echarts";
import "echarts-gl";
import { useIpcRenderer } from "@vueuse/electron";

const ipcRenderer = useIpcRenderer();

//2d
let atlasData = ref("");
// console.log(JSON.parse(atlasData))
let new2Data =[]
let new2DataMaxY;
watch(atlasData, (newVal, oldVal) => {
  console.log("历史数据加载。。。 。。。");
  // console.log(atlasData.value);
   new2Data =JSON.parse(JSON.stringify(atlasData.value)) ;
  console.log(new2Data,"输出"); //输出
});

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
// 更新2d数据的函数，里面怎么把数据导进去你得自己加一下，我不太会用这个,这个函数需要在有数据来的时候用20ms的定时器启动
function update2DMapData() {
  if (new2Data.length <= 0) {
    return;
  }
  let idxCircle = 1;
  if(new2Data.length > 8)
  {
      idxCircle = 8;
  }
  for(let idx = 0; idx < idxCircle; idx++){
    map2DIndex = (map2DIndex + 1) % new2Data.length;
    if (map2DData.length >= circleMaxn2D) {
      map2DData.shift();
    }
    map2DData.push(new2Data[map2DIndex]);
  }
  let tmpReal2DMapData = [];
  for (let i = 0; i < map2DData.length; i++) {
    let tmp2DData = map2DData[i];
    for (let j = 0; j < tmp2DData.length; j++) {
      tmpReal2DMapData.push(tmp2DData[j]);
    }
  }
  realMap2DData = tmpReal2DMapData;
  // console.log(realMap2DData,"realdata")
}

setInterval(() => {
  update3DMapData()
  update2DMapData()
},80)

// 更新3d数据的函数，和2D一样的方法启动,也是需要用一个20ms的定时器去启动
function update3DMapData() {
  if (new2Data.length <= 0) {
    return;
  }

  let idxCircle = 1;
  if(new2Data.length > 8)
  {
      idxCircle = 8;
  }
  for(let idx = 0; idx < idxCircle; idx++){
      map3DIndex = (map3DIndex + 1) % new2Data.length;
      if (map3DData.length >= circleMaxn3D) {
          map3DData.shift();
      }
      map3DData.push(new2Data[map3DIndex]);
  }
  // console.log(map3DData)
  let tmpReal3DMapData = [];
  for (let i = map3DData.length - 1, index = 0; i >= 0; i--, index++) {
    let tmp3DData = map3DData[i];
    for (let j = 0; j < tmp3DData.length; j++) {
      tmpReal3DMapData.push([tmp3DData[j][0], index, tmp3DData[j][1]]);
    }
  }
  realMap3DData = tmpReal3DMapData;
  // console.log(realMap3DData,"realdata3D")
}

ipcRenderer.on("atlas-customer-historymsg", (event, arg) => {
  atlasData.value = JSON.parse(arg);
  // console.log(arg, "arg");
  // console.log(JSON.parse(arg), "arg");
});

//3d
let new3Data = reactive();
let new3DataMaxZ = reactive();

var myChart1 = null;
var myChart2 = null;
const echarts1 = ref(null);
const echarts2 = ref(null);


//2d图参数
const option1 = {
  title: {
    text: "PRPD图谱",
  },
  visualMap: {
    max: 2.5,
    inRange: {
      color: [
        "#00ff2a",
        "#17e826",
        "#2ed122",
        "#46b91f",
        "#5da21b",
        "#748b17",
        "#8b7413",
        "#a25d0f",
        "#b9460b",
        "#d12e08",
        "#e81704",
      ],
    },
  },
  xAxis: {
    type: "value",
    min: 0,
    max: 360,
    interval: 30, // 每30度一个刻度
    axisLabel: {
      formatter: function (value) {
        // 格式化 x 轴刻度显示
        // 每90度显示一个刻度
        if (value % 90 === 0) {
          return value + "°";
        } else {
          return "";
        }
      },
    },
  },
  yAxis: {
    type: "value",
    min: 0,
    max:2.5,
  },
  series: [
    {
      name: "散点",
      type: "scatter",
      animation: false,
      symbolSize: 6,
      itemStyle: {
        color: "green",
      },
      data: realMap2DData,
      markLine: {
        animation: false,
        data: [
          {
            type: "average",
            yAxis: '',
          },
        ],
      },
    },
  ],
};

//3D图参数
const option2 = {
  tooltip: {},
  title: {
    text: "PRPS图谱",
  },
  visualMap: {
    max:  2.5 ,
    inRange: {
      color: [
        "#00ff2a",
        "#17e826",
        "#2ed122",
        "#46b91f",
        "#5da21b",
        "#748b17",
        "#8b7413",
        "#a25d0f",
        "#b9460b",
        "#d12e08",
        "#e81704",
      ],
    },
  },
  yAxis3D: {
    type: "value",
    min: 0,
    max: 50,
    interval: 25, // 设置 x 轴刻度的间隔为 25
    axisLine: {
      lineStyle: {
        // color: '#000'
      },
    },
    axisLabel: {},
    splitLine: {
      show: false,
    },
  },
  xAxis3D: {
    type: "value",
    min: 0,
    max: 360,
    interval: 90,
    axisLine: {
      lineStyle: {
        color: "#000",
      },
    },
    splitLine: {
      show: false,
    },
    axisLabel: {
      show: true,
      interval: 90,
      textStyle: {
        color: "#000",
      },
      formatter: function (value) {
        return value + "°"; // 给刻度加上单位 "°"
      },
    },
  },
  zAxis3D: {
    type: "value",
    min: 0.0,
    max:  2.5 ,
    axisLine: {
      lineStyle: {
        color: "#000000",
      },
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: "#000",
      },
      formatter: function (value) {
        return value.toFixed(2); // 将 z 轴刻度显示为小数点后两位
      },
    },
  },
  grid3D: {
    boxWidth: 160, // 盒子大小使得 xy 平面变成正方形
    boxDepth: 160,
    viewControl: {
      distance: 360, // 设置视角距离为 200
      alpha:35, //俯视角度
      beta: 320,
    },
    light: {
      main: {
        intensity: 1.2,
        shadow: true,
      },
      ambient: {
        intensity: 0.3,
      },
    },
  },
  series: [
    {
      barSize: 5,
      animation: false,
      type: "bar3D", // 设置图表类型为 bar3D
      data: realMap3DData,
      shading: "lambert", // 设置柱状图的颜色渲染方式
      symbolSize: [200, 10],
      label: {
        show: false, // 不显示柱状图上的标签
      },
      emphasis: {
        label: {
          show: true, // 高亮状态下显示标签
          textStyle: {
            fontSize: 16,
            borderWidth: 1,
          },
          formatter: function (params) {
            return "Value: " + params.data[2]; // 设置标签显示的内容
          },
        },
      },
    },
  ],
};

setInterval(() => {
  myChart1.setOption({
    // visualMap: {
    //   max: new2DataMaxY > 2.5 ? 5 : 2.5,
    // },
    // yAxis: {
    //   max: new2DataMaxY > 2.5 ? 5 : 2.5,
    // },
    series: [
      {
        data: realMap2DData,
        markLine: {
          data: [
            {
              yAxis: '',
            },
          ],
        },
      },
    ],
  });
  myChart2.setOption({
    // visualMap: {
    //   max: new3DataMaxZ > 2.5 ? 5 : 2.5,
    // },
    // zAxis3D: {
    //   max: new3DataMaxZ > 2.5 ? 5.0 : 2.5,
    // },
    series: [
      {
        data: realMap3DData,
      },
    ],
  });
}, 200);

onMounted(() => {
  // 基于准备好的dom，初始化echarts实例
  myChart1 = echarts.init(echarts1.value);
  // 绘制图表
  myChart1.setOption(option1);

  myChart2 = echarts.init(echarts2.value);

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
}
</style>
