import React, { Component } from 'react'
import { Card, Menu, message } from 'antd'
import PropTypes from 'prop-types'

import Main from '../../components/main'
import Breadcrumb, { BreadcrumbItems } from '../../components/breadcrumb'
import AppProfile from '../../components/profile'
import { BACK_TO_LOGIN, UserApi } from '../../api'
import ProfileInfo from './info'
import ChangePassword from './change-password'
import UserManagement from './user-management'
import ApiKey from './api-key'
import { PROFILE_TYPES } from '../../config/profile'
import MENU from '../../config/menu'
import { getErrorMessage } from '../../utils/error/api'
import './profile.scss'

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataPassword: {},
      code: '',
      selected: this.props.match.params.type || PROFILE_TYPES.PROFILE,
      viewPassword: {},
      loading: false,
    }
  }

  componentDidMount() {
    this.setState({ ...this.state, selected: this.props.match.params.type || PROFILE_TYPES.PROFILE })
  }

  componentDidUpdate(prevProps) {
    const { match } = prevProps
    if (match.params.type !== this.props.match.params.type) {
      this.setState({ ...this.state, selected: this.props.match.params.type || PROFILE_TYPES.PROFILE })
    }
  }

  changeSelected = (selected) => {
    this.props.history.push(`${MENU.PROFILE}/${selected}`)
    this.setState({ ...this.state, selected, dataPassword: {}, openResendOtp: false })
  }

  logout = () => {
    UserApi.logout()
      .then(() => BACK_TO_LOGIN())
      .catch(err => message.error(getErrorMessage(err) || 'Logout failed. Please try again'))
  }

  render() {
    const { selected, code } = this.state
    const contents = {
      [PROFILE_TYPES.PROFILE]: <ProfileInfo />,
      [PROFILE_TYPES.PASSWORD]: <ChangePassword />,
      [PROFILE_TYPES.USER_MANAGEMENT]: <UserManagement />,
      [PROFILE_TYPES.API_KEY]: <ApiKey />,
    }
    return (
      <Main title="Profile">
        <div className="profile">
          <Breadcrumb items={[BreadcrumbItems.PROFILE, selected === PROFILE_TYPES.PROFILE ? BreadcrumbItems.PROFILE_UPDATE : BreadcrumbItems.PROFILE_PASSWORD]} />
          <div className="app-content">
            <Card className="profile__nav">
              <div style={{ paddingLeft: '24px' }}>
                <AppProfile description={code} />
              </div>
              <Menu
                mode="inline"
                selectedKeys={[selected]}
              >
                <Menu.Item key="profile" onClick={() => this.changeSelected(PROFILE_TYPES.PROFILE)}>
                  Profile
                </Menu.Item>
                <Menu.Item key="password" onClick={() => this.changeSelected(PROFILE_TYPES.PASSWORD)}>
                  Change Password
                </Menu.Item>
                <Menu.Item key="user-management" onClick={() => this.changeSelected(PROFILE_TYPES.USER_MANAGEMENT)}>
                  User Management
                </Menu.Item>
                <Menu.Item key="api-key" onClick={() => this.changeSelected(PROFILE_TYPES.API_KEY)}>
                  Api Key
                </Menu.Item>
                <Menu.Item key="logout" onClick={this.logout}>
                  Logout
                </Menu.Item>
              </Menu>
            </Card>
            <Card className="profile__content">
              <div>
                {contents[selected]}
              </div>
            </Card>
          </div>
        </div>
      </Main>
    )
  }
}

Profile.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

export default Profile
