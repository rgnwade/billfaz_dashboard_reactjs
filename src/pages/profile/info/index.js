import React, { Component } from 'react'
import { Form, Input, Button, Divider } from 'antd'

class ProfileInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      loading: false,
    }
  }

  render() {
    const { data, loading } = this.state
    return (
      <div>
        <div>
          <h2>Sales Profile</h2>
          <label>Profile Picture</label>
          <div className="profile__picture" />
        </div>
        <Form onSubmit={this.submitProfile} className="custom-form">
          <Form.Item>
            <div>
              <label>Username</label>
            </div>
            <Input
              disabled
              value={data.username}
              onChange={e => this.changeInput(e, 'username')}
              style={{ width: 400 }}
            />
          </Form.Item>
          <Form.Item>
            <div>
              <label>Phone Number</label>
            </div>
            <Input
              required
              value={data.phone}
              onChange={e => this.changeInput(e, 'phone')}
              style={{ width: 400 }}
              type="tel"
              pattern="^[0-9-+s()]*$"
              title="Please enter valid phone number"
            />
          </Form.Item>
          <Form.Item>
            <div>
              <label>Full Name</label>
            </div>
            <Input
              required
              value={data.fullname}
              onChange={e => this.changeInput(e, 'fullname')}
              style={{ width: 400 }}
            />
          </Form.Item>
          <Form.Item>
            <div>
              <label>Email</label>
            </div>
            <Input
              required
              value={data.email}
              onChange={e => this.changeInput(e, 'email')}
              type="email"
              style={{ width: 400 }}
              pattern="(?!(^[.-].*|[^@]*[.-]@|.*\.{2,}.*)|^.{254}.)([a-zA-Z0-9!#$%&'*+\/=?^_`{|}~.-]+@)(?!-.*|.*-\.)([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,15}"
              title="Please enter valid email address"
            />
          </Form.Item>
          <Form.Item>
            <div className="profile__actions">
              <Divider />
              <div className="profile__actions-container">
                <div />
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

export default ProfileInfo
