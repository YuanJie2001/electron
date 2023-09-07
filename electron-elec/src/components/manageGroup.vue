<template>
    <el-dialog v-model="updateDialogFormVisible" title="修改设备">
        <el-form :model="device">
            <el-form-item
                    label="设备组"
                    placeholder="设备组"
                    :label-width="formLabelWidth">
                <el-select v-model="device.groupName" class="m-2" size="small" label="选择设备组">
                    <el-option
                            v-for="item in groupNames"
                            :key="item"
                            :value="item"
                    />
                </el-select>
            </el-form-item>
            <el-form-item
                    label="设备地址"
                    :label-width="formLabelWidth"
                    placeholder="设备地址"
            >
                <el-input v-model="device.address" autocomplete="off"/>
                <div class="my-2 flex items-center text-sm">
                    <el-radio-group v-model="device.radio" class="ml-4">
                        <el-radio label="1">十进制</el-radio>
                        <el-radio label="2">十六进制</el-radio>
                    </el-radio-group>
                </div>
            </el-form-item>
            <el-form-item
                    label="时间长度"
                    :label-width="formLabelWidth"
                    placeholder="单位秒(<5)"
            >
                <el-input v-model="device.date" autocomplete="off"/>
            </el-form-item>
            <el-form-item
                    label="报警阈值"
                    :label-width="formLabelWidth"
                    placeholder="报警阈值(>0)"
            >
                <el-input v-model="device.threshold" autocomplete="off"/>
            </el-form-item>
            <el-form-item label="串口号" :label-width="formLabelWidth">
                <el-select v-model="device.port" class="m-2" size="small" label="选择串口号">
                    <el-option
                            v-for="item in serialPortList"
                            :key="item"
                            :value="item"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="波特率" :label-width="formLabelWidth">
                <el-select v-model="device.baudrate" class="m-2" size="small">
                    <el-option
                            v-for="item in baudrateOptions"
                            :key="item"
                            :value="item"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="数据位" :label-width="formLabelWidth">
                <el-select v-model="device.bytesize" class="m-2" size="small">
                    <el-option
                            v-for="item in bytesizeOptions"
                            :key="item"
                            :value="item"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="校验位" :label-width="formLabelWidth">
                <el-select v-model="device.parity" class="m-2" size="small">
                    <el-option
                            v-for="item in parityOptions"
                            :key="item"
                            :value="item"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="停止位" :label-width="formLabelWidth">
                <el-select v-model="device.stopbits" class="m-2" size="small">
                    <el-option
                            v-for="item in stopbitsOptions"
                            :key="item"
                            :value="item"
                    />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="updateDialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="updateDevice">
              确认
            </el-button>
          </span>
        </template>
    </el-dialog>
    <div class="manageGroup">
        <div class="manageGroupTop">
            {{ groupNameProp }}
            <div class="funcbtn">
                <el-button @click="AddDialogFormVisible = true">添加设备</el-button>
                <el-button @click="getGroupPollingInterval">修改设备组</el-button>
                <el-button type="danger" @click="deleteGroupDeviceData">删除设备组</el-button>
            </div>
        </div>

        <div class="groupListBox">
            <div class="groupList" v-for="(item,index) in deviceList" :key="index">
                <div :style='[item.taskText=="关闭"?"color: #409eff;font-size:20px":"color:red;font-size:20px" ]'>
                    ✦
                </div>
                <div style="margin-right: 15px; line-height: 30px;" @click="updateDeviceVisible(index)">
                    设备地址:{{ item.address }}
                </div>
                <el-button @click="task(item)" :type='[item.taskText=="关闭" ? "primary":"default"]'>
                    {{ item.taskText }}
                </el-button>
                <!-- <el-button @click="openNew">图谱</el-button> -->
                <el-button @click="deleteDeviceData(index)">删除</el-button>
            </div>
        </div>
    </div>

    <el-dialog v-model="AddDialogFormVisible" title="添加设备">
        <el-form :model="device" :rules="rules">
            <el-form-item label="设备组" :label-width="formLabelWidth" placeholder="设备组"
                          prop="groupName">
                <el-select v-model="device.groupName" class="m-2" size="small">
                    <el-option
                            v-for="item in groupNames"
                            :key="item"
                            :value="item"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="设备地址" :label-width="formLabelWidth" placeholder="设备地址" prop="address">
                <el-input v-model="device.address" autocomplete="off"/>
                <div class="my-2 flex items-center text-sm">
                    <el-radio-group v-model="device.radio" class="ml-4">
                        <el-radio label="1">十进制</el-radio>
                        <el-radio label="2">十六进制</el-radio>
                    </el-radio-group>
                </div>
            </el-form-item>
            <el-form-item label="时间长度" :label-width="formLabelWidth" placeholder="单位秒(<=120)" prop="date">
                <el-input v-model="device.date" autocomplete="off"/>
            </el-form-item>
            <el-form-item label="报警阈值" :label-width="formLabelWidth" placeholder="报警阈值(>0)"
                          prop="threshold">
                <el-input v-model="device.threshold" autocomplete="off"/>
            </el-form-item>
            <el-form-item label="串口号" :label-width="formLabelWidth">
                <el-select v-model="device.port" class="m-2" size="small">
                    <el-option
                            v-for="item in serialPortList"
                            :key="item"
                            :value="item"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="波特率" :label-width="formLabelWidth">
                <el-select v-model="device.baudrate" class="m-2" size="small">
                    <el-option
                            v-for="item in baudrateOptions"
                            :key="item"
                            :value="item"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="数据位" :label-width="formLabelWidth">
                <el-select v-model="device.bytesize" class="m-2" size="small">
                    <el-option
                            v-for="item in bytesizeOptions"
                            :key="item"
                            :value="item"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="校验位" :label-width="formLabelWidth">
                <el-select v-model="device.parity" class="m-2" size="small">
                    <el-option
                            v-for="item in parityOptions"
                            :key="item"
                            :value="item"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="停止位" :label-width="formLabelWidth">
                <el-select v-model="device.stopbits" class="m-2" size="small">
                    <el-option
                            v-for="item in stopbitsOptions"
                            :key="item"
                            :value="item"
                    />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
                  <span class="dialog-footer">
                    <el-button @click="AddDialogFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="addDevice">
                     确认
                      </el-button>
                  </span>
        </template>
    </el-dialog>

  <!--            修改设备组-->
    <el-dialog v-model="updateDeviceGroupVisible" title="修改设备组">
        <el-form :model="device">
            <el-form-item
                    label="设备组名称"
                    :label-width="formLabelWidth"
                    placeholder="设备组名称"
            >
                <el-input v-model="groupNameProp" autocomplete="off" disabled/>
            </el-form-item>

            <el-form-item
                    label="轮询间隔"
                    :label-width="formLabelWidth"
                    placeholder="轮询间隔"
            >
                <el-input v-model="pollingInterval" autocomplete="off"/>
            </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="updateDeviceGroupVisible = false">取消</el-button>
            <el-button type="primary" @click="updateDeviceGroup">
              确认
            </el-button>
          </span>
        </template>
    </el-dialog>

