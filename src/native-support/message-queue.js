const resolves = {}
const rejections = {}

export function callIPC(name, params) {
    if (!window.electronIPC || !window.electronIPC.send) {
        return new Promise((resolve, reject) => null)
    }
    let typed = {}
    if (typeof params != 'object') {
        typed = { arg: params }
    } else {
        typed = Object.assign({}, params)
    }

    return new Promise(function(resolve, reject) {
        const callbackId = '' + Math.random()
        typed.__name = name
        typed.__callbackId = callbackId
        window.electronIPC.send('IPC_MESSAGE_QUEUE', typed)
        resolves[callbackId] = resolve
        rejections[callbackId] = reject
    })
}

export function subscribeIPC() {
    if (!window.electronIPC || !window.electronIPC.on) {
        return
    }
    window.electronIPC.on('IPC_MESSAGE_QUEUE', function(event, args) {
        const callbackId = args.__callbackId
        if (!callbackId || callbackId.length === 0) {
            return
        }
        const callback = resolves[callbackId]
        if (!callback) {
            return
        }
        callback(args.value)
        resolves[callbackId] = undefined
    })
    window.electronIPC.on('IPC_MESSAGE_QUEUE_REJECT', function(event, args) {
        const callbackId = args.__callbackId
        if (!callbackId || callbackId.length === 0) {
            return
        }
        const callback = rejections[callbackId]
        if (!callback) {
            return
        }
        callback(args.value)
        rejections[callbackId] = undefined
    })
}
