import React, { useState, useEffect } from 'react'
import { requestTraffic } from '../../apis'
import ic_upload from '../../assets/icon-upload.png'
import ic_download from '../../assets/icon-download.png'

import './SpeedOMeter.css'

interface Traffic {
    up: number
    down: number
}

export function SpeedOMeter() {
    const [ traffic, setTraffic ] = useState({ up: 0, down: 0 })

    useEffect(() => {
        requestTraffic((chunk) => {
            if (chunk == null || chunk.length === 0) {
                return
            }
            try {
                const t: Traffic = JSON.parse(chunk)
                setTraffic(t)
            } catch (e) {
                // eat it
            }
        })
    }, [])
    return (
        <div style={{ padding: '16px' }}>
            <div className='speed-o-meter-text'>
                <img src={ic_upload} className='speed-o-meter-icon' />
                <p>{Number((traffic.up || 0) / 1024).toFixed(2)}k</p>
            </div>
            <div className='speed-o-meter-text'>
                <img src={ic_download} className='speed-o-meter-icon' />
                <p>{Number((traffic.down || 0) / 1024).toFixed(2)}k</p>
            </div>
        </div>
    )
}
