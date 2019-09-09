export interface ProxyHistory {
    time: string,
    delay: number
}

export interface Selector {
    all?: string[],
    now?: string,
    history?: ProxyHistory[],
    type: string
}

export interface Proxies {
    [key: string]: Selector
}

export interface ClashConfig {
    port: number,
    'socks-port': number,
    'allow-lan': boolean,
    mode: string,
    'log-level': string
}

export interface ClashyConfig {
    startWithSystem?: boolean
    systemProxy?: boolean
}

export interface ClashyProfile {
    name: string,
    url: string
}
