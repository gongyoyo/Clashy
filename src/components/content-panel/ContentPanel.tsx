import React from 'react'
import { connect } from 'react-redux'
import { GeneralPanel } from '../general-panel/GeneralPanel'
import { ProxiesPanel } from '../proxies-panel/ProxiesPanel'
import { ProfilePanel } from '../profiles-panel/ProfilesPanel'
import { SettingsPanel } from '../settings-panel/SettingsPanel'

import './ContentPanel.css'
import { RootState } from '../../store/reducers'
import { Paper, Theme } from '@material-ui/core'
import { AboutPanel } from '../about-panel/AboutPanel'

interface Props {
    currentTab: string
}

const _ContentPanel = ({ currentTab }: Props) => {
    let content = <div />
    switch (currentTab) {
        case 'Status':
            content = <GeneralPanel />
            break
        case 'Proxies':
            content = <ProxiesPanel />
            break
        case 'Profiles':
            content = <ProfilePanel />
            break
        case 'Settings':
            content = <SettingsPanel />
            break
        case 'About':
            content = <AboutPanel />
            break
        default:
            return <div />
    }
    return <div className={'ContentPanel'} >
        {content}
    </div>
}

const mapStateToProps = (state: RootState) => {
    return {
        currentTab: state.app.get('currentTab')
    }
}

export const ContentPanel = connect(mapStateToProps)(_ContentPanel)
