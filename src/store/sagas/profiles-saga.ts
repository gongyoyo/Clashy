import { take, call, put } from 'redux-saga/effects'
import { ProfilesAction, gotProfiles, profilesGotError, TProfilesAction, fetchProfiles, toggleLoading } from '../actions/profiles-actions'
import { callIPC } from '../../native-support/message-queue'
import {
    BRG_MSG_FETCH_PROFILES,
    BRG_MSG_ADD_SUBSCRIBE,
    BRG_MSG_SWITCHED_PROFILE,
    BRG_MSG_DELETE_SUBSCRIBE,
    BRG_MSG_UPDATE_SUBSCRIBE
} from '../../native-support/message-constants'
import { requestSwitchConfigs } from '../../apis'

export function *watchFetchProfiles() {
    while (true) {
        yield take(ProfilesAction.FETCH_PROFILES)
        try {
            yield put(toggleLoading(true))
            const result = yield call(callIPC, BRG_MSG_FETCH_PROFILES)
            yield put(gotProfiles(result.profiles || [], result.currentProfile || ''))
        } catch (e) {
            yield put(toggleLoading(false))
            yield put(profilesGotError(e))
        }
    }
}

export function *watchAddProfile() {
    while (true) {
        const action: TProfilesAction = yield take(ProfilesAction.ADD_PROFILE)
        try {
            yield put(toggleLoading(true))
            const result = yield call(callIPC, BRG_MSG_ADD_SUBSCRIBE, action.url)
            yield put({ type: ProfilesAction.FETCH_PROFILES })
        } catch (e) {
            yield put(toggleLoading(false))
            yield put(profilesGotError(e))
        }
    }
}

export function *watchUpdateProfile() {
    while (true) {
        const action: TProfilesAction = yield take(ProfilesAction.UPDATE_PROFILE)
        try {
            yield put(toggleLoading(true))
            yield call(callIPC, BRG_MSG_UPDATE_SUBSCRIBE, action.profile)
            yield put({ type: ProfilesAction.FETCH_PROFILES })
        } catch (e) {
            yield put(toggleLoading(false))
            yield put(profilesGotError(e))
        }
    }
}

export function *watchSwitchProfile() {
    while (true) {
        const action: TProfilesAction = yield take(ProfilesAction.USE_PROFILE)
        try {
            yield put(toggleLoading(true))
            const result = yield call(requestSwitchConfigs, action.profile || '')
            if (result == null) {
                yield call(callIPC, BRG_MSG_SWITCHED_PROFILE, action.profile)
                yield put({ type: ProfilesAction.FETCH_PROFILES })
            }
        } catch (e) {
            yield put(toggleLoading(false))
            yield put(profilesGotError(e))
        }
    }
}

export function *watchDeleteProfile() {
    while (true) {
        const action: TProfilesAction = yield take(ProfilesAction.DELETE_PROFILE)
        try {
            yield put(toggleLoading(true))
            yield call(callIPC, BRG_MSG_DELETE_SUBSCRIBE, action.profile || '')
            yield put(fetchProfiles())
        } catch (e) {
            yield put(toggleLoading(false))
            yield put(profilesGotError(e))
        }
    }
}
