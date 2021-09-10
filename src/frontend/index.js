import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { createStore, compose } from 'redux'
import reducer from './reducers'

import App from "./components/App"

import './style.css'

const initialState = {
  user: {
    username: '',
    avatar: '',
    _id: '',
    token: '',
  },
  userPage: {
    username: '',
    avatar: '',
    _id: '',
  },
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(reducer, initialState, composeEnhancers())

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
document.getElementById("app")
)