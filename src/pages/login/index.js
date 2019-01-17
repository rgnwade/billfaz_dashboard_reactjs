/*
------------------------------------------------------------
project name: verifazz-dashboard
source: app/components/pages/login/index.js
-----------------------------------------------------------
*/

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import FormLogin from './form'
import Logo from '../../assets/billfazz-logo-29.png'
import { getCookies } from '../../utils/cookies'
import { CONFIG_COOKIES } from '../../config/cookies'
import { AuthApi } from '../../api'
import MENU from '../../config/menu'
import './login.scss'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const token = getCookies(CONFIG_COOKIES.TOKEN)
    if (token) {
      AuthApi.test()
        .then(() => this.props.history.push(MENU.ORDER))
        .catch(() => {})
    }
  }

  render() {
    return (
      <div className="login">
        <div className="login-inner">
          <img src={Logo} alt="" />
          <h1 className="login-title">LOGIN</h1>
          <p>Welcome back, please login to your account</p>
          <FormLogin />
        </div>
      </div>
    )
  }
}

Login.propTypes = {
  history: PropTypes.object.isRequired,
}

export default withRouter(Login)
