import { Record } from 'immutable'

import { ClashyProfile } from '../../apis'
import { TProfilesAction, ProfilesAction } from '../actions/profiles-actions'

interface _ProfilesState {
    profiles: ClashyProfile[],
    currentProfile: string,
    loading: boolean
    error?: any
}

export type ProfilesState = Record<_ProfilesState>

const initialStateFactory = Record<_ProfilesState>({
    profiles: [],
    currentProfile: '',
    loading: false,
    error: null
})

const initialState = initialStateFactory()

export function profiles(state: ProfilesState = initialState, action: TProfilesAction) {
    switch (action.type) {
        case ProfilesAction.GOT_PROFILES:
            return state
                    .set('profiles', action.profiles || [])
                    .set('currentProfile', action.profile || '')
                    .set('loading', false)
                    .set('error', null)
        case ProfilesAction.GOT_ERROR:
            return state.set('error', action.error).set('loading', false)
        case ProfilesAction.CLEAR_ERROR:
            return state.set('error', null)
        case ProfilesAction.TOGGLE_LOADING:
            return state.set('loading', action.loading || false)
    }
    return state
}
