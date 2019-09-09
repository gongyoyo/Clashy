const promisify = require('util').promisify
const fs = require('fs')
const path = require('path')
const configs = require('./configs-manager')
const { fetchHttp, getDataPath } = require('./utils')

const readDir = promisify(fs.readdir)

const BASE_URL = 'http://localhost:2390'

function fetchProfiles() {
    const folderName = path.resolve(getDataPath(), 'clash-configs')
    return readDir(folderName).then(folderContents => {
        const profiles = folderContents
            .filter(each => each.endsWith('.yaml') || each.endsWith('yml'))
            .map(each => {
                const fullPath = path.resolve(path.join(folderName, each))
                return {
                    name: each,
                    url: fullPath,
                }
            })
        const { currentProfile } = configs.getCurrentConfig()
        return {
            profiles,
            currentProfile
        }
    })
}

async function switchToCurrentProfile() {
    const { currentProfile, currentSelector, currentProxy } = configs.getCurrentConfig()
    await fetchHttp(`${BASE_URL}/configs`, 'PUT', {
        path: currentProfile
    })
    const body = {
        name: currentProxy
    }
    return await fetchHttp(`${BASE_URL}/proxies/${currentSelector}`, 'PUT', body)

}

module.exports = {
    fetchProfiles,
    switchToCurrentProfile
}