</template>

<script setup lang="ts">
import {onMounted, reactive, ref, toRefs, watch} from "vue";
import {ElMessage, ElMessageBox, FormRules} from "element-plus";
import {
    addDeviceAPI,
    getDeviceInfoList,
    updateDeviceAPI,
    deleteDeviceAPI,
    deleteGroupDeviceAPI,
    getGroupPollingIntervalAPI,
    updateGroup,
    getGroupNames,
    getSerialPortListAPI,
    addTaskAPI,
    cancelTaskAPI,
    getOnlineDevice
} from "@/api/deviceManagerAPI.ts";
import {useIpcRenderer} from "@vueuse/electron";
import {useCardArrayStore} from "@/store/cardStore.ts"

const ipcRenderer = useIpcRenderer()
const store = useCardArrayStore()
const groupNames = ref();
const deleteDialogVisible = ref(false)
const deleteGroupDialogVisible = ref(false)

const AddDialogFormVisible = ref(false);
const updateDialogFormVisible = ref(false);
const formLabelWidth = "140px";
const updateDeviceGroupVisible = ref(false)


const baudrateOptions = ref([1200, 2400, 4800, 19200, 38400, 57600, 115200]);

const bytesizeOptions = ref([5, 6, 7, 8]);

const parityOptions = ref(["None", "Even", "Odd", "Mark"]);

