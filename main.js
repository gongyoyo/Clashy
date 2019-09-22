const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const {
    BRG_MSG_START_CLASH,
    BRG_MSG_ADD_SUBSCRIBE,
    BRG_MSG_UPDATE_SUBSCRIBE,
    BRG_MSG_FETCH_PROFILES,
    BRG_MSG_SWITCHED_PROFILE,
    BRG_MSG_SWITCHED_PROXY,
    BRG_MSG_DELETE_SUBSCRIBE,
    BRG_MSG_OPEN_CONFIG_FOLDER,
    BRG_MSG_OPEN_LINK,
    BRG_MSG_GET_LOGIN_ITEM,
    BRG_MSG_SET_LOGIN_ITEM,
    BRG_MSG_GET_CLASHY_CONFIG,
    BRG_MSG_SET_SYSTEM_PROXY,
    BRG_MSG_CHECK_DELAY
} = require('./src/native-support/message-constants')
const { ClashBinary, utils } = require('./src/native-support')
const { openConfigFolder, openLink, getStartWithSystem, setStartWithSystem, setAsSystemProxy } = require('./src/native-support/os-helper')
const { initializeTray, destroyTrayIcon, setWindowInstance } = require('./src/native-support/tray-helper')
const path = require('path')
const { addSubscription, deleteSubscription, updateSubscription } = require('./src/native-support/subscription-updater')
const { fetchProfiles } = require('./src/native-support/profiles-manager')
const { setProfile, setProxy, getCurrentConfig, initialConfigsIfNeeded } = require('./src/native-support/configs-manager')
const { batchRequestDelay } = require('./src/native-support/check-delay')
const { autoUpdater } = require('electron-updater')
// 保持对window对象的全局引用，如果不这么做的话，当JavaScript对象被
// 垃圾回收的时候，window对象将会自动的关闭
let win

function createWindow() {
    // 创建浏览器窗口。
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'src', 'native-support', 'electron-preload.js'),
            webSecurity: false
        }
    })
    win.setFullScreenable(false)
    win.setResizable(false)
    win.removeMenu()
    win.on('minimize', event => {
        event.preventDefault();
        if (app.dock != null) {
            app.dock.hide()
        }
        win.hide()
    })
    win.on('restore', event => {
        if (app.dock != null) {
            app.dock.show()
        }
    })
    win.on('close', event => {
        if (app.dock != null) {
            app.dock.hide()
        }
        win.hide()
    })
    ClashBinary.spawnClash()
    // 然后加载应用的 index.html。

    if (utils.isElectronDebug()) {
        win.loadURL('http://localhost:3000')
        win.webContents.openDevTools()
    } else {
        win.loadFile('index.html')
    }

    // 当 window 被关闭，这个事件会被触发。
    win.on('closed', () => {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 与此同时，你应该删除相应的元素。
        win = null
    })
    return win
}

const singleInstanceLock = app.requestSingleInstanceLock()
if (!singleInstanceLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        if (win != null && win.isDestroyed()) {
            win.show()
            if (app.dock != null) {
                app.dock.show()
            }
        }
      })
    
    app.on('ready', () => {
        autoUpdater.checkForUpdatesAndNotify();
        initialConfigsIfNeeded().then(() => {
            createWindow()
            setMainMenu()
            initializeTray(win, createWindow)
        }).catch(e => {
            console.error(e)
        })
})
}

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    // if (process.platform !== 'darwin') {
    //     app.quit()
    // }
})

app.on('activate', () => {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (win === null) {
        createWindow()
        setWindowInstance(win)
    }
})

app.on('will-quit', () => {
    destroyTrayIcon()
    ClashBinary.killClash()
})

ipcMain.on('IPC_MESSAGE_QUEUE', (event, args) => {
    dispatchIPCCalls(args)
})

function dispatchIPCCalls(event) {
    switch (event.__name) {
        case BRG_MSG_START_CLASH:
            ClashBinary.spawnClash()
            break
        case BRG_MSG_ADD_SUBSCRIBE:
            addSubscription(event.arg).then(() => {
                resolveIPCCall(event, event.__callbackId)
            }).catch(e => {
                console.error(e)
                deleteSubscription(event.arg)
                    .catch(e => console.log(e))
                    .finally(() => {
                        rejectIPCCall(event, event.__callbackId, e)
                    })
            })
            break
        case BRG_MSG_UPDATE_SUBSCRIBE:
            updateSubscription(event.arg).then(() => {
                resolveIPCCall(event, event.__callbackId)
            }).catch(e => {
                console.error(e)
                rejectIPCCall(event, event.__callbackId, e)
            })
            break
        case BRG_MSG_FETCH_PROFILES:
            fetchProfiles().then((result) => {
                resolveIPCCall(event, event.__callbackId, result)
            }).catch(e => {
                rejectIPCCall(event, event.__callbackId, e)
            })
            break
        case BRG_MSG_SWITCHED_PROFILE:
            setProfile(event.arg)
            resolveIPCCall(event, event.__callbackId, null)
            break
        case BRG_MSG_SWITCHED_PROXY:
            setProxy(event.selector, event.proxy)
            resolveIPCCall(event, event.__callbackId, null)
            break
        case BRG_MSG_DELETE_SUBSCRIBE:
            deleteSubscription(event.arg)
                .then(() => {
                    if (event.arg === getCurrentConfig().currentProfile) {
                        setProxy('', '')
                    }
                    resolveIPCCall(event, event.__callbackId, {})
                })
                .catch(e => rejectIPCCall(event, event.__callbackId, e))
            break
        case BRG_MSG_OPEN_CONFIG_FOLDER:
            openConfigFolder()
            break
        case BRG_MSG_OPEN_LINK:
            openLink(event.arg)
            break
        case BRG_MSG_GET_LOGIN_ITEM:
            resolveIPCCall(event, event.__callbackId, getStartWithSystem())
            break
        case BRG_MSG_SET_LOGIN_ITEM:
            setStartWithSystem(event.arg)
            resolveIPCCall(event, event.__callbackId, null)
            break
        case BRG_MSG_GET_CLASHY_CONFIG:
            resolveIPCCall(event, event.__callbackId, getCurrentConfig())
            break
        case BRG_MSG_SET_SYSTEM_PROXY:
            setAsSystemProxy(event.arg)
            resolveIPCCall(event, event.__callbackId, null)
            break
        case BRG_MSG_CHECK_DELAY:
            batchRequestDelay(event.arg)
                .then(results => {
                    resolveIPCCall(event, event.__callbackId, results)
                })
                .catch(e => {
                    rejectIPCCall(event, event.__callbackId, e)
                })
            break
        default:
            break
    }
}

function resolveIPCCall(event, callbackId, result) {
    if (win == null) {
        return
    }
    win.webContents.send('IPC_MESSAGE_QUEUE', {
        __callbackId: callbackId,
        event,
        value: result
    })
}

function rejectIPCCall(event, callbackId, error) {
    if (win == null) {
        return
    }
    win.webContents.send('IPC_MESSAGE_QUEUE_REJECT', {
        __callbackId: callbackId,
        event,
        value: error
    })
}

function setMainMenu() {
    if (process.platform !== 'darwin') {
        return
    }
    const template = [
        {
            label: app.getName(),
            submenu: [
              { role: 'about' },
              { type: 'separator' },
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideothers' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'copy' },
                { role: 'cut' },
                { role: 'paste' },
            ]
        }
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  }