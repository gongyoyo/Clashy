import React from 'react'

import dashboard_icon from '../assets/icon-dashboard.png'
import tunnel_icon from '../assets/icon-tunnel.png'
import folder_icon from '../assets/icon-folder.png'
import settings_icon from '../assets/icon-settings.png'
import about_icon from '../assets/icon-about.png'

export function getIcon(tab: string) {
    let icon = null
    switch (tab) {
        case 'Status':
            icon = dashboard_icon
            break
        case 'Proxies':
            icon = tunnel_icon
            break
        case 'Profiles':
            icon = folder_icon
            break
        case 'Settings':
            icon = settings_icon
            break
        case 'About':
            icon = about_icon
            break
        default:
            break
    }
    if (icon != null) {
        return <img style={{
            width: '36px',
            height: '36px',
            marginRight: '16px'
        }} src={icon} />
    }
    return null
}
