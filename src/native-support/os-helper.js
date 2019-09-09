const { exec } = require('child_process')
const { getDataPath } = require('./utils')
const { app, clipboard } = require('electron')
const path = require('path')
const { isElectronDebug } = require('./utils')
const { saveStartWithSystem, setSystemProxy, getCurrentConfig } = require('./configs-manager')

function setAsSystemProxy(systemProxy) {
    setSystemProxy(systemProxy)
    switch (process.platform) {
        case 'win32':
            _setSystemProxyForWindows(systemProxy)
            break
        case 'darwin':
            _setSystemProxyForMac(systemProxy)
            break
        default:
            break
    }
}

function _setSystemProxyForMac(systemProxy) {
    const adapter = `"$(networksetup -listallnetworkservices | head -2 | tail -1)"`
    exec(`networksetup -setwebproxy ${adapter} 127.0.0.1 2340 && networksetup -setwebproxystate ${adapter} ${systemProxy ? "on" : "off"}`)
}

function _setSystemProxyForWindows(systemProxy) {
    let cmd = ''
    const executable = path.resolve(path.join(!isElectronDebug() ? process.resourcesPath : '.', 'vendor', 'sysproxy', 'sysproxy.exe'))
    if (systemProxy) {    
        const port = getCurrentConfig().httpPort || '2340'
        cmd = `${executable} global 127.0.0.1:${port}`
    } else {
        cmd = `${executable} off`
    }
    exec(cmd)
}

function openConfigFolder() {
    const folder = path.join(getDataPath(true), 'clash-configs')
    switch (process.platform) {
        case 'linux':
            _openFolderLinux(folder)
            break
        case 'win32':
            _openFolderWindows(folder)
            break
        case 'darwin':
            _openFolderMac(folder)
            break
        default:
            break
    }
}

function _openFolderWindows(folder) {
    exec(`explorer ${folder}`)
}

function _openFolderMac(folder) {
    exec(`open ${folder}`)
}

function _openFolderLinux(folder) {
    exec(`xdg-open ${folder}`)
}

function openLink(link) {
    switch (process.platform) {
        case 'linux':
            _openLinkLinux(link)
            break
        case 'win32':
            _openLinkWindows(link)
            break
        case 'darwin':
            _openLinkMac(link)
            break
        default:
            break
    }
}

function _openLinkMac(link) {
    exec(`open ${link}`)
}

function _openLinkWindows(link) {
    exec(`explorer ${link}`)
}

function _openLinkLinux(link) {
    exec(`xdg-open ${link}`)
}

function setStartWithSystem(start) {
    // if (isElectronDebug()) {
    //     return
    // }
    saveStartWithSystem(start)
    app.setLoginItemSettings({
        openAtLogin: start,
        openAsHidden: true
    })
}

function getStartWithSystem() {
    return app.getStartWithSystem().openAtLogin
}

function copyExportCommand() {
    const { httpPort, socksPort } = getCurrentConfig()
    const url = 'http://127.0.0.1'
    clipboard.writeText(
        `export https_proxy=${url}:${httpPort};export http_proxy=${url}:${httpPort};export all_proxy=socks5h://127.0.0.1:${socksPort}`
        )
}

module.exports = {
    setAsSystemProxy,
    openConfigFolder,
    openLink,
    setStartWithSystem,
    getStartWithSystem,
    copyExportCommand
}
