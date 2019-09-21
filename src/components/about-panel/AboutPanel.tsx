import React from 'react'
import { Paper } from '@material-ui/core'

import './AboutPanel.css'
import { callIPC } from '../../native-support/message-queue'
import { BRG_MSG_OPEN_LINK } from '../../native-support/message-constants'

import pJson from '../../../package.json'

import eth from '../../assets/eth.jpeg'
import btc from '../../assets/btc.jpeg'

const SYSPROXY_LINK = 'https://github.com/Noisyfox/sysproxy'
const CLASH_LINK = 'https://github.com/Dreamacro/clash'
const CLASH_X_LINK = 'https://github.com/yichengchen/clashX'
const CLASH_Y_LINK = 'https://github.com/SpongeNobody/Clashy'

export const AboutPanel = () => {
    const openLink = (link: string) => {
        return () => callIPC(BRG_MSG_OPEN_LINK, { arg: link })
    }
    return (
        <div className='about-panel'>
            <div style={{ position: 'fixed', background: '#3F51B5', height: '180px', width: '100%', top: 0, left: 0, zIndex: 0 }} />
            <Paper className='about-wrapper'>
                <p style={{ fontWeight: 'bold' }}>Clashy v{pJson.version}</p>
                <p style={{ fontWeight: 'bold' }}>Credits:</p>
                <div className='credits' >
                    <p onClick={openLink(CLASH_LINK)}>Clash</p>
                    <p onClick={openLink(SYSPROXY_LINK)}>Sysproxy</p>
                    <p onClick={openLink(CLASH_X_LINK)}>ClashX</p>
                </div>
                <p style={{ fontWeight: 'bold' }}>Contact:</p>
                <div className='credits' >
                    <p onClick={openLink(CLASH_Y_LINK)}>Home page</p>
                </div>
                <p style={{ fontWeight: 'bold' }}>Donation:</p>
                <div style={{ display: 'flex', flexDirection: 'row' }} >
                    <div className='donation'>
                        <img src={eth} />
                        <p>ETH</p>
                    </div>
                    <div className='donation'>
                        <img src={btc} />
                        <p>BTC</p>
                    </div>
                </div>
            </Paper>
        </div>
    )
}
