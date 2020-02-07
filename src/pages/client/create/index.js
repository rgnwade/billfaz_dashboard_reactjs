import React, { Component } from 'react'
import { Button, Card, Divider, Form, Input, message } from 'antd'

import { REGEX_CONFIG } from '../../../config/regex'
import { ClientApi } from '../../../api'
import { getError } from '../../../utils/error/api'
import './create.scss'

class CreateClient extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      data: {},
    }
  }

  changeInput = (e, field) => {
    const { data } = this.state
    this.setState({ ...this.state, data: { ...data, [field]: e.target.value } })
  }

  submitForm = async (e) => {
    const { data } = this.state
    e.preventDefault()
    await this.setState({ ...this.state, loading: true })
    ClientApi.create(data)
      .then((res) => {
        message.success(res.data.status)
        this.setState({ ...this.state, data: {}, loading: false })
      })
      .catch((err) => {
        message.error(getError(err) || 'Create client failed')
        this.setState({ ...this.state, loading: false })
      })
  }

  render() {
    const { data, loading } = this.state
    return (
      <div className="client-create">
        <Card className="small-card">
          <Form onSubmit={this.submitForm}>
            <div className="client-create__group-input">
              <Form.Item>
                <label className="small-text">Company Name</label>
                <Input
                  required
                  value={data.name}
                  onChange={e => this.changeInput(e, 'name')}
                />
              </Form.Item>
              <Form.Item>
                <label className="small-text">Client Code</label>
                <Input
                  required
                  value={data.code}
                  onChange={e => this.changeInput(e, 'code')}
                />
              </Form.Item>
              <Form.Item>
                <label className="small-text">Main Email</label>
                <Input
                  required
                  value={data.email}
                  onChange={e => this.changeInput(e, 'email')}
                  type="email"
                  pattern={REGEX_CONFIG.email}
                  title="Please enter valid email address"
                />
              </Form.Item>
              <Form.Item>
                <label className="small-text">Finance Email</label>
                <Input
                  required
                  value={data.emailFinance}
                  onChange={e => this.changeInput(e, 'emailFinance')}
                  type="email"
                  pattern={REGEX_CONFIG.email}
                  title="Please enter valid email address"
                />
              </Form.Item>
            </div>
            <Divider />
            <Form.Item>
              <div className="app-actions__right">
                <Button htmlType="submit" className="btn-oval" loading={loading} type="primary">ADD CLIENT</Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
    )
  }
}

export default CreateClient
