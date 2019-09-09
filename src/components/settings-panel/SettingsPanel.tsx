import React, { useState } from 'react'

import './SettingsPanel.css'
import { connect } from 'react-redux'
import { TDispatch } from '../../utils'
import { fetchConfigs, saveConfigs } from '../../store/actions'
import { ClashConfig, ClashyConfig } from '../../apis'
import { RootState } from '../../store/reducers'
import {
    Radio,
    RadioGroup,
    Input,
    Switch,
    Button,
    FormControl,
    FormControlLabel,
    CircularProgress,
    Paper
} from '@material-ui/core'
import { callIPC } from '../../native-support/message-queue'
import {
    BRG_MSG_SET_LOGIN_ITEM,
    BRG_MSG_SET_SYSTEM_PROXY
} from '../../native-support/message-constants'

const initialState = {
    mode: 'GLOBAL',
    socksPort: 0,
    httpPort: 0,
    controllerPort: 0,
    allowLAN: false
}

interface Props {
    fetchConfigs: () => void,
    saveConfigs: (configs: ClashConfig) => void,
    saving: boolean,
    configs?: ClashConfig
    clashy?: ClashyConfig
}

const _SettingsPanel = ({ saving, configs, saveConfigs, clashy }: Props) => {
    const [socksPort, setSocksPort] = useState(configs == null ? 0 : configs['socks-port'])
    const validateSocksPort = (str: string) => {
        if (str.length === 0) {
            setSocksPort(0)
        }
        const port = Number.parseInt(str, 10)
        if (isNaN(port) || port < 0) {
            return
        }
        setSocksPort(port)
    }
    const [mode, setMode] = useState(configs == null ? 'GLOBAL' : configs['mode'])
    const [httpPort, setHttpPort] = useState(configs == null ? 0 : configs['port'])
    const validateHttpPort = (str: string) => {
        if (str.length === 0) {
            setHttpPort(0)
        }
        const port = Number.parseInt(str, 10)
        if (isNaN(port) || port < 0) {
            return
        }
        setHttpPort(port)
    }
    const [allowLAN, setAllowLAN] = useState(configs == null ? false : configs['allow-lan'])
    const [systemProxy, setSystemProxy] = useState(clashy == null ? false : clashy.systemProxy || false)
    const [startWithSystem, setStartWithSystem] = useState(clashy == null ? false : clashy.startWithSystem || false)

    if (configs == null || clashy == null) {
        return (
        <div style={{ textAlign: 'center' }}>
            <CircularProgress />
            <p>Loading</p>
        </div>
        )
    }

    const onSave = () => {
        saveConfigs({
            'socks-port': socksPort,
            mode,
            'port': httpPort,
            'allow-lan': allowLAN,
            'log-level': configs['log-level']
        })
        if (systemProxy !== clashy.systemProxy) {
            callIPC(BRG_MSG_SET_SYSTEM_PROXY, systemProxy)
        }
        if (startWithSystem !== clashy.startWithSystem) {
            callIPC(BRG_MSG_SET_LOGIN_ITEM, startWithSystem)
        }
    }
    return (
        <div className={'SettingsPanel'}>
            <div style={{ position: 'fixed', background: '#3F51B5', height: '180px', width: '100%', top: 0, left: 0, zIndex: 0 }} />
            <Paper className='SettingsWrapper'>
                <div style={{ flex: 1, margin: 'auto 16px', display: 'flex', flexDirection: 'column' }}>
                <FormControl className={'SettingsRow'}>
                    <p>Proxy Mode</p>
                    <RadioGroup
                        style={{ flexDirection: 'row', alignSelf: 'flex-end' }}
                        onChange={(e, value) => setMode(value)}
                        value={mode}
                    >
                        <FormControlLabel value='Global' control={<Radio />} label='GLOBAL' />
                        <FormControlLabel value='Rule' control={<Radio />} label='RULE' />
                        <FormControlLabel value='Direct' control={<Radio />} label='DIRECT' />
                    </RadioGroup>
                </FormControl>
                <div className={'SettingsRow'}>
                    <p>Socks Port</p>
                    <Input value={socksPort} error={isNaN(socksPort)} onChange={(e) => validateSocksPort(e.target.value)} />
                </div>
                <div className={'SettingsRow'}>
                    <p>Http Port</p>
                    <Input value={httpPort} error={isNaN(httpPort)} onChange={(e) => validateHttpPort(e.target.value)} />
                </div>
                <div className={'SettingsRow'}>
                    <p>Allow LAN</p>
                    <Switch checked={allowLAN} onClick={(e) => {
                        setAllowLAN(!allowLAN)
                    }} />
                </div>
                <div className={'SettingsRow'}>
                    <p>Start with system</p>
                    <Switch checked={startWithSystem} onClick={(e) => {
                        setStartWithSystem(!startWithSystem)
                    }} />
                </div>
                <div className={'SettingsRow'}>
                    <p>Set as system proxy</p>
                    <Switch checked={systemProxy} onClick={(e) => {
                        setSystemProxy(!systemProxy)
                    }} />
                </div>
                <div className='SettingsRow'>
                    {
                        saving ? <CircularProgress /> :
                            <Button className='SettingsSave' variant='contained' color='primary' onClick={onSave}>Save</Button>
                    }
                </div>
                </div>
            </Paper>
        </div>
    )
}

const mapStateToProps = (state: RootState) => {
    return {
        configs: state.configs.get('configs'),
        clashy: state.configs.get('clashy'),
        saving: state.configs.get('saving')
    }
}

const mapDispatchToProps = (dispatch: TDispatch) => {
    return {
        fetchConfigs: () => dispatch(fetchConfigs()),
        saveConfigs: (config: ClashConfig) => dispatch(saveConfigs(config))
    }
}

export const SettingsPanel = connect(mapStateToProps, mapDispatchToProps)(_SettingsPanel)
