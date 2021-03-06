import React, { Component } from 'react'
import { Form, Input, Button, Icon, message } from 'antd'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import MENU from '../../config/menu'
import { AuthApi, PermissionApi, UserApi } from '../../api'
import { cookies } from '../../utils/cookies'
import { CONFIG_COOKIES } from '../../config/cookies'
import { getErrorMessage } from '../../utils/error/api'

class FormSignIn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      clientId: '',
      viewPassword: false,
      loading: false,
    }
  }

  changeClientID = e => this.setState({ clientId: e.target.value })

  changeUsername = e => this.setState({ username: e.target.value })

  changePassword = e => this.setState({ password: e.target.value })

  viewPassword = () => this.setState({ viewPassword: !this.state.viewPassword })

  submitSignin = async (e) => {
    e.preventDefault()
    await this.setState({ ...this.state, loading: true })
    const { clientId, username, password } = this.state
    const token = await AuthApi.login({ clientId, username, password })
      .then((res) => {
        cookies.set(CONFIG_COOKIES.USERNAME, username)
        return res.data.token
      })
      .catch((err) => {
        this.setState({ ...this.state, loading: false })
        message.error(getErrorMessage(err) || 'Login Failed')
        return false
      })
    if (token) {
      await cookies.set(CONFIG_COOKIES.TOKEN, token)
      await this.getPermission()
      this.props.history.push(MENU.ORDER)
    }
  }

  getPermission = () => {
    Promise.all([
      PermissionApi.get(),
      UserApi.get(),
    ])
      .then((res) => {
        const { email } = res[1].data.Client
        let role = res[1].data.role && res[1].data.role.length > 0 ? res[1].data.role[0] : ''
        const roles = {
          client_root: 'Admin',
          client_cs: 'CS',
        }
        role = roles[role] ? roles[role] : role
        cookies.set(CONFIG_COOKIES.PERMISSION, JSON.stringify(Object.keys(res[0].data)))
        cookies.set(CONFIG_COOKIES.ROLE_NAME, role)
        cookies.set(CONFIG_COOKIES.EMAIL, email)
      })
      .catch((err) => {
        this.setState({ ...this.state, loading: false })
        message.error(getErrorMessage(err) || 'Error fetching data roles. Please relogin')
      })
  }

  render() {
    const { clientId, username, password, viewPassword, loading } = this.state
    const passwordType = viewPassword ? 'text' : 'password'

    return (
      <Form onSubmit={this.submitSignin}>
        <Form.Item>
          <label className="login-form">Client ID</label>
          <Input
            required
            name="clientID"
            placeholder="Client ID"
            value={clientId}
            onChange={this.changeClientID}
          />
        </Form.Item>
        <label className="login-form">Username</label>
        <Form.Item>
          <Input
            required
            name="username"
            placeholder="Email"
            value={username}
            onChange={this.changeUsername}
          />
        </Form.Item>
        <label className="login-form">Password</label>
        <Form.Item>
          <Input
            required
            name="password"
            type={passwordType}
            placeholder="Password"
            value={password}
            onChange={this.changePassword}
            addonAfter={
              <Icon type="eye" theme="outlined" onClick={this.viewPassword} />
            }
          />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary" loading={loading}>
            LOGIN
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

FormSignIn.propTypes = {
  history: PropTypes.object.isRequired,
}

export default withRouter(FormSignIn)
