import React from 'react'
import ReactDOM from 'react-dom'
// import * as serviceWorker from './serviceWorker'
import RouteConfig from './router'
import './index.scss'
import 'antd/dist/antd.css'

ReactDOM.render(
  <div>
    {RouteConfig}
  </div>,
  document.getElementById('root'),
)

// serviceWorker.register()
