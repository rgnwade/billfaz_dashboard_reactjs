import React, { Component } from 'react'
import { Card, Menu } from 'antd'

import Main from '../../components/main'
import Breadcrumb, { BreadcrumbItems } from '../../components/breadcrumb'
import AppProfile from '../../components/profile'
import { BACK_TO_LOGIN } from '../../api'
import ProfileInfo from './info'
import ChangePassword from './change-password'
import UserManagement from './user-management'
import ApiKey from './api-key'
import './profile.scss'

export default class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataForDisplay: {},
      dataPassword: {},
      code: '',
      selected: 'profile',
      viewPassword: {},
      loading: false,
    }
  }

  changeSelected = selected => this.setState({ ...this.state, selected, dataPassword: {}, openResendOtp: false })

  render() {
    const { selected, dataForDisplay, code } = this.state
    return (
      <Main title="Profile">
        <div className="profile">
          <Breadcrumb items={[BreadcrumbItems.PROFILE, selected === 'profile' ? BreadcrumbItems.PROFILE_UPDATE : BreadcrumbItems.PROFILE_PASSWORD]} />
          <div className="app-content">
            <Card className="profile__nav">
              <div style={{ paddingLeft: '24px' }}>
                <AppProfile name={dataForDisplay.fullname} description={code} />
              </div>
              <Menu
                mode="inline"
                selectedKeys={[selected]}
              >
                <Menu.Item key="profile" onClick={() => this.changeSelected('profile')}>
                  Profile
                </Menu.Item>
                <Menu.Item key="password" onClick={() => this.changeSelected('password')}>
                  Change Password
                </Menu.Item>
                <Menu.Item key="user-management" onClick={() => this.changeSelected('user-management')}>
                  User Management
                </Menu.Item>
                <Menu.Item key="api-key" onClick={() => this.changeSelected('api-key')}>
                  Api Key
                </Menu.Item>
                <Menu.Item key="logout" onClick={BACK_TO_LOGIN}>
                  Logout
                </Menu.Item>
              </Menu>
            </Card>
            <Card className="profile__content">
              <div>
                {selected === 'profile'
                  && (
                    <ProfileInfo />
                  )}
                {selected === 'password'
                  && (
                    <ChangePassword />
                  )}
                {selected === 'user-management'
                  && (
                    <UserManagement />
                  )}
                {selected === 'api-key'
                  && (
                    <ApiKey />
                  )}
              </div>
            </Card>
          </div>
        </div>
      </Main>
    )
  }
}
