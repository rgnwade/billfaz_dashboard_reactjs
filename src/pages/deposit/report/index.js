import React, { Component } from 'react'
import { Button, Card, DatePicker, Modal, Select, message, TimePicker } from 'antd'

import { DepositApi } from '../../../api'
import { getError } from '../../../utils/error/api'
import { DEPOSIT_REPORT_STATUS } from '../../../config/deposit'
import './deposit-report.scss'

const formatTime = 'HH:mm';

class Report extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {
        action: '',
      },
      loading: false,
    }
  }

  clickSendReport = async () => {
    const { data } = this.state
    const thisEl = this
    await this.setState({ ...this.state, loading: true })
    Modal.confirm({
      title: 'Export Data Confirmation',
      content: 'This data will be downloaded to your device',
      onOk() {
        const payload = {
          filterType: 'period',
          action: data.action || '',
          dateStart: data.dateStart ? data.dateStart.format('YYYY-MM-DD') : '',
          timeStart: data.timeStart ? data.timeStart.format('HH:mm') : '',
          dateEnd: data.dateEnd ? data.dateEnd.format('YYYY-MM-DD') : '',
          timeEnd: data.timeEnd ? data.timeEnd.format('HH:mm') : '',
        }
        DepositApi.exportData(payload)
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

  render() {
    const { data, loading } = this.state
    return (
      <div className="order-report">
        <Card>
          <div className="order-report__content">
            <div className="flex">
              <div style={{ marginRight: '1em' }}>
                <label className="small-text">Operation:</label>
                <div>
                  <Select defaultValue="" value={data.action} style={{ width: 150 }} onChange={e => this.changeInput(e, 'action')}>
                    {
                      DEPOSIT_REPORT_STATUS.map(action => (
                        <Select.Option key={action.code} value={action.code}>{action.name}</Select.Option>
                      ))
                    }
                  </Select>
                </div>
              </div>
              <div style={{ marginRight: '0.5em' }}>
                <label className="small-text">Date:</label>
                <div>
                  <DatePicker style={{ width: 150 }} value={data.dateStart} onChange={e => this.changeInput(e, 'dateStart')} />
                </div>
              </div>
              <div style={{ marginRight: '0.5em' }}>
                <label className="small-text">Time:</label>
                <div>
                  <TimePicker style={{ width: 150 }} format={formatTime} value={data.timeStart} onChange={e => this.changeInput(e, 'timeStart')} />
                </div>
              </div>
              <div style={{ marginRight: '1em', marginTop: '29px' }}>
                To
              </div>
              <div style={{ marginRight: '0.5em' }}>
                <label className="small-text">Date:</label>
                <div>
                  <DatePicker style={{ width: 150 }} value={data.dateEnd} onChange={e => this.changeInput(e, 'dateEnd')} />
                </div>
              </div>
              <div style={{ marginRight: '0.5em' }}>
                <label className="small-text">Time:</label>
                <div>
                  <TimePicker style={{ width: 150 }} format={formatTime} value={data.timeEnd} onChange={e => this.changeInput(e, 'timeEnd')} />
                </div>
              </div>
            </div>
            <Button
              className="btn-oval"
              type="primary"
              loading={loading}
              onClick={this.clickSendReport}
              disabled={!(data.dateStart && data.dateEnd)}
            >
              EXPORT DATA
            </Button>
          </div>
        </Card>
      </div>
    )
  }
}

export default Report
