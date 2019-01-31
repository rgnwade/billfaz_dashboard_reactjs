import React, { Component } from 'react'
import { Button, Card, DatePicker, Modal, Select, message } from 'antd'

import { ClientApi, OrderApi } from '../../../api'
import { getError } from '../../../utils/error/api'
import './order-report.scss'

class Report extends Component {
  constructor(props) {
    super(props)
    this.state = {
      clients: [],
      data: {
        clientId: '',
      },
      loading: false,
    }
  }

  componentDidMount() {
    this.getFilterData()
  }

  clickSendReport = async () => {
    const { data } = this.state
    const thisEl = this
    await this.setState({ ...this.state, loading: true })
    Modal.confirm({
      title: 'Send Report Confirmation',
      content: 'Are you sure?',
      onOk() {
        const payload = {
          filterType: 'period',
          clientId: data.clientId || '',
          startDate: data.startDate ? data.startDate.format('YYYY-MM-DD') : '',
          endDate: data.endDate ? data.endDate.format('YYYY-MM-DD') : '',
        }
        OrderApi.sendReport(payload)
          .then((res) => {
            Modal.success({ title: `Send report for ${res.data} order success` })
            thisEl.setState({ ...thisEl.state, data: {}, loading: false })
          })
          .catch((err) => {
            message.error(getError(err) || 'Send report failed')
            thisEl.setState({ ...thisEl.state, loading: false })
          })
      },
    })
  }

  changeInput = (value, field) => {
    const { data } = this.state
    this.setState({ ...this.state, data: { ...data, [field]: value } })
  }

  getFilterData = () => {
    ClientApi.getAll()
      .then((res) => {
        const clients = res.data.clients || []
        clients.unshift({ id: '', name: 'All Clients' })
        this.setState({ ...this.state, clients })
      })
      .catch(() => {})
  }

  render() {
    const { clients, data, loading } = this.state
    return (
      <div className="order-report">
        <Card>
          <div className="order-report__content">
            <div className="flex">
              <div style={{ marginRight: '1em' }}>
                <label className="small-text">Client:</label>
                <div>
                  <Select defaultValue="" value={data.clientId} style={{ width: 150 }} onChange={e => this.changeInput(e, 'clientId')}>
                    {
                      clients.map(client => (
                        <Select.Option key={client.id} value={client.id}>{client.name}</Select.Option>
                      ))
                    }
                  </Select>
                </div>
              </div>
              <div style={{ marginRight: '0.5em' }}>
                <label className="small-text">Date:</label>
                <div>
                  <DatePicker style={{ width: 150 }} value={data.startDate} onChange={e => this.changeInput(e, 'startDate')} />
                </div>
              </div>
              <div style={{ marginRight: '1em', marginTop: '29px' }}>
                To
              </div>
              <div style={{ marginRight: '0.5em' }}>
                <label className="small-text">Date:</label>
                <div>
                  <DatePicker style={{ width: 150 }} value={data.endDate} onChange={e => this.changeInput(e, 'endDate')} />
                </div>
              </div>
            </div>
            <Button
              className="btn-oval"
              type="primary"
              loading={loading}
              onClick={this.clickSendReport}
              disabled={!(data.startDate && data.endDate)}
            >
              SEND REPORT
            </Button>
          </div>
        </Card>
      </div>
    )
  }
}

export default Report
