export enum AppActions {
    SWITCH_TAB = 'APP_SWITCH_TAB'
}

export interface TAppAction {
    type: AppActions,
    tab?: string
}

export function switchAppTab(tab: string): TAppAction {
    return {
        type: AppActions.SWITCH_TAB,
        tab
    }
}
