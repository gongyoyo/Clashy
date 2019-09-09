import React, { useEffect } from 'react'
import { Provider, connect } from 'react-redux'
import { store } from './store'
import Drawer from '@material-ui/core/Drawer'
import { makeStyles } from '@material-ui/core/styles'
import { SideBar, ContentPanel } from './components'
import './App.css'
import { AppBar, Toolbar, Typography, Icon } from '@material-ui/core'
import { RootState } from './store/reducers'

import clashy_icon from './assets/icon-clashy.png'
import { getIcon } from './utils'

const drawerWidth = 122

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        height: '100%',
        flex: 1
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1
        // width: 'calc(100% - 164px)', marginLeft: '164px'
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        width: drawerWidth,
        border: 'none'
    },
    content: {
        flexGrow: 1,
        flex: 1,
        height: '100vh'
    }
}))

interface Props {
    currentTab: string
}

function _ClashyApp({ currentTab }: Props) {
    const classes = useStyles()
    return (
    <div className={classes.root}>
        <AppBar position='fixed' className={classes.appBar}>
            <Toolbar>
                {getIcon(currentTab)}
                <Typography variant='h6'>
                    {currentTab}
                </Typography>
            </Toolbar>
        </AppBar>
        <Drawer
            className={classes.drawer}
            variant={'persistent'}
            anchor={'left'}
            open={true}
            classes={{
                paper: classes.drawerPaper
            }}
        >
            <SideBar />
        </Drawer>
        <main className={classes.content}>
            <ContentPanel />
        </main>
    </div>
    )
}

const mapState = (state: RootState) => ({
    currentTab: state.app.get('currentTab')
})

const ClashyApp = connect(mapState, null)(_ClashyApp)

class App extends React.Component {
    render() {
        return <Provider store={store}>
                  <ClashyApp />
                </Provider>
    }
}

export default App
