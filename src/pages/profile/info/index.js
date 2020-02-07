import React, { Component } from 'react'
import { Form, Input, Button, Divider, message } from 'antd'

import { UserApi, ClientApi } from '../../../api'
import { getError } from '../../../utils/error/api'
import Role from '../../../components/role'
import { ROLES_ITEMS } from '../../../config/roles'

class ProfileInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      loading: false,
    }
  }

  componentDidMount() {
    UserApi.get()
      .then((res) => {
        this.setState({
          ...this.state,
          data: {
            ...res.data.Client,
            username: res.data.username,
          },
        })
      })
      .catch(() => message.error('Fetch data profile failed'))
  }

  changeInput = (e) => {
    const { data } = this.state
    this.setState({
      ...this.state,
      data: {
        ...data,
        [e.target.name]: e.target.value,
      },
    })
  }

  clickSave = async (e) => {
    e.preventDefault()
    await this.setState({ ...this.state, loading: true })
    const { data } = this.state
    const { email, emailFinance } = data
    ClientApi.changeEmail({ email, emailFinance })
      .then(() => {
        message.success('Update data success')
        this.setState({ ...this.state, loading: false })
      })
      .catch((err) => {
        message.error(getError(err) || 'Update data failed')
        this.setState({ ...this.state, loading: false })
      })
  }

  render() {
    const { data, loading } = this.state
    return (
      <div>
        <h2>Personal Information</h2>
        <Form onSubmit={this.clickSave} className="custom-form">
          <Form.Item>
            <div>
              <label className="small-text">Username</label>
            </div>
            <Input
              disabled
              value={data.username}
              onChange={this.changeInput}
              style={{ width: 400 }}
            />
          </Form.Item>
          <Form.Item>
            <div>
              <label className="small-text">Client Id</label>
            </div>
            <Input
              disabled
              value={data.id}
              onChange={this.changeInput}
              style={{ width: 400 }}
            />
          </Form.Item>
          <Role roleItem={ROLES_ITEMS.PROFILE_CHANGE_EMAIL}>
            <Form.Item>
              <div>
                <label className="small-text">Main Email Address</label>
              </div>
              <Input
                required
                name="email"
                value={data.email}
                onChange={this.changeInput}
                type="email"
                style={{ width: 400 }}
                pattern="(?!(^[.-].*|[^@]*[.-]@|.*\.{2,}.*)|^.{254}.)([a-zA-Z0-9!#$%&'*+\/=?^_`{|}~.-]+@)(?!-.*|.*-\.)([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,15}"
                title="Please enter valid email address"
              />
            </Form.Item>
            <Form.Item>
              <div>
                <label className="small-text">Finance Email Address</label>
              </div>
              <Input
                required
                name="emailFinance"
                value={data.emailFinance}
                onChange={this.changeInput}
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
          </Role>
        </Form>
      </div>
    )
  }
}

export default ProfileInfo
