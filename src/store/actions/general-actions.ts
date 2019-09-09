import { ClashConfig, ClashyConfig } from '../../apis'

export enum GeneralActions {
    fetchConfigs = 'GENERAL_FETCH_CONFIGS',
    fetchClashy = 'GENERAL_FETCH_CLASHY',
    saveConfigs = 'GENERAL_SAVE_CONFIGS',
    toggleSaving = 'GENERAL_TOGGLE_SAVING',
    gotConfigs = 'GENERAL_GOT_CONFIGS',
    gotClashy = 'GENERAL_GOT_CLASHY',
    gotError = 'GENERAL_GOT_ERROR'
}

export interface TGeneralAction {
    type: GeneralActions
    saving?: boolean
    configs?: ClashConfig
    clashy?: ClashyConfig
    error?: any
}

export function fetchConfigs(): TGeneralAction {
    return {
        type: GeneralActions.fetchConfigs
    }
}

export function saveConfigs(configs: ClashConfig): TGeneralAction {
    return {
        type: GeneralActions.saveConfigs,
        configs
    }
}

export function gotConfigs(configs: ClashConfig): TGeneralAction {
    return {
        type: GeneralActions.gotConfigs,
        configs
    }
}

export function gotErrorGeneral(error: any): TGeneralAction {
    return {
        type: GeneralActions.gotError,
        error
    }
}

export function toggleSaving(saving: boolean): TGeneralAction {
    return {
        type: GeneralActions.toggleSaving,
        saving
    }
}

export function fetchClashyConfigs(): TGeneralAction {
    return {
        type: GeneralActions.fetchClashy
    }
}

export function gotClashy(clashy: ClashyConfig): TGeneralAction {
    return {
        type: GeneralActions.gotClashy,
        clashy: clashy
    }
}