const stopbitsOptions = ref([1, 2, 3]);

const deviceList = ref([])

const serialPortList = ref([])



// 监听设备状态变化
// watch(store.cardArray, (newVal, oldVal) => {
//     console.log(newVal, oldVal,"store.cardArray变化");
//     getDeviceList();
// })

watch(
    () => props.groupNameProp,
    (newVal, oldVal) => {
        // console.log(newVal, oldVal);
        groupNames.value.push(props.groupNameProp)
        getDeviceList();
    }
)

/**
 * 获取串口号列表
 */
async function getSerialPortList() {
    try {
        let res = await getSerialPortListAPI()
        serialPortList.value = res.data.data
    } catch (e) {
        ElMessage.error(e.message)
    }
}


const props = defineProps({
    groupNameProp: {type: String, default: ""},
})

const {
    groupNameProp,
} = toRefs(props)


const openNew = () => {
    ipcRenderer.send('textBox', '/add')

    

};


const device = ref<RuleForm>({
    address: 0,
    maxAddress: 0,
    date: '1',
    threshold: 0,
    port: '',
    baudrate: 1200,
    bytesize: 5,
    parity: "None",
    stopbits: 1,
    radio: "1",
    overRadio: "1",
    circle: 1,
    count: 0,
    groupId: 0,
    groupName: '',
    pollingInterval: 0
})

/**
 * 添加设备
 */
async function addDevice() {
    try {
        device.value.circle = parseInt(device.value.date) * 50
        let res = await addDeviceAPI(device.value)
        if (res.data.code == 0) {
            ElMessage.error(res.data.msg)
            return
        }
        Reflect.set(device.value, 'taskText', "开启")
        deviceList.value.push(device.value)
        // console.log(deviceList.value)
        ElMessage.success("添加成功")
        AddDialogFormVisible.value = false
        initReactiveDevice()
    } catch (e) {
        ElMessage.error(e.message)
        initReactiveDevice()
    }
}

/**
 * 获取设备组
 */
async function getDeviceGroupName() {
    try {
        let res = await getGroupNames()
        if (res.data.code == 0) {
            ElMessage.error(res.data.msg)
            return
        }
        groupNames.value = res.data.data
        // console.log(groupNames)
    } catch (e) {
        ElMessage.error(e.message)
    }
}

/**
 * 修改设备组信息
 */
async function updateDeviceGroup() {
    try {
        let res = await updateGroup(props.groupNameProp, pollingInterval.value)
        if (res.data.code == 0) {
            ElMessage.error(res.data.msg)
            return
        }
        ElMessage.success("修改成功")

        updateDeviceGroupVisible.value = false
    } catch (e) {
        ElMessage.error(e.message)
    }
}


/**
 * 修改设备信息
 */
async function updateDevice() {
    try {
        device.value.circle = parseInt(device.value.date) * 50
        await updateDeviceAPI(device.value)
        ElMessage.success("修改成功")
        updateDialogFormVisible.value = false;
        initReactiveDevice()
    } catch (e) {
        ElMessage.error(e.message)
        initReactiveDevice()
    }
}


const pollingInterval = ref(0)
/**
 * 获取设备轮询间隔
 */
async function getGroupPollingInterval() {
    try {
        let res = await getGroupPollingIntervalAPI(props.groupNameProp)
        pollingInterval.value = res.data.data.pollingInterval
        console.log(props.groupNameProp + "select")
        updateDeviceGroupVisible.value = true
    } catch (e) {
        ElMessage.error(e.message)
    }
}

