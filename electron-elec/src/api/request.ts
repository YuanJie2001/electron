import axios from "axios";
import {ElMessage} from 'element-plus';
// 统一封装axios请求. 统一拦截判断后端响应信息进行统一处理.
// 避免了在每一个调后端接口的地方重复写axios框架和信息判断

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    // baseURL: 'http://121.196.239.88:1357',
    baseURL: 'http://127.0.0.1:1357',
    // 超时
    timeout: 120000
})

//请求拦截器
axios.interceptors.request.use(
    config => {
    // 在发送请求前要做的事儿
    console.log(config,'123')
    return config
}, err => {
    // 在请求错误时要做的事儿
    
    // 该返回的数据则是axios.catch(err)中接收的数据
    return Promise.reject(err)
})


// 响应拦截器
// success 指有效调用后端接口.不管业务逻辑
axios.interceptors.response.use(success => {
    // http协议默认调到接口时状态码为200
    console.log(success)
    if (success.status && success.status == 200 || success.status == 1) {
        if (success.data.code == 500 || success.data.code == 401 || success.data.code == 403) {
            // 提示 后端返回的响应信息
            ElMessage.error({message: success.data.message})
            return;
        }
        if (success.data.message) {
            ElMessage.success({message: success.data.message})
        }
    }
    return success.data;
}, error => {
    console.log(error)
    if (error.response.code == 504 || error.response.code == 404) {
        ElMessage.error({message: '服务器我被吃了( ╯□╰ )'})
    } else {
        if (error.response.data.message) {
            ElMessage.error({message: error.response.data.message});
        } else {
            ElMessage.error({message: '未知错误!'})
        }
    }
    return;
})


export default service;