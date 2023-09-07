<template>
    <div>
        <div class="manageTop">
            <!-- Form -->
            <el-button
                    text
                    style="background-color: white"
                    @click="dialogFormVisible= true"
            >
                添加设备组
            </el-button>
            <el-button
                    text
                    style="background-color: white"
                    @click=" dialogFormVisibleMore= true"
            >
                批量添加设备
            </el-button>
            <el-dialog v-model="dialogFormVisibleMore" title="批量添加设备">
                <el-form :model="device" :rules="rules">
                    <el-form-item label="设备组" :label-width="formLabelWidth" placeholder="设备组"
                                  prop="groupName">
                        <el-select v-model="device.groupName" class="m-2" size="small" label="选择设备组">
                            <el-option
                                v-for="item in groupNames"
                                :key="item"
                                :value="item"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="设备起始地址" :label-width="formLabelWidth" placeholder="设备地址"
                                  prop="address">
                        <el-input v-model="device.address" autocomplete="off"/>
                        <div class="my-2 flex items-center text-sm">
                            <el-radio-group v-model="device.radio" class="ml-4">
                                <el-radio label="1">十进制</el-radio>
                                <el-radio label="2">十六进制</el-radio>
                            </el-radio-group>
                        </div>
                    </el-form-item>
                    <el-form-item label="设备终止地址" :label-width="formLabelWidth" placeholder="设备终止地址"
                                  prop="maxAddress">
                        <el-input v-model="device.maxAddress" autocomplete="off"/>
                        <div class="my-2 flex items-center text-sm">
                            <el-radio-group v-model="device.overRadio" class="ml-4">
                                <el-radio label="1">十进制</el-radio>
                                <el-radio label="2">十六进制</el-radio>
                            </el-radio-group>
                        </div>
                    </el-form-item>
                    <el-form-item label="时间长度" :label-width="formLabelWidth" placeholder="单位秒(<120)" prop="date">
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
                                    v-for="item in dataBitOptions"
                                    :key="item"
                                    :value="item"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="校验位" :label-width="formLabelWidth">
                        <el-select v-model="device.parity" class="m-2" size="small">
                            <el-option
                                    v-for="item in validateBitOptions"
                                    :key="item"
                                    :value="item"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="停止位" :label-width="formLabelWidth">
                        <el-select v-model="device.stopbits" class="m-2" size="small">
                            <el-option
                                    v-for="item in stopBitOptions"
                                    :key="item"
                                    :value="item"
                            />
                        </el-select>
                    </el-form-item>
                </el-form>
                <template #footer>
                  <span class="dialog-footer">
                    <el-button @click="dialogFormVisibleMore = false">取消</el-button>
                    <el-button type="primary" @click="addDevices">
                     确认
                      </el-button>
                  </span>
                </template>
            </el-dialog>
            <!-- 添加设备组-->
            <el-dialog v-model="dialogFormVisible" title="添加设备组">
                <el-form :model="device">
                    <el-form-item
                            label="设备组名称"
                            :label-width="formLabelWidth"
                            placeholder="设备组名称"
                    >
                        <el-input v-model="device.groupName" autocomplete="off"/>
                    </el-form-item>

                    <el-form-item
                            label="轮询间隔"
                            :label-width="formLabelWidth"
                            placeholder="轮询间隔"
                    >
                        <el-input v-model="device.pollingInterval" autocomplete="off"/>
                    </el-form-item>
                </el-form>
                <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="addDeviceGroup">
              确认
            </el-button>
          </span>
                </template>
            </el-dialog>

        </div>
        <div class="manageBox">
            <ManageGroup v-for="(item,index) in groupNames" :groupNameProp="item" :key="index"></ManageGroup>

        </div>

    </div>
</template>


<script setup lang="ts">
import {onMounted, ref,reactive} from "vue";
import {ElMessage, FormRules} from "element-plus";
import {
    addDevicesAPI,
    addGroup,
    getGroupNames,
    getSerialPortListAPI,
    getOnlineDevice
} from "@/api/deviceManagerAPI.ts";
import ManageGroup from "@/components/manageGroup.vue";
import  {useCardArrayStore}  from "@/store/cardStore.ts"
const store = useCardArrayStore()
const dialogFormVisible = ref(false)
const dialogFormVisibleMore = ref(false)
const formLabelWidth = '140px'

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
    port: string,
}

const device = ref<RuleForm>({
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
})
const baudrateOptions = ref([1200, 2400, 4800, 19200, 38400, 57600, 115200])

const dataBitOptions = ref([5, 6, 7, 8])

const validateBitOptions = ref(["None", "Even", "Odd", "Mark"])

const stopBitOptions = ref([1, 2, 3])

const groupNames = ref()
const serialPortList = ref([])
/**
 * 获取在线设备
 */
getOnlineDevice().then((res) => {
    let newCardArray=reactive([])
    res.data.data.map((dd) => {
        let initialCard = {groupName: dd[0], address: dd[1]}
        // console.log(dd,"获取在线设备")
        newCardArray.push(initialCard)
    })
    store.cardArray=newCardArray
    console.log(store.cardArray,"获取在线设备推入")
})

/**
 * 批量添加设备
 */
async function addDevices() {
    try {
        device.value.circle = parseInt(device.value.date) * 50
       let res =  await addDevicesAPI(device.value)
        console.log(res)
        if(res.data.code==0){
            ElMessage.error(res.data.message)
            dialogFormVisible.value = false
            return
        }
        ElMessage.success("添加成功")
        dialogFormVisible.value = false
        // location.reload()
    } catch (e) {
        ElMessage.error(e.message)
    }
}

/**
 * 获取设备组名称
 */
async function getDeviceGroupName() {
    try {
        let res = await getGroupNames()
        groupNames.value = res.data.data
        console.log(groupNames.value)
    } catch (e) {
        ElMessage.error(e.message)
    }
}

/**
 * 添加设备组
 */
async function addDeviceGroup() {
    try {
        let res = await addGroup(device.value.groupName, device.value.pollingInterval)
        if(res.data.code==0){
            ElMessage.error(res.data.msg)
            return
        }
        groupNames.value.push(device.value.groupName)
        dialogFormVisible.value = false
        ElMessage.success("添加成功")
        initReactiveDevice()
    } catch (e) {
        ElMessage.error(e.message)
        initReactiveDevice()
    }
}

/**
 * 获取串口列表
 */
async function getSerialPortList() {
    try {
        let res = await getSerialPortListAPI()
        serialPortList.value = res.data.data
    } catch (e) {
        ElMessage.error(e.message)
    }
}

onMounted(() => {
    getDeviceGroupName()
    getSerialPortList()
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


const rules = ref<FormRules<RuleForm>>({
    groupName: [{required: true, message: '请输入设备名称', trigger: 'blur'}],
    date: [{required: true, message: '请输入时间长度', trigger: 'blur'},
        {
            validator: (rule, value, callback) => {
                if (value > 120) {
                    callback(new Error('时间长度不能大于120'))
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
</script>

<style lang="less">
@import "@/assets/css/index.css";


.el-button--text {
  margin-right: 15px;
}

.el-select {
  width: 300px;
}

.el-input {
  width: 300px;
}

.manageBox {
  height: 850px;
  width: 100%;
  // background-color: blue;
  display: flex;
  flex-flow: wrap;
  margin-bottom: 5px;
  overflow-y: auto;
}

.manageBox::-webkit-scrollbar {
  display: none;
}
</style>