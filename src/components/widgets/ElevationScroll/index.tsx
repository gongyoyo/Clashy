import React from 'react'
import { useScrollTrigger } from '@material-ui/core'

export function ElevationScroll(props: { children: any }) {
    const { children } = props
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window
    })

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0
    })
}
