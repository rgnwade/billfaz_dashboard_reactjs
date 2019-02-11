import React, { Component } from 'react'
import { Button, Card, Divider, Form, Input, message } from 'antd'
import PropTypes from 'prop-types'
import { REGEX_CONFIG } from '../../../config/regex'
import { ClientApi } from '../../../api'
import { getError } from '../../../utils/error/api'
import { ROLES_ITEMS } from '../../../config/roles'
import { DEPOSIT_TYPES } from '../../../config/deposit'
import { hasAccess } from '../../../utils/roles'
import './create.scss'

class CreateNotification extends Component {
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
        <label className="large-text">Notification Deposit Burnout</label>
          <Form onSubmit={this.submitForm}>
            <div className="client-create__group-input">
              <Form.Item>
                <label className="small-text">Batas minimum deposit</label>
                <Input
                  required
                  value={data.name}
                  onChange={e => this.changeInput(e, 'name')}
                />
              </Form.Item>
              <label className="large-text">Notifikasi sisa deposit akan dikirimkan ke alamat email yang kamu isi dibawah</label>
              <Form.Item>
                <label className="small-text">Add email</label>
                <Input
                  required
                  value={data.code}
                  onChange={e => this.changeInput(e, 'code')}
                />
              </Form.Item>
            </div>
            <Divider />
            <Form.Item>
              <div className="app-actions__right">
                <Button htmlType="submit" className="btn-oval" loading={loading} type="primary">SAVE</Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
    )
  }
}

export default CreateNotification
