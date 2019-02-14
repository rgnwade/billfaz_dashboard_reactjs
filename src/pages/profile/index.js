import React, { Component } from 'react'
import { Card, Menu } from 'antd'

import Main from '../../components/main'
import Breadcrumb, { BreadcrumbItems } from '../../components/breadcrumb'
import AppProfile from '../../components/profile'
import { BACK_TO_LOGIN } from '../../api'
import ProfileInfo from './info'
import ChangePassword from './change-password'
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
                  Sales Profile
                </Menu.Item>
                <Menu.Item key="password" onClick={() => this.changeSelected('password')}>
                  Change Password
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
              </div>
            </Card>
          </div>
        </div>
      </Main>
    )
  }
}
