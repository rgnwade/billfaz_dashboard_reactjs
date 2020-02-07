import React from 'react'
import { Menu, Drawer, Icon } from 'antd'
import { NavLink, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import Profile from '../profile'
import MENU from '../../config/menu'
import PUBLIC_URL from '../../config/url'
import { getCookies } from '../../utils/cookies'
import { CONFIG_COOKIES } from '../../config/cookies'
import './sidebar.scss'

const Sidebar = ({ collapsed, toggle, location, logout }) => {
  const getActiveNavLink = () => {
    const locs = location.pathname ? location.pathname.replace(PUBLIC_URL, '').split('/') : []
    return locs.length > 1 ? locs[1] : ''
  }
  return (
    <Drawer
      className="sidebar__drawer"
      title=" "
      placement="left"
      onClose={toggle}
      visible={collapsed}
    >
      <div>
        <div className="sidebar__profile">
          <Profile name={getCookies(CONFIG_COOKIES.USERNAME)} />
          <NavLink to={MENU.PROFILE}>
            <Icon type="setting" />
          </NavLink>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={[MENU.LOGIN]}
          selectedKeys={[getActiveNavLink()]}
        >
          <Menu.Item key={MENU.ORDER_KEY}>
            <NavLink to={MENU.ORDER}>
              Order
            </NavLink>
          </Menu.Item>
          <Menu.Item key={MENU.DEPOSIT_KEY}>
            <NavLink to={MENU.DEPOSIT}>
              Deposit
            </NavLink>
          </Menu.Item>
          <Menu.Item key={MENU.PRODUCT_KEY}>
            <NavLink to={MENU.PRODUCT}>
              Product
            </NavLink>
          </Menu.Item>
          {/* <Menu.Item key={MENU.CLIENT_KEY}>
            <NavLink to={MENU.CLIENT}>
              Client
            </NavLink>
          </Menu.Item> */}
          <Menu.Item key="/logout" onClick={logout}>
            Logout
          </Menu.Item>
        </Menu>
      </div>
    </Drawer>
  )
}

Sidebar.defaultProps = {
  toggle: () => {},
  collapsed: false,
}

Sidebar.propTypes = {
  toggle: PropTypes.func,
  collapsed: PropTypes.bool,
  location: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
}

export default withRouter(Sidebar)
