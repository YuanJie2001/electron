<template>
    <el-container>
        <el-header>
            <el-row class="mb-4">
                <el-button @click="keyCodeForEvent">系统配置</el-button>
                <el-dialog 
                v-model="systemDialogTableVisible" 
                title="系统配置" 
                :close-on-click-modal="false"
                :show-close="false">
                    <el-form :model="systemConfig">
                        <el-form-item label="服务器IP" :label-width="formLabelWidth">
                            <el-input v-model="systemConfig.data.ip" autocomplete="off" />
                        </el-form-item>
                        <el-form-item label="客户端ID" :label-width="formLabelWidth">
                            <el-input v-model="systemConfig.data.clientId" autocomplete="off" />
                        </el-form-item>
                        <el-form-item label="客户端密钥" :label-width="formLabelWidth">
                            <el-input v-model="systemConfig.data.clientKey" autocomplete="off" />
                        </el-form-item>
                        <el-form-item label="激活ID" :label-width="formLabelWidth">
                            <el-input v-model="systemConfig.data.activeId" autocomplete="off" />
                        </el-form-item>
                        <el-form-item label="激活码" :label-width="formLabelWidth">
                            <el-input v-model="systemConfig.data.key" autocomplete="off" />
                        </el-form-item>
                    </el-form>
                    <template #footer>
                      <span class="dialog-footer">

                         <el-button @click="systemDialogTableVisible = false">取消</el-button>
                        <el-button type="primary" @click="updateSystemConfig">
                          确认
                        </el-button>
                      </span>
                    </template>
                </el-dialog>

            </el-row>
        </el-header>
        <el-container>
            <el-aside>
                <el-row>
                    <el-button class="side" @click="comName = DeviceManager">💻设备管理</el-button>
                </el-row>
                <el-row>
                    <el-button class="side" @click="comName = DeviceCard">📊设备图谱</el-button>
                </el-row>
                <el-row>
                    <el-button class="side" @click="comName = DeviceData">📈历史数据</el-button>
                </el-row>
                <el-row>
                    <el-button class="side" @click="comName = DeviceLog">📰日志信息</el-button>
                </el-row>
                <el-row>
                    <el-button class="side" @click="comName = DeviceExceptLog">📝异常信息</el-button>
                </el-row>
            </el-aside>
            <el-main>
                <component :is="comName" v-if="comName == DeviceManager"></component>
                <component :is="comName" v-else-if="comName == DeviceCard"></component>
                <keep-alive>
                    <component :is="comName" v-if="comName == DeviceData"></component>
                    <component :is="comName" v-else-if="comName == DeviceLog"></component>
                    <component :is="comName" v-else-if="comName == DeviceExceptLog"></component>
                </keep-alive>
            </el-main>
        </el-container>
    </el-container>



    <el-dialog v-model="disVisible" title="test">
        <el-input v-model="pwd"></el-input>
        <el-button @click="validatePwd">确定</el-button>
    </el-dialog>

    <el-dialog v-model="textAreaVisible" title="test">
        <el-input
            v-model="textarea"
            :rows="2"
            type="textarea"
            placeholder="Please input"
        />
        <el-button @click="textAreaVisible=false">确定</el-button>
    </el-dialog>
</template>


<script setup lang="ts">
import {onMounted, reactive, ref, shallowRef} from "vue";
import DeviceManager from "@/view/deviceManager.vue";
import DeviceCard from "@/view/deviceCard.vue";
import DeviceData from "@/view/deviceData.vue";
import DeviceLog from "@/view/deviceLog.vue";
import DeviceExceptLog from "@/view/deviceExceptLog.vue";
import {getSystemConfig, updateSystemConf} from "@/api/systemConfigAPI.ts";
import {ElMessage} from "element-plus";
import  {useCardArrayStore}  from "@/store/cardStore.ts"
const store = useCardArrayStore()

store.connectWebSocket()
let comName = shallowRef(DeviceManager);
const systemDialogTableVisible = ref(false);
const systemConfig = reactive({
    data : {
        ip: "",
        serverPort: "",
        clientId: "",
        clientKey: "",
        activeId: "",
        key: "",
    }
});
const formLabelWidth = '140px'
 async function updateSystemConfig() {
    const res = await updateSystemConf(systemConfig.data);
    // systemConfig.data = res.data;
    if(res.data.code == 0){
        return ElMessage.error("更新系统配置失败"+ res.data.msg);
    }
    ElMessage.success("更新系统配置成功");
    systemDialogTableVisible.value = false;
}

async function getSystemConf() {
    const res = await getSystemConfig();
    console.log(res)
    if(res.data.code == 0){
        return ElMessage.error("获取系统配置失败"+ res.data.msg);
    }
    systemConfig.data = res.data.data;
}

const disVisible= ref(false)
const pwd = ref('')
const textAreaVisible = ref(false)
const textarea = ref('')
function keyCodeForEvent(){
    getSystemConf();
    systemDialogTableVisible.value = true
    document.addEventListener('keydown',listener)
}
let listener = function(event) {
    // 监听ctrl+alt+shift+p
    if (event.ctrlKey && event.altKey && event.shiftKey && event.keyCode == 80) {
        disVisible.value = true;
    }
}
function validatePwd() {
    document.removeEventListener('keyup', listener);
    if (pwd.value == '13579') {
        disVisible.value = false;
        textAreaVisible.value = true;
        pwd.value = '';
    }
}
</script>

<style scoped>
.el-aside {
    background-color: rgba(0, 0, 0, 0.7);
    color: #333;
    text-align: center;
    padding: 10px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    width: 180px;
}

.el-main {
    width: 1024px;
    height: 800px;

    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.5);
    color: #333;
    text-align: center;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
}

.side {
    width: 180px;
    height: 40px;
    text-align: center;
}


.dialog-footer button:first-child {
    margin-right: 10px;
}
</style>
