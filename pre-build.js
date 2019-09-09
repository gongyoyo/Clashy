const https = require('https')
const path = require('path')
const fs = require('fs')
const request = require('request')

const prefix = 'https://github.com/Dreamacro/clash/releases/download'
const version = 'v0.15.0'
const binary_name = 'clash'

async function downloadClashBinary() {
    let platform = ''
    let arch = ''
    let ext = ''
    let url = ''
    let fileName = ''
    switch(process.platform) {
        case 'darwin':
            platform = 'darwin'
            arch='amd64'
            ext = '.gz'
            break
        case 'win32':
            platform = 'windows'
            if (process.arch === 'x64') {
                arch = 'amd64'
                ext = '.zip'
            } else {
                arch = '386'
                ext = '.zip'
            }
            break
        case 'linux':
            platform = 'linux'
            if (process.arch === 'x64') {
                arch = 'amd64'
                ext = '.gz'
            } else {
                arch = '386'
                ext = '.gz'
            }
            break
        default:
            break
    }
    url = `${prefix}/${version}/${binary_name}-${platform}-${arch}-${version}${ext}`
    fileName = `clash-${platform}-${arch}${platform === 'windows' ? '.exe' : ''}`
    const filePath = path.join('.', 'clash-binaries', fileName + ext)
    if (fs.existsSync(filePath)) {
        console.log(`Clash binary exists for Platform: ${platform}, Arch: ${arch}`)
        return Promise.resolve()
    }
    const fos = fs.createWriteStream(filePath)
    return new Promise((resolve, reject) => {
        console.log(`Prepare to download Clash binary for Platform ${platform}, Arch: ${arch}`)
        request.get(url)
            .on('finish', () => {
                resolve()
            })
            .on('error', () => {
                reject()
            })
            .pipe(fos)
    })
}

downloadClashBinary().then(() => {
    console.log('Clash binary downloaded.')
}).catch(e => {
    console.error(e)
})