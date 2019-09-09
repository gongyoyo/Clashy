import { combineReducers } from 'redux'
import { app, AppState } from './app-reducer'
import { configs, ConfigsState } from './general-reducers'
import { proxies, ProxiesState } from './proxies-reducer'
import { profiles, ProfilesState } from './profiles-reducers'

export interface RootState {
    app: AppState,
    configs: ConfigsState,
    proxies: ProxiesState,
    profiles: ProfilesState
}

const rootReducer = combineReducers({
    app,
    configs: configs,
    proxies,
    profiles
})

export default rootReducer
