const { ipcRenderer } = require('electron')

function injectMessageQueue() {
    window.electronIPC = ipcRenderer
}

injectMessageQueue()
