import React, { Component } from 'react'
import { Button, Card, DatePicker, Icon, Input, Modal, Select, TimePicker, message } from 'antd'

import { ORDER_REPORT_TYPES } from '../../../config/order'
import { ClientApi, OrderApi } from '../../../api'
import { getError } from '../../../utils/error/api'
import './order-report.scss'

class Report extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: ORDER_REPORT_TYPES.SEARCH,
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

  clickActive = type => this.setState({ ...this.state, active: type })

  clickSendReport = async () => {
    const { active, data } = this.state
    const thisEl = this
    await this.setState({ ...this.state, loading: true })
    Modal.confirm({
      title: 'Send Report Confirmation',
      content: 'Are you sure?',
      onOk() {
        let payload = {}
        if (active === ORDER_REPORT_TYPES.SEARCH) {
          payload = {
            filterType: 'id',
            orderIds: data.orderIds,
          }
        } else {
          payload = {
            filterType: 'period',
            clientId: data.clientId || '',
            startDate: data.startDate ? data.startDate.format('YYYY-MM-DD') : '',
            endDate: data.endDate ? data.endDate.format('YYYY-MM-DD') : '',
            startTime: data.startTime ? data.startTime.format('HH:mm:ss') : '',
            endTime: data.endTime ? data.endTime.format('HH:mm:ss') : '',
          }
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

  changeOrderIds = (e) => {
    const { data } = this.state
    this.setState({ ...this.state, data: { ...data, orderIds: e.target.value } })
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
    const { active, clients, data, loading } = this.state
    return (
      <div className="order-report">
        <div className="order-report__filter">
          <label>Send Report by</label>
          <Button.Group className="order-report__btn-group">
            <Button
              className={active === ORDER_REPORT_TYPES.SEARCH ? '--active' : ''}
              onClick={() => this.clickActive(ORDER_REPORT_TYPES.SEARCH)}
            >
              Search by Order Id
            </Button>
            <Button
              className={active === ORDER_REPORT_TYPES.FILTER ? '--active' : ''}
              onClick={() => this.clickActive(ORDER_REPORT_TYPES.FILTER)}
            >
              Filter by Time Period
            </Button>
          </Button.Group>
        </div>
        <Card>
          <div className="order-report__content">
            <div>
              { active === ORDER_REPORT_TYPES.SEARCH && (
                <Input
                  className="order-report__search"
                  prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Search by #OrderId, #OrderId"
                  style={{ width: 300 }}
                  value={data.orderIds}
                  onChange={this.changeOrderIds}
                />
              )}
              { active === ORDER_REPORT_TYPES.FILTER && (
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
                  <div style={{ marginRight: '1em' }}>
                    <label className="small-text">Time:</label>
                    <div>
                      <TimePicker value={data.startTime} onChange={e => this.changeInput(e, 'startTime')} format="HH:mm" />
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
                  <div style={{ marginRight: '1em' }}>
                    <label className="small-text">Time:</label>
                    <div>
                      <TimePicker value={data.endTime} onChange={e => this.changeInput(e, 'endTime')} format="HH:mm" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Button
              className="btn-oval"
              type="primary"
              loading={loading}
              onClick={this.clickSendReport}
              disabled={(active === ORDER_REPORT_TYPES.SEARCH && !data.orderIds)
                || (active === ORDER_REPORT_TYPES.FILTER && !(data.startDate && data.startTime && data.endDate && data.endTime))}
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
