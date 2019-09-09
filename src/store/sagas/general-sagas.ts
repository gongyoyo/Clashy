import { take, put, call } from 'redux-saga/effects'
import { TGeneralAction, gotConfigs, gotErrorGeneral, GeneralActions, toggleSaving, fetchClashyConfigs, gotClashy } from '../actions'
import { requestClashConfigs, requestSaveClashConfigs } from '../../apis'
import { callIPC } from '../../native-support/message-queue'
import { BRG_MSG_GET_CLASHY_CONFIG } from '../../native-support/message-constants'

export function *watchFetchConfigs() {
    while (true) {
        yield take(GeneralActions.fetchConfigs)
        try {
            const result = yield call(requestClashConfigs)
            yield put(gotConfigs(result))
            const clashy = yield call(callIPC, BRG_MSG_GET_CLASHY_CONFIG)
            yield put(gotClashy(clashy))
        } catch (e) {
            yield put(gotErrorGeneral(e))
        }

    }
}

export function *watchSaveConfigs() {
    while (true) {
        const action: TGeneralAction = yield take(GeneralActions.saveConfigs)
        try {
            yield put(toggleSaving(true))
            yield call(requestSaveClashConfigs, action.configs)
            yield put({ type: GeneralActions.fetchConfigs })
            yield put(toggleSaving(false))
        } catch (e) {
            yield put(toggleSaving(false))
            yield put(gotErrorGeneral(e))
        }
    }
}
