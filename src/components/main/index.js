import React, { Component } from 'react'
import { Layout, message } from 'antd'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import AppHeader from '../header'
import Sidebar from '../sidebar'
import MENU from '../../config/menu'
import { BACK_TO_LOGIN, UserApi } from '../../api'
import { getErrorMessage } from '../../utils/error/api'
import './main.css'

const { Content } = Layout

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
    }
  }

  toggle = () => {
    const { collapsed } = this.state
    this.setState({
      collapsed: !collapsed,
    })
  }

  backToHome = () => {
    this.props.history.push(MENU.ORDER)
  }

  logout = () => {
    UserApi.logout()
      .then(() => BACK_TO_LOGIN())
      .catch(err => message.error(getErrorMessage(err) || 'Logout failed. Please try again'))
  }

  render() {
    const { collapsed } = this.state
    const { children, title } = this.props
    return (
      <Layout>
        <Sidebar collapsed={collapsed} toggle={this.toggle} logout={this.logout} />
        <Layout style={{ transition: 'all .2s' }}>
          <AppHeader
            toggle={this.toggle}
            title={title}
            backToHome={this.backToHome}
          />
          <Content className="main-content">
            {children}
          </Content>
        </Layout>
      </Layout>
    )
  }
}

App.defaultProps = {
  title: '',
}

App.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
  ]).isRequired,
  title: PropTypes.string,
  history: PropTypes.object.isRequired,
}

export default withRouter(App)
