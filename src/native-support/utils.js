const fs = require('fs')
const https = require('https')
const http = require('http')
const promisify = require('util').promisify
const { app } = require('electron')

const openFile = promisify(fs.open)
const writeFile = promisify(fs.write)
const deleteFile = promisify(fs.unlink)
const fileExists = promisify(fs.exists)
const closeFile = promisify(fs.close)
const mkDir = promisify(fs.mkdir)
const copyFile = promisify(fs.copyFile)

function writeStream(stream, content) {
    return new Promise((resolve, reject) => {
        stream.write(content, () => {
            resolve()
        })
    })
}

function isElectronDebug() {
    return process.env.NODE_ENV === 'development'
}

function isWindows() {
    return process.platform === 'win32'
}

function isLinux() {
    return process.platform === 'linux'
}

function httpsGet(url) {
    return new Promise((resolve, reject) => {
        https.get(url, function (res) {
            let data = ''
            res.on('error', e => reject(e))
            res.on('data', chunk => { data += chunk })
            res.on('end', () => resolve(data))
        }).on('error', err => reject(err))
    })
}

function fetchHttp(url, method, params) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(params || {})
        const options = {
            method: method == null || method.length === 0 ? 'GET' : method,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }
        const req = http.request(url, options, resp => {
            let data = ''
            resp.on('error', e => reject(e))
            resp.on('data', chunk => { data += chunk})
            resp.on('end', () => resolve(data))
        }).on('error', err => reject(err))
        req.write(data)
        req.end()
    })
}

function getAppPath() {
    if (!isElectronDebug()) {
        return process.resourcesPath
    }
    return app.getAppPath()
}

function getDataPath(escape = false) {
    const ret = app.getPath('userData')
    if (!escape) {
        return ret
    }
    return ret.replace(/ /g, '\\ ')
}

module.exports = {
    isElectronDebug,
    isWindows,
    isLinux,
    openFile,
    writeFile,
    deleteFile,
    closeFile,
    fileExists,
    mkDir,
    writeStream,
    copyFile,
    httpsGet,
    fetchHttp,
    getAppPath,
    getDataPath
}
