import { createStore, applyMiddleware, compose, Store } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import reducers, { RootState } from './reducers'
import createSagaMiddleWare, {
    END
} from 'redux-saga'
import rootSaga from './sagas'

type StoreType = Store<RootState> & {
    dispatch: {},
    runSaga?: any,
    close?: any
}

const sagaMiddleWare = createSagaMiddleWare()
let _store: StoreType
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    _store = createStore(reducers, composeWithDevTools(applyMiddleware(sagaMiddleWare)))
} else {
    _store = createStore(reducers, compose(applyMiddleware(sagaMiddleWare)))
}
_store.runSaga = sagaMiddleWare.run
_store.close = () => store.dispatch(END)
_store.runSaga(rootSaga)

export const store = _store

// for hot-reload
if (module.hot) {
    module.hot.accept('./reducers', () => {
        const nextRootReducer = require('./reducers')
        store.replaceReducer(nextRootReducer)
    })
}
