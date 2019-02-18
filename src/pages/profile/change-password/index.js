import React, { Component } from 'react'
import { Form, Input, Button, Divider, Icon } from 'antd'

class ChangePassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      loading: false,
      viewPassword: {
        oldPassword: false,
        password: false,
        repassword: false,
      },
    }
  }

  changeInput = (e) => {
    console.log(e.target.name, e.target.value)
    const { data } = this.state
    this.setState({
      ...this.state,
      data: {
        ...data,
        [e.target.name]: e.target.value,
      }
    })
  }

  viewPassword = (type) => {
    const { viewPassword } = this.state
    this.setState({
      ...this.state,
      viewPassword: {
        ...viewPassword,
        [type]: !viewPassword[type],
      }
    })
  }

  render() {
    const { data, viewPassword, loading } = this.state
    return (
      <div>
        <h2>Change Password</h2>
        <Form onSubmit={this.submitPassword} className="custom-form">
          {!data.ticketID && (
            <div>
              <Form.Item>
                <div>
                  <label>Current password</label>
                </div>
                <Input
                  name="oldPassword"
                  required
                  value={data.oldPassword}
                  onChange={this.changeInput}
                  type={viewPassword.oldPassword ? 'text' : 'password'}
                  style={{ width: 400 }}
                  addonAfter={
                    <Icon
                      type={viewPassword.oldPassword ? 'eye-invisible' : 'eye'}
                      onClick={() => this.viewPassword('oldPassword')}
                    />
                  }
                  pattern=".{8,}"
                  title="Minimum 8 characters"
                />
              </Form.Item>
              <Form.Item>
                <div>
                  <label>Your new password</label>
                </div>
                <Input
                  name="password"
                  required
                  value={data.password}
                  onChange={this.changeInput}
                  type={viewPassword.password ? 'text' : 'password'}
                  style={{ width: 400 }}
                  addonAfter={
                    <Icon
                      type={viewPassword.password ? 'eye-invisible' : 'eye'}
                      onClick={() => this.viewPassword('password')}
                    />
                  }
                  pattern=".{8,}"
                  title="Minimum 8 characters"
                />
              </Form.Item>
              <Form.Item>
                <div>
                  <label>Confirm New Password</label>
                </div>
                <Input
                  name="repassword"
                  required
                  value={data.repassword}
                  onChange={this.changeInput}
                  type={viewPassword.repassword ? 'text' : 'password'}
                  style={{ width: 400 }}
                  addonAfter={
                    <Icon
                      type={viewPassword.repassword ? 'eye-invisible' : 'eye'}
                      onClick={() => this.viewPassword('repassword')}
                    />
                  }
                />
                <div className="form__field-error">{data.error}</div>
              </Form.Item>
            </div>
          )}
          {data.ticketID && (
            <Form.Item>
              <div>
                <label>Your OTP Code</label>
              </div>
              <Input
                required={data.ticketID}
                value={data.otp}
                onChange={this.changeInput}
                type="number"
                style={{ width: 400 }}
              />
            </Form.Item>
          )}
          <Form.Item>
            <div style={{ marginTop: '7em' }} className="profile__actions">
              <Divider />
              <div className="profile__actions-container">
                <Button loading={loading} type="primary" htmlType="submit">
                  Save
                </Button>
              </div>
            </div>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default ChangePassword
