import { Proxies } from '../../apis'

export enum ProxiesAction {
    fetchProxies = 'PROXIES_FETCH_PROXIES',
    gotProxies = 'PROXIES_GOT_PROXIES',
    gotError = 'PROXIES_GOT_ERROR',
    switchProxy = 'PROXIES_SWITCH_PROXY',
    checkProxyDelay = 'PROXIES_CHECK_PROXY_DELAY',
    gotProxyDelay = 'PROXIES_GOT_PROXY_DELAY',
    // checkingDelay = 'PROXIES_CHECKING_DELAY',
    delayChecked = 'PROXIES_DELAY_CHECKED'
}

export interface TProxiesAction {
    type: ProxiesAction
    proxies?: Proxies
    selector?: string
    proxy?: string
    delaies?: {[key: string]: number}
    error?: any
}

export interface TProxyDelay {
    delay: number
}

export function fetchProxies(): TProxiesAction {
    return {
        type: ProxiesAction.fetchProxies
    }
}

export function gotProxies(proxies: Proxies): TProxiesAction {
    return {
        type: ProxiesAction.gotProxies,
        proxies
    }
}

export function switchProxy(selector: string, proxy: string): TProxiesAction {
    return {
        type: ProxiesAction.switchProxy,
        selector,
        proxy
    }
}

export function gotErrorProxies(error: any): TProxiesAction {
    return {
        type: ProxiesAction.gotError,
        error
    }
}

export function checkProxiesDelay(): TProxiesAction {
    return {
        type: ProxiesAction.checkProxyDelay
    }
}

export function gotProxyDelay(delaies: {[key: string]: number}): TProxiesAction {
    return {
        type: ProxiesAction.gotProxyDelay,
        delaies
    }
}

// export function delayChecked(): TProxiesAction {
//     return {
//         type: ProxiesAction.delayChecked
//     }
// }

// export function checkingDelay(): TProxiesAction {
//     return {
//         type: ProxiesAction.checkingDelay
//     }
// }
