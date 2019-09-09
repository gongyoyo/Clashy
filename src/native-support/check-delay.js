const { fetchHttp } = require('./utils')

const PROXIES_URL = 'http://127.0.0.1:2390/proxies'

async function requestDelay(proxy) {
    return fetchHttp(`${PROXIES_URL}/${proxy}/delay?timeout=10000&url=https%3A%2F%2Fwww.google.com`, 'GET', {})
        .then(r => {
            return Promise.resolve(JSON.parse(r))
        })
}

async function batchRequestDelay(proxies) {
    const requests = proxies.map(each => requestDelay(each))
    return Promise.all(requests)
}

module.exports = {
    batchRequestDelay
}