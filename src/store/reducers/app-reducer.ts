import { Record } from 'immutable'
import { AppActions, TAppAction } from '../actions/app-actions'
import { APP_TABS } from '../../configs/constants'

interface _AppState {
    currentTab: string
}
export type AppState = Record<_AppState>

const initialStateFactory = Record<_AppState>({
    currentTab: 'Status'
})

const initialState = initialStateFactory()

export function app(state: AppState = initialState, action: TAppAction): AppState {
    if (action == null || action.type == null) {
        return state
    }
    switch (action.type) {
        case AppActions.SWITCH_TAB:
            if (!APP_TABS.includes(action.tab || '')) {
                return state
            }
            return state.set('currentTab', action.tab || 'Status')
        default:
            break
    }
    return state
}