/**
 * 获取设备列表
 * @param item
 */
async function task(item) {
    try {
        let flag =false
        store.cardArray.map((card, index) => {
            if (card.groupName == item.groupName &&
                card.address == item.address) {
                cancelTask(item, index)
                flag = true
                return;
            }
        })
        if (flag) {
            return
        }
        await addTask(item)
    } catch (e) {
        ElMessage.error(e.message)
    }
}


/**
 * 开启
 * @param item
 */
async function addTask(item) {
    try {
        let res = await addTaskAPI(item.groupName, item.address)
         
        if (res.code == 0) {
            ElMessage.error(res.msg)
            return
        }
        let card = {groupName: item.groupName, address: item.address}
        store.cardArray.push(card)
        getDeviceList();
        console.log("添加任务推入")
    } catch (e) {
        ElMessage.error(e.message)
    }
}

/**
 * 关闭
 * @param item
 * @param index
 */
async function cancelTask(item, index) {
    try {
        let res = await cancelTaskAPI(item.groupName, item.address)
        console.log("取消任务", res.data)
         
        if (res.code == 0) {
            ElMessage.error(res.msg)
            return
        }
        console.log(store.cardArray,"cardArray取消前")
        store.cardArray.splice(index, 1)
        getDeviceList();
        console.log(store.cardArray,"cardArray取消后")
        // console.log(store.socketMessage,"socketMessage取消前")
        // store.socketMessage.map((msg, idx) => {
        //     // console.log(msg,item,idx)
        //     if (msg.groupName == item.groupName &&
        //         msg.address == item.address) {
        //             console.log("移除节点",msg)
        //         store.socketMessage.splice(idx, 1)
        //         return;
        //     }
        // })
        // console.log(store.socketMessage,"socketMessage取消后")
    } catch (e) {
        ElMessage.error(e.message)
    }
}

/**
 * 删除设备
 * @param index
 */
async function deleteDeviceData(index) {
    ElMessageBox.confirm("是否删除该设备", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    }).then(async () => {
        await getDeviceList()
        let item = deviceList.value[index];
        await deleteDeviceAPI(item.groupName, item.address)
        deviceList.value.splice(index, 1)
        deleteDialogVisible.value = false
        ElMessage.success("删除成功")
    })
}


/**
 * 删除设备组
 */
async function deleteGroupDeviceData() {
    ElMessageBox.confirm("是否删除该设备组", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    }).then(async () => {
        if (deviceList.value.length === 0) {
            console.log(props.groupNameProp)
            await deleteGroupDeviceAPI(props.groupNameProp)
            ElMessage.success("删除成功")
            deleteGroupDialogVisible.value = false
            location.reload()
            return
        }
        ElMessage.error("请先删除设备")
    })
}


/**
 * 获取设备组下的所有设备
 */
async function getDeviceList() {
    try {
        deviceList.value = [];
        let res = await getDeviceInfoList(props.groupNameProp)
        // console.log("获取当前组所有设备")
        // console.log(res.data)
        if (res.data.data == null || res.data.data.length == 0) {
            return
        }
        // console.log(res.data.data,"初始数据")
        // console.log(store.cardArray,"初始store")
        for (let i in res.data.data) {
            Reflect.set(res.data.data[i], 'taskText', "开启")
            store.cardArray.map((card, index) => {
                // console.log(card,"card")
                if (card.address == res.data.data[i].address) {
                    // console.log("添加关闭")
                    Reflect.set(res.data.data[i], 'taskText', "关闭")
                }
            })

            // console.log( res.data.data[i])
        }

        deviceList.value = res.data.data
    } catch (e) {
        ElMessage.error(e.message)
    }
}


function updateDeviceVisible(index) {
    device.value = deviceList.value[index];
    updateDialogFormVisible.value = true;
}


