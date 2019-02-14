import React, { Component } from 'react'
import { Form, Input, Button, Divider, Icon } from 'antd'

class ChangePassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      loading: false,
      viewPassword: false,
    }
  }

  render() {
    const { data, viewPassword, loading } = this.state
    return (
      <div>
        <h2>Set New Password</h2>
        <p>
          {data.ticketID
            ? 'Please enter OTP code that has been sent to you'
            : 'Please enter Your new password and verify the new password'}
        </p>
        <Form onSubmit={this.submitPassword} className="custom-form">
          {!data.ticketID && (
            <div>
              <Form.Item>
                <div>
                  <label>Your new password</label>
                </div>
                <Input
                  required={!data.ticketID}
                  value={data.password}
                  onChange={e => this.changeInputPassword(e, 'password')}
                  type={viewPassword.password ? 'text' : 'password'}
                  style={{ width: 400 }}
                  addonAfter={
                    <Icon
                      type="eye"
                      onClick={() => this.viewPassword('password')}
                    />
                  }
                  pattern=".{8,}"
                  title="Minimum 8 characters"
                />
              </Form.Item>
              <Form.Item>
                <div>
                  <label>Verify your new password</label>
                </div>
                <Input
                  required={!data.ticketID}
                  value={data.repassword}
                  onChange={e => this.changeInputPassword(e, 'repassword')}
                  type={viewPassword.repassword ? 'text' : 'password'}
                  style={{ width: 400 }}
                  addonAfter={
                    <Icon
                      type="eye"
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
                onChange={e => this.changeInputPassword(e, 'otp')}
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
