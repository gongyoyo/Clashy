const fs = require('fs')
const {
    openFile,
    writeFile,
    httpsGet,
    deleteFile,
    closeFile,
    fetchHttp,
    getAppPath,
    getDataPath,
    writeStream
} = require('./utils')
const path = require('path')
const URL = require('url')
const { createSubscriptionFileIfNeeded } = require('./configs-manager')

const emptySubscriptions = {
    subscriptions: []
}

async function getSavedSubscriptions() {
    await createSubscriptionFileIfNeeded()
    const file = path.join(getDataPath(), 'clashy-configs', 'subscriptions.json')
    const content = fs.readFileSync(file)
    if (content == null || content.length === 0) {
        const fd = await openFile(file, 'w+')
        await writeFile(fd, JSON.stringify(emptySubscriptions))
        await closeFile(fd)
        return Promise.resolve({
            ...emptySubscriptions
        })
    }
    try {
        return JSON.parse(content)
    } catch(e) {
        const fd = await openFile(file, 'w+')
        await writeFile(fd, JSON.stringify(emptySubscriptions))
        await closeFile(fd)
        return Promise.resolve({
            ...emptySubscriptions
        })
    }
}

async function _saveSubscriptions(subscriptions) {
    const file = path.join(getDataPath(), 'clashy-configs', 'subscriptions.json')
    const fd = await openFile(file, 'w+')
    await writeFile(fd, JSON.stringify(subscriptions))
    await closeFile(fd)
}

async function _addSubscriptions(subscriptions) {
    const current = await getSavedSubscriptions()
    current.subscriptions = (current.subscriptions || []).concat(subscriptions)
    _saveSubscriptions(current)
}

async function deleteSubscription(fileName) {
    if (fileName == null || fileName.length === 0) {
        return Promise.resolve()
    }
    const current = await getSavedSubscriptions()
    const idx = (current.subscriptions || []).findIndex((each) => {
        return each.fileName === fileName
    })
    if (idx >= 0) {
        const del = current.subscriptions.splice(idx, 1)[0]
        await deleteFile(del.fileName)
    }
    await _saveSubscriptions(current)
}

async function addSubscription(url) {
    if (url == null || url.length === 0) {
        return Promise.reject(new Error('Malformed URL'))
    }
    const parsedUrl = URL.parse(url)
    const name = parsedUrl.host + (parsedUrl.path == null ? '' : parsedUrl.path.replace(/[\/\?\\]/g, '_'))
    const fileName = path.join(getDataPath(), 'clash-configs', `${name}.yml`)
    const fd = await openFile(fileName, 'w+')
    await writeFile(fd, '')
    let resp = null
    if (url.startsWith('https://')) {
        resp = await httpsGet(url)
    } else {
        resp = await fetchHttp(url, 'GET')
    }
    const stream = fs.createWriteStream(fileName)
    await writeStream(stream, resp)
    stream.close()
    await _addSubscriptions([{
        fileName,
        url
    }])
}

async function updateSubscription(fileName) {
    if (fileName == null || fileName.length === 0) {
        return Promise.resolve()
    }
    const saved = await getSavedSubscriptions()
    const target = (saved.subscriptions || []).find(each => {
        return each.fileName === fileName
    })
    const url = target.url
    let resp = null
    if (url.startsWith('https://')) {
        resp = await httpsGet(url)
    } else {
        resp = await  fetchHttp(url)
    }
    // Purge current config content
    const fd = await openFile(fileName, 'w+')
    await writeFile(fd, '')
    await closeFile(fd)

    // Write current config content
    const stream = fs.createWriteStream(fileName)
    await writeStream(stream, resp)
    stream.close()
}

module.exports = {
    addSubscription,
    deleteSubscription,
    updateSubscription
}
