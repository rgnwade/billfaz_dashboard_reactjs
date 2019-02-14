import React from 'react'
import { Layout, Popover, Button, Avatar, Divider } from 'antd'
import PropTypes from 'prop-types'

import Logo from '../../assets/billfazz-logo-29.png'
import './header.scss'


// const logout = () => {
//   UserApi.logout()
//     .then(() => BACK_TO_LOGIN())
//     .catch(err => message.error(getErrorMessage(err) || 'Logout failed. Please try again'))
// }

const content = (
  <div className="popover-profile">
    <div>
      <Avatar style={{ backgroundColor: '#a1cd43' }} size="large" >
        AB
      </Avatar>
    </div>
    <div>
      Albert Burgess
    </div>
    <div>
      Admin
    </div>
    <Divider/>
    <div>
      Main Email Address
    </div>
    <div>
      albert@payfazz.com
    </div>
    <Divider/>
    <div>
      My Profile
    </div>
    <div>
      Sign Out
    </div>
  </div>
);

const { Header } = Layout
const AppHeader = ({ toggle, title, backToHome }) => (
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
        <Avatar style={{ backgroundColor: '#a1cd43', verticalAlign: 'middle' }} size="large">
          AB
        </Avatar>
        <Popover placement="bottomRight" content={content} trigger="click">
          <div>
            <Button className="btn-name_profile">
              Albert Burgess
            </Button>
          </div>
        </Popover>
      </div>
    </div>
  </Header>
)

AppHeader.defaultProps = {
  title: '',
}

AppHeader.propTypes = {
  toggle: PropTypes.func.isRequired,
  title: PropTypes.string,
  backToHome: PropTypes.func.isRequired,
}

export default AppHeader
