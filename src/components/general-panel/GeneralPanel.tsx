import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { fetchConfigs } from '../../store/actions'

import './GeneralPanel.css'
import { ClashConfig, requestTraffic } from '../../apis'
import { RootState } from '../../store/reducers'
import { TDispatch } from '../../utils'
import { List, ListItem, Paper, Fab } from '@material-ui/core'
import { callIPC } from '../../native-support/message-queue'
import { BRG_MSG_OPEN_CONFIG_FOLDER } from '../../native-support/message-constants'
import { FolderOpen } from '@material-ui/icons'

interface Props {
    configs?: ClashConfig,
    fetchConfigs: () => void,
    error?: any
}

const _GeneralPanel = ({ configs, fetchConfigs, error }: Props) => {
    useEffect(() => {
        fetchConfigs()
    }, [])
    if (configs == null) {
        if (error !== null) {
            return <div>{JSON.stringify(error)}</div>
        }
        return <div>loading</div>
    }
    const tableData = [
        {
            key: 'port',
            name: 'HTTP Port',
            value: configs.port || ''
        },
        {
            key: 'socks-port',
            name: 'Socks Port',
            value: configs['socks-port'] || ''
        },
        {
            key: 'allow-lan',
            name: 'Allow Lan',
            value: configs['allow-lan'] ? 'true' : 'false'
        },
        {
            key: 'mode',
            name: 'Mode',
            value: configs.mode || ''
        },
        {
            key: 'log-level',
            name: 'Log level',
            value: configs['log-level'] || ''
        }
    ]
    return (
        <div style={{ flex: 1, width: '100%', display: 'flex' }}>
            <div style={{ position: 'fixed', background: '#3F51B5', height: '180px', width: '100%', top: 0, left: 0, zIndex: 0 }} />
            <Paper className='general-list-wrapper'>
                <List className={'list'}>
                    {
                        tableData.map((each, idx) => renderItem(each, idx))
                    }
                </List>
                <Fab
                    style={{
                        position: 'absolute',
                        right: '0px',
                        bottom: '0px',
                        marginBottom: '48px',
                        marginRight: '32px'
                    }}
                    onClick={openConfigFolder} color='secondary'
                    >
                    <FolderOpen />
                </Fab>
            </Paper>
        </div>
    )
}

const renderItem = (item: { name: string, value: string | number }, key: number) => {
    return <ListItem className={'list-item'} key={key} divider={true}>
        <span className={'title'}>{item.name}</span><span className={'value'}>{item.value}</span>
    </ListItem>
}

const openConfigFolder = () => {
    callIPC(BRG_MSG_OPEN_CONFIG_FOLDER)
}

const mapStateToProps = (state: RootState) => {
    return {
        configs: state.configs.get('configs'),
        error: state.configs.get('error')
    }
}

const mapDispatchToProps = (dispatch: TDispatch) => {
    return {
        fetchConfigs: () => dispatch(fetchConfigs())
    }
}

export const GeneralPanel = connect(mapStateToProps, mapDispatchToProps)(_GeneralPanel)
