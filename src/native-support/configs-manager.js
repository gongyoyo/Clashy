const path = require('path')
const fs = require('fs')
const {
    getAppPath,
    getDataPath,
    fileExists,
    mkDir,
    copyFile,
    isElectronDebug
} = require('./utils')

async function initialConfigsIfNeeded() {
    await _createClashyConfigsIfNeeded()
    await createSubscriptionFileIfNeeded()
    await _createClashConfigsIfNeeded()
}

function getConfigPath() {
    return path.join(getDataPath(), 'clashy-configs', 'configs.json')
}

function getDefaultClashConfig() {
    return path.join(getDataPath(), 'clash-configs', 'config.yaml')
}

function getInitialConfig() {
    return {
        controllerPort: '2390',
        secret: '',
        currentProfile: getDefaultClashConfig(),
        currentProxy: '',
        currentSelector: '',
        systemProxy: false,
        socksPort: 2341,
        httpPort: 2340,
        startWithSystem: false
    }
}

function getCurrentConfig() {
    const fileName = getConfigPath()
    let content = fs.readFileSync(fileName)
    if (content == null || content.length === 0) {
        content = JSON.stringify(getInitialConfig(), null, 4)
        fs.writeFileSync(fileName, content)
    }
    try {
        return JSON.parse(content)
    } catch (e) {
        return getInitialConfig()
    }
}

function saveConfig(config) {
    fs.writeFileSync(getConfigPath(), JSON.stringify(config))
}

function setSecret(secret) {
    saveConfig({
        ...getCurrentConfig(),
        secret: secret || ''
    })
}

function setProxy(selector, proxy) {
    saveConfig({
        ...getCurrentConfig(),
        currentProxy: proxy || '',
        currentSelector: selector || ''
    })
}

function saveStartWithSystem(startWithSystem) {
    saveConfig({
        ...getCurrentConfig(),
        startWithSystem
    })
}

function setSystemProxy(systemProxy) {
    saveConfig({
        ...getCurrentConfig(),
        systemProxy
    })
}

function setProfile(profile) {
    if (profile == null || profile.length === 0) {
        profile = getDefaultClashConfig()
    }
    saveConfig({
        ...getCurrentConfig(),
        currentProfile: profile
    })
}

function setHttpPort(httpPort) {
    saveConfig({
        ...getCurrentConfig(),
        httpPort
    })
}

function setSocksPort(socksPort) {
    saveConfig({
        ...getCurrentConfig(),
        socksPort
    })
}

async function createSubscriptionFileIfNeeded() {
    const subscriptions = path.join(getDataPath(), 'clashy-configs', 'subscriptions.json')
    const exist = await fileExists(subscriptions)
    if (!exist) {
        if (isElectronDebug()) {
            console.log('Subscription file not exist, creating...')
        }
        let fd = fs.openSync(subscriptions, 'w+')
        fs.closeSync(fd)
        fs.writeFileSync(subscriptions, '{"subscriptions" : []}')
        if (isElectronDebug()) {
            console.log('Created subscription file.')
        }
    }
}

async function _createClashyConfigsIfNeeded() {
    const clashyConfigs = path.join(getDataPath(), 'clashy-configs')
    let exist = await fileExists(clashyConfigs)
    if (!exist) {
        if (isElectronDebug()) {
            console.log('Clashy configs not exist, creating...')
        }
        await mkDir(clashyConfigs)
    }
    const clashyConfigFile = path.join(getDataPath(), 'clashy-configs', 'configs.json')
    exist = await fileExists(clashyConfigFile)
    if (!exist) {
        let fd = fs.openSync(clashyConfigFile, 'w+')
        fs.closeSync(fd)
        fs.writeFileSync(clashyConfigFile, '')
        if (isElectronDebug()) {
            console.log('Created Clashy configs.')
        }
    }
}

async function _createClashConfigsIfNeeded() {
    const clashConfigs = path.join(getDataPath(), 'clash-configs')
    const exist = await fileExists(clashConfigs)
    if (!exist) {
        if (isElectronDebug()) {
            console.log('Clash configs not exist, creating...')
        }
        await mkDir(clashConfigs)
        const defaultConfig = path.resolve(getAppPath(), 'clash-configs', 'config.yaml')
        await copyFile(defaultConfig, path.resolve(clashConfigs, 'config.yaml'))
        const mmdb = path.resolve(getAppPath(), 'clash-configs', 'Country.mmdb')
        await copyFile(mmdb, path.resolve(clashConfigs, 'Country.mmdb'))
        if (isElectronDebug()) {
            console.log('Clash configs & mmdb created.')
        }
    }
}

module.exports = {
    getCurrentConfig,
    setSecret,
    setProfile,
    setProxy,
    setHttpPort,
    setSocksPort,
    initialConfigsIfNeeded,
    createSubscriptionFileIfNeeded,
    saveStartWithSystem,
    setSystemProxy
}