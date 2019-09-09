import { all, fork } from 'redux-saga/effects'
import * as generalSagas from './general-sagas'
import * as proxiesSagas from './proxies-saga'
import * as profilesSagas from './profiles-saga'

const general = generalSagas as {[key: string]: any}
const proxies = proxiesSagas as {[key: string]: any}
const profiles = profilesSagas as {[key: string]: any}

export default function* root() {
    yield all([
        ...Object.keys(generalSagas).map(key => fork(general[key])),
        ...Object.keys(proxiesSagas).map(key => fork(proxies[key])),
        ...Object.keys(profilesSagas).map(key => fork(profiles[key]))
    ])
}
