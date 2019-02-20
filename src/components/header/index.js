import React from 'react'
import { Layout, Popover, Button, Avatar, Divider, Icon, message } from 'antd'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import Logo from '../../assets/billfazz-logo-29.png'
import { getCookies } from '../../utils/cookies'
import { CONFIG_COOKIES } from '../../config/cookies'
import { MENU } from '../../config/menu'
import { UserApi, BACK_TO_LOGIN } from '../../api'
import { getErrorMessage } from '../../utils/error/api'
import './header.scss'

const { Header } = Layout
const AppHeader = ({ toggle, title, backToHome }) => {
  const username = getCookies(CONFIG_COOKIES.USERNAME)
  const initial = username && username.split(' ').map(x => x.substring(0, 1)).join('')
  const logout = () => {
    UserApi.logout()
      .then(() => BACK_TO_LOGIN())
      .catch(err => message.error(getErrorMessage(err) || 'Logout failed. Please try again'))
  }
  const content = (
    <div className="app-header__popover-profile">
      <div>
        <Avatar style={{ backgroundColor: '#a1cd43' }} size={60}>
          <div className="app-header__popover-initial --big">{initial}</div>
        </Avatar>
      </div>
      <div className="app-header__popover-username">
        {username}
      </div>
      <div className="app-header__popover-label">
        {getCookies(CONFIG_COOKIES.ROLE_NAME)}
      </div>
      <Divider />
      <div className="app-header__popover-label">
        Main Email Address
      </div>
      <div>
        albert@payfazz.com
      </div>
      <Divider />
      <Link to={MENU.PROFILE} className="app-header__popover-action">
        <Icon type="user" /> My Profile
      </Link>
      <div className="app-header__popover-action" onClick={logout}>
        <Icon type="logout" /> Sign Out
      </div>
    </div>
  )
  return (
    <Header style={{ background: '#fff', padding: 0 }}>
      <div className="app-header">
        <div className="app-header__logo">
          <div className="toggle-menu" onClick={toggle}>
            <span />
          </div>
          <div className="app-header__logo-svg" onClick={backToHome}>
            <img src={Logo} alt="" />
          </div>
        </div>
        <div className="app-header__title">
          {title}
        </div>
        <div className="app-header__popover">
          <Avatar style={{ backgroundColor: '#a1cd43', verticalAlign: 'middle' }} size={32}>
            <div className="app-header__popover-initial">{initial}</div>
          </Avatar>
          <Popover placement="bottomRight" content={content} trigger="click">
            <div>
              <Button className="btn-name_profile">
                {username}
              </Button>
            </div>
          </Popover>
        </div>
      </div>
    </Header>
  )
}

AppHeader.defaultProps = {
  title: '',
}

AppHeader.propTypes = {
  toggle: PropTypes.func.isRequired,
  title: PropTypes.string,
  backToHome: PropTypes.func.isRequired,
}

export default AppHeader
