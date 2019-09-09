import { ClashyProfile } from '../../apis'

export enum ProfilesAction {
    FETCH_PROFILES = 'PROFILES_FETCH_PROFILES',
    GOT_PROFILES = 'PROFILES_GOT_PROFILES',
    ADD_PROFILE = 'PROFILES_ADD_PROFILE',
    UPDATE_PROFILE = 'PROFILES_UPDATE_PROFILE',
    DELETE_PROFILE = 'PROFILES_DELETE_PROFILE',
    USE_PROFILE = 'PROFILES_USE_PROFILE',
    GOT_ERROR = 'PROFILES_GOT_ERROR',
    CLEAR_ERROR = 'PROFILES_CLEAR_ERROR',
    TOGGLE_LOADING = 'PROFILES_TOGGLE_LOADING'
}

export interface TProfilesAction {
    type: ProfilesAction,
    url?: string,
    profile?: string,
    profiles?: ClashyProfile[],
    error?: any
    loading?: boolean
}

export function fetchProfiles() {
    return {
        type: ProfilesAction.FETCH_PROFILES
    }
}

export function gotProfiles(profiles: ClashyProfile[], profile: string) {
    return {
        type: ProfilesAction.GOT_PROFILES,
        profiles,
        profile
    }
}

export function addProfile(url: string) {
    return {
        type: ProfilesAction.ADD_PROFILE,
        url
    }
}

export function updateProfile(profile: string) {
    return {
        type: ProfilesAction.UPDATE_PROFILE,
        profile
    }
}

export function switchProfile(profile: string) {
    return {
        type: ProfilesAction.USE_PROFILE,
        profile
    }
}

export function profilesGotError(error: any) {
    return {
        type: ProfilesAction.GOT_ERROR,
        error
    }
}

export function profilesClearError() {
    return {
        type: ProfilesAction.CLEAR_ERROR
    }
}

export function deleteProfile(url: string) {
    return {
        type: ProfilesAction.DELETE_PROFILE,
        profile: url
    }
}

export function toggleLoading(loading: boolean) {
    return {
        type: ProfilesAction.TOGGLE_LOADING,
        loading
    }
}