onMounted(() => {
    getDeviceGroupName()
    getDeviceList()
    getSerialPortList()
})


interface RuleForm {
    address: number,
    maxAddress: number,
    date: string,
    threshold: number,
    baudrate: number,
    bytesize: number,
    parity: string,
    stopbits: number,
    radio: string,
    overRadio: string,
    circle: number,
    count: number,
    groupId: number,
    groupName: string,
    pollingInterval: number,
    port: string
}


const rules = ref<FormRules<RuleForm>>({
    groupName: [{required: true, message: '请输入设备名称', trigger: 'blur'}],
    date: [{required: true, message: '请输入时间长度', trigger: 'blur'},
        {
            validator: (rule, value, callback) => {
                if (value > 5) {
                    callback(new Error('时间长度不能大于5'))
                } else {
                    callback()
                }
            }, trigger: 'blur'
        }],
    address: [{required: true, message: '请输入设备地址', trigger: 'blur'},
        {
            validator: (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入设备地址'))
                }
                if (device.value.radio === "1") {
                    if (value < 0 || value > 255) {
                        callback(new Error('设备地址范围为0-255'))
                    }
                } else {
                    if (value < 0 || value > 0xffff) {
                        callback(new Error('设备地址范围为0-65535'))
                    }
                }
                callback()
            }, trigger: 'blur'
        }],
    threshold: [{required: true, message: '请输入报警阈值', trigger: 'blur'},
        {
            validator: (rule, value, callback) => {
                if (value <= 0) {
                    callback(new Error('报警阈值不能小于0'))
                } else {
                    callback()
                }
            }, trigger: 'blur'
        }],
    baudrate: [{required: true, message: '请选择波特率', trigger: 'blur'}],
    bytesize: [{required: true, message: '请选择数据位', trigger: 'blur'}],
    parity: [{required: true, message: '请选择校验位', trigger: 'blur'}],
    stopbits: [{required: true, message: '请选择停止位', trigger: 'blur'}],
    port: [{required: true, message: '请选择串口', trigger: 'blur'}],
})

function initReactiveDevice() {
    device.value = {
        address: 0,
        maxAddress: 0,
        date: '120',
        threshold: 0,
        port: '',
        baudrate: 1200,
        bytesize: 5,
        parity: "None",
        stopbits: 1,
        radio: "1",
        overRadio: "1",
        circle: 0,
        count: 0,
        groupId: 0,
        groupName: '',
        pollingInterval: 0
    }
}
</script>

<style scoped lang="less">

.manageGroup {
  width: 300px;
  height: 420px;
  background-color: #ebeef2;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  box-shadow: 1px 2px 2px #1f1f1f;
  margin: 10px;

  .manageGroupTop {
    margin-top: 5px;
    // margin-left: 35%;
    text-align: center;
    line-height: 30px;

    .funcbtn {
      margin-top: 10px;
      // background-color: skyblue;
      display: flex;
      justify-content: space-around;
      // flex-direction: column;
      button {
        margin: auto;
        margin-top: 5px;

        padding: 2px 8px;
      }

    }

  }

  .groupListBox {
    height: 81%;
    margin-top: 8px;
    overflow-y: auto;
    margin-bottom: 10px;
    border-top: 2px #977563 solid;
    // border-bottom: 1px black solid;
  }

  .groupListBox::-webkit-scrollbar {
    display: none;
  }

  .groupList {
    background-color: #ffffff;
    border-top: 1px solid gray;
    border-bottom: 1px solid gray;
    margin-bottom: 5px;
    //   font-size: small;
    padding: 5px 5px 5px 10%;
    padding-top: 0;
    padding-bottom: 0;
    display: flex;
    justify-content: space-evenly;

    button {
      padding: 0 5px;
      margin-left: 0px;
      min-height: 25px;
      height: 30px;
      border-radius: 0px;
      border-top: none;
      border-bottom: none;
    }

    button:hover {
      //   border: 1px solid skyblue;
    }
  }
}
</style>
