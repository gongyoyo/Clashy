 import { Record } from 'immutable'
import { GeneralActions, TGeneralAction } from '../actions/general-actions'
import { ClashConfig, ClashyConfig } from '../../apis'

interface _ConfigsState {
    configs?: ClashConfig,
    clashy?: ClashyConfig,
    saving: boolean,
    error?: any
}

export type ConfigsState = Record<_ConfigsState>

const initialStateFactory = Record<_ConfigsState>({
    configs: undefined,
    clashy: undefined,
    saving: false,
    error: null
})

const initialState = initialStateFactory()

export function configs(state: ConfigsState = initialState, action: TGeneralAction): ConfigsState {
    if (action == null || action.type == null) {
        return state
    }
    switch (action.type) {
        case GeneralActions.gotConfigs:
            return state.set('configs', action.configs)
        case GeneralActions.gotError:
            return state.set('error', action.error)
        case GeneralActions.toggleSaving:
            return state.set('saving', action.saving || false)
        case GeneralActions.gotClashy:
            return state.set('clashy', action.clashy)
        default:
            break
    }
    return state
}
