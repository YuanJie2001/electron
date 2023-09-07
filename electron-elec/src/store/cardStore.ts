import {defineStore} from 'pinia'
import {ref,watch} from "vue";
// 你可以对 `defineStore()` 的返回值进行任意命名，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。(比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useCardArrayStore = defineStore('resource', {
    // 其他配置...
    state: () => ({
        // 这里是你的状态
        cardArray: [] ,
        socket: null,
        readyState: 0,
        socketMessage: [],
        logMessage: [],
        exceptMessage:[]
    }),
    // getters: {
    //     // 这里是你的 getters
    //     SET_SOCKET: (state: any, socket: any) => {
    //         state.socket = socket;
    //     },
    //     SET_SOCKET_MESSAGE: (state: any, socketMessage: any) => {
    //         state.socketMessage = socketMessage;
    //     }
    // },
    actions: {
        // 这里是你的 actions
        connectWebSocket() {
            const PING_INTERVAL = 5000; // 心跳间隔，单位为毫秒
            const heartbeatMessage = {type: 0, msg: "ping"}; // 心跳消息
            // const HOST_ADDRESS = 'ws://121.196.239.88:7531'
            const HOST_ADDRESS = 'ws://127.0.0.1:7531'
            const socket = ref(new WebSocket(HOST_ADDRESS))
            let checkTask = null
            // 监听连接事件
            socket.value.onopen = () => {
                // 启动心跳检测 确保连接存活 客户端每隔5秒向服务端发送一次心跳消息
                // console.log(JSON.stringify(heartbeatMessage))
                checkTask = setInterval(() => {
                    socket.value.send(JSON.stringify(heartbeatMessage))
                }, PING_INTERVAL)
            }

            // 监听消息事件
            socket.value.onmessage = (event) => {
                // console.log(event.data,"event2")
                let message = JSON.parse(event.data)
                // console.log(message)
                if (message.type == WebSocket.CONNECTING) {
                    console.log("pong")
                    // socket.value.send(JSON.stringify(heartbeatMessage2))
                    //响应包
                    return
                } else if (message.type == 1||message.type == 6){
                    const atlasData = JSON.parse(message.data)
                    // console.log(atlasData)

                    for (let i = 0; i < this.cardArray.length; i++) {
                        if (this.cardArray[i].address === atlasData.address &&
                            this.cardArray[i].groupName === atlasData.groupName) {
                            this.cardArray[i] = atlasData
                        }

                    }
                }
                if (message.type == 6) {
                    const atlasData2 = JSON.parse(message.data)
                    // console.log(atlasData2)
                    for (let i = 0; i < this.cardArray.length; i++) {
                        if (this.cardArray[i].address === atlasData2.address &&
                            this.cardArray[i].groupName === atlasData2.groupName) {
                            this.logMessage.unshift(atlasData2)
                            if (atlasData2.mapType !== "正常"){
                                this.exceptMessage.unshift(atlasData2) 
                            }
                        }

                    }
                        if (this.logMessage.length > 1000) {
                            console.log("存满了")
                            this.logMessage.splice(800, this.logMessage.length-800);
                    }
                        if (this.exceptMessage.length > 800) {
                            console.log("存满了")
                            this.exceptMessage.splice(600, this.exceptMessage.length-600);
                        }
                }
                
            }

            // 监听关闭事件 断线重连
            socket.value.onclose = () => {
                if (this.socket.readyState === WebSocket.CLOSED) {
                    this.socketMessage.forEach((message) => {
                        this.sendMessage(message)
                    });
                    this.socketMessage = []

                }
                checkTask && clearInterval(checkTask)
                setTimeout(() => {
                    this.connectWebSocket()
                }, 3000)
            }

            // 连接错误
            socket.value.onerror = (event) => {
                console.log('WebSocket error:', event)
            }
        },

        // initializeLog() {
        //     console.log("12")
        //     watch(this.cardArray, (newVal, oldVal) => {
        //         console.log(this.cardArray)
        //         this.cardArray.map((data) => {
        //             this.logMessage.unshift(JSON.parse(JSON.stringify(data)))
        //             console.log(this.logMessage)
        //         })
        //         // console.log("cardArray", cardArray.value);
        //         if (this.logMessage.length > 2000) {
        //             console.log("存满了")
        //             this.logMessage.splice(1000, 2000);
        //             // console.log(logMessage) 
        //         }
        //     });
        // },

        // 发送消息方法
        sendMessage(message: string) {
            this.socket.send(message)
        }

    }

})


// interface Card {
//     groupName: string,
//     address: number
// }
