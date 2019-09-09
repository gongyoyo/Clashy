import { Record, Map, fromJS } from 'immutable'
import { ProxiesAction, TProxiesAction, TProxyDelay } from '../actions'
import { Proxies, Selector } from '../../apis'

const NON_SELECTOR_KEYS = ['ALL', 'GLOBAL', 'DIRECT', 'REJECT']

interface _ProxiesState {
    proxies: {[key: string]: Selector}
    delaies: Map<string, number>
    testingSpeed: boolean
    currentSelector: string
    error?: any
}

export type ProxiesState = Record<_ProxiesState>

const initialStateFactory = Record<_ProxiesState>({
    proxies: {},
    delaies: Map(),
    testingSpeed: false,
    currentSelector: '',
    error: null
})

const initialState = initialStateFactory()

export function proxies(state: ProxiesState = initialState, action: TProxiesAction): ProxiesState {
    if (action == null || action.type == null) {
        return state
    }
    switch (action.type) {
        case ProxiesAction.gotProxies: {
            const filtered = filterSelectors(action.proxies)
            return state
                .set('proxies', filtered.proxies)
                .set('currentSelector', filtered.selector)
        }
        case ProxiesAction.gotError:
            return state.set('error', action.error)
        case ProxiesAction.checkProxyDelay:
            return state.set('testingSpeed', true)
        case ProxiesAction.gotProxyDelay:
            return populateDelaies(action, state)
        case ProxiesAction.delayChecked:
            return state.set('testingSpeed', false)
        default:
            break
    }
    return state
}

function filterSelectors(proxies?: Proxies) {
    if (proxies == null) {
        return { proxies: {}, selector: '', proxy: '' }
    }
    const keys = Object.keys(proxies)
    const validKeys = keys.filter(each => {
        return proxies[each].type === 'Selector' && NON_SELECTOR_KEYS.indexOf(each) < 0
    })
    let selector = ''
    const ret: {[key: string]: Selector} = {}
    validKeys.map(each => {
        const value = proxies[each]
        ret[each] = value
        if (value.now != null && value.now.length !== 0) {
            selector = each
        }
        return each
    })
    return {
        proxies: ret,
        selector
    }
}

function populateDelaies(action: TProxiesAction, state: ProxiesState) {
    let delaies = state.get('delaies')
    let newDelaies = action.delaies || {}
    const batch = Object.keys(newDelaies)
    if (batch.length <= 0) {
        return state
    }
    batch.map(b => {
        delaies = delaies.set(b, newDelaies[b])
    })
    return state.set('delaies', delaies)
}
