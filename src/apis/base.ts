import { Indexed } from '../utils'

const BASE_URL = 'http://localhost:2390'

const getHeader = () => {
    return {
        'Content-Type': 'application/json; charset=utf-8'
    }
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH'

interface RequestParam {
    method: Method,
    headers: Headers,
    mode: 'cors' | 'same-origin',
    body?: string
}

export async function request(url: string, method: Method = 'GET', header?: Indexed, body?: Indexed, cors = true) {
    const mergedHeaders = Object.assign(getHeader(), header)
    const params: RequestParam = {
        method: method,
        headers: new Headers(mergedHeaders),
        mode: cors ? 'cors' : 'same-origin'
    }
    if (body !== undefined) {
        params.body = JSON.stringify(body)
    }
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + url, {
            ...params
        }).then(resp => {
            return resp.text()
        }).then(text => {
            if (text == null || text.length === 0) {
                resolve(null)
            } else {
                resolve(JSON.parse(text))
            }
        }).catch(err => {
            reject(err)
        })
    })
}

export type ChunkCallback = (chunk: string) => void

export async function requestChunk(url: string, method: Method = 'GET', onReceive: ChunkCallback, header?: Indexed, body?: Indexed, cors = true) {
    const mergedHeaders = Object.assign(getHeader(), header)
    const params: RequestParam = {
        method: method,
        headers: new Headers(mergedHeaders),
        mode: cors ? 'cors' : 'same-origin'
    }
    if (body !== undefined) {
        params.body = JSON.stringify(body)
    }
    const resp = await fetch(BASE_URL + url, { ...params })
    if (resp.body == null) {
        return Promise.reject()
    }
    const reader = resp.body.getReader()
    let done = false
    while (!done) {
        const result = await reader.read()
        done = result.done
        const value = result.value || []
        let str = ''
        for (let i = 0; i < value.length; i++) {
            str += String.fromCharCode(value[i])
        }
        onReceive(str)
    }
}
