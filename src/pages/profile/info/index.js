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
        <h2>Personal Information</h2>
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
              <label>Client Id</label>
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
              <label>Main Email Address</label>
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
            <div>
              <label>Finance Email Address</label>
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
