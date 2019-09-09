import { request, requestChunk, ChunkCallback } from './base'
const CONFIG_URL = '/configs'
const PROXIES_URL = '/proxies'

export async function requestClashConfigs() {
    return request(CONFIG_URL)
}

export async function requestSaveClashConfigs(configs: any) {
    return request(`${CONFIG_URL}`, 'PATCH', {}, { ...configs })
}

export async function requestClashProxies() {
    return request(PROXIES_URL)
}

export async function requestSwitchProxy(selector: string, proxy: string) {
    return request(`${PROXIES_URL}/${selector}`, 'PUT', {}, { name: proxy })
}

export async function requestSwitchConfigs(path: string) {
    return request(`${CONFIG_URL}`, 'PUT', {}, { path })
}

export async function requestTraffic(onReceive: ChunkCallback) {
    requestChunk('/traffic', 'GET', onReceive)
}

export async function requestDelay(proxy: string) {
    return request(`${PROXIES_URL}/${proxy}/delay?timeout=10000&url=https%3A%2F%2Fwww.google.com`, 'GET', {})
}

export async function batchRequestDelay(proxies: string[]) {
    const requests = proxies.map(each => requestDelay(each))
    return Promise.all(requests)
}
