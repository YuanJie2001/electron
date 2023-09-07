// Modules to control application life and create native browser window

const { app, BrowserWindow, ipcMain,dialog } = require('electron')
const path = require('path')
// const winURL = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : `file://${path.join(__dirname, './dist/index.html')}`

let mainWindow;
let textdata;
let historyAtlas;
let textBox;
function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 1024,
        minWidth: 600,
        minHeight: 600,
        title: '局部放电监控中心',
        autoHideMenuBar: true, // 自动隐藏菜单栏
        webPreferences: {
            // 是否启用Node integration
            nodeIntegration: true, // Electron 5.0.0 版本之后它将被默认false
            // 是否在独立 JavaScript 环境中运行 Electron API和指定的preload 脚本.默认为 true
            contextIsolation: false,  // Electron 12 版本之后它将被默认true
            nodeIntegrationInWorker: true,
            // 禁用同源策略，允许跨域
            webSecurity: false,
            preload: path.join(__dirname, 'preload.ts'),
            devTools: false // 禁用开发者工具
        }

    })
  

    // and load the index.html of the app.
    mainWindow.loadFile('./dist/index.html')
    // Open the DevTools.
    // mainWindow.webContents.openDevTools({mode:'right'})

    // 监听窗口关闭
    mainWindow.on('window-close', function () {
        mainWindow.close();
    })
    mainWindow.webContents.on('did-finish-load', () => {
        console.log("主进程渲染,主窗口加载完毕")
      })

}


// 监听textBox消息
ipcMain.on('textBox', function (event, data) {
    console.log("接收")
    textBox = new BrowserWindow({
        width: 1280,
        height: 1024,
        minWidth: 600,
        minHeight: 600,
        modal: true, // 窗口置顶
        parent: mainWindow, // mainWindow是主窗口
        frame: true, // 有边框
        title: '查看',
        autoHideMenuBar: true, // 自动隐藏菜单栏

        webPreferences: {
            // 是否启用Node integration
            nodeIntegration: true, // Electron 5.0.0 版本之后它将被默认false
            // 是否在独立 JavaScript 环境中运行 Electron API和指定的preload 脚本.默认为 true
            contextIsolation: false,  // Electron 12 版本之后它将被默认true
            nodeIntegrationInWorker: true,
            // 禁用同源策略，允许跨域
            webSecurity: false,
            preload: path.join(__dirname, 'preload.ts'),
            devTools: false // 禁用开发者工具
        }
    })
    // console.log(data,"---2323---")
    // textBox.loadURL('http://127.0.0.1:3000/#/add')  // 此处写 你要打开的路由地址
    textBox.loadFile('./dist/index.html', {
        hash: '#' + data
    });
    // 监听textBox窗口关闭
    textBox.on('closed', () => {
        console.log("窗口关闭")
        mainWindow.webContents.send('stopSingleDevice')
        textBox == null;
    })
    // Open the DevTools.
    // textBox.webContents.openDevTools({ mode: 'right' })
    textBox.webContents.on('did-stop-loading', () => {
        console.log("渲染进程渲染,新窗口加载完毕")
        textBox.webContents.send('customer-msg', textdata)
        textBox.webContents.send('atlas-customer-historymsg',historyAtlas)
    })
})

// 监听 product-msg 信道消息
ipcMain.on('product-msg', async (event, data) =>{
    textdata = data
});
ipcMain.on('device-msg', async (event, data) => {
    // console.log(data)
    textBox.webContents.send('device-customer-msg',data)
});
ipcMain.on('atlas-msg', async (event, data) =>{
    textBox.webContents.send('atlas-customer-msg',data)
});
ipcMain.handle('atlas-historymsg', async (event, data) =>{
    // console.log(data, "i am historymsg")
    historyAtlas=data
    return true;
});


ipcMain.on('open-fileDir-dialog', (event) => {
    dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    }).then(result => {
        if (!result.canceled && result.filePaths.length > 0) {
            event.returnValue = result.filePaths[0];
            return;
        }
        event.returnValue = null;
    }).catch(error => {
        console.error('Error opening folder dialog:', error);
    });

});


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)
    app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
