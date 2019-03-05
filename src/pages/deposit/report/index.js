import React, { Component } from 'react'
import { Button, Card, DatePicker, Modal, Select, message, TimePicker } from 'antd'
import dayjs from 'dayjs'
import { DepositApi } from '../../../api'
import { getError } from '../../../utils/error/api'
import { DEPOSIT_REPORT_STATUS } from '../../../config/deposit'
import './deposit-report.scss'

const formatTime = 'HH:mm';
const formatDate = 'DD-MM-YYYY';

class Report extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {
        action: DEPOSIT_REPORT_STATUS[0].code,
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
          action: data.action,
          dateStart: data.dateStart ? data.dateStart.format('YYYY-MM-DD') : '',
          timeStart: data.timeStart ? data.timeStart.format('HH:mm') : '',
          dateEnd: data.dateEnd ? data.dateEnd.format('YYYY-MM-DD') : '',
          timeEnd: data.timeEnd ? data.timeEnd.format('HH:mm') : '',
        }
        DepositApi.exportData(payload)
        .then((res) => {
          message.success('Export data success')
          const dataExport = new Blob([res.data], { type: 'text/csv' })
            const csvURL = window.URL.createObjectURL(dataExport)
            const element = document.createElement('a')
            element.href = csvURL
            element.setAttribute('download', `export-deposit-${dayjs().format('YYYYMMDDHHmmssSSS')}.csv`)
            document.body.appendChild(element)
            element.click()
            document.body.removeChild(element)
          thisEl.setState({ ...thisEl.state, data: { status: 'all' }, loading: false })
        })
        .catch((err) => {
          message.error(getError(err) || 'Export data failed')
          thisEl.setState({ ...thisEl.state, loading: false })
        })
      },
    })
  }

  changeInput = (value, field) => {
    const { data } = this.state
    this.setState({ ...this.state, data: { ...data, [field]: value } });
  }

  render() {
    const { data, loading } = this.state
    return (
      <div className="order-report">
        <Card>
          <div className="order-report__content">
            <div className="flex">
              <div className="filter-block">
                <label className="small-text">Operation:</label>
                <div>
                  <Select value={data.action} className="filter-input" onChange={e => this.changeInput(e, 'action')}>
                    {
                      DEPOSIT_REPORT_STATUS.map(action => (
                        <Select.Option key={action.code} value={action.code}>{action.name}</Select.Option>
                      ))
                    }
                  </Select>
                </div>
              </div>
              <div className="filter-block">
                <label className="small-text">Date:</label>
                <div>
                  <DatePicker className="filter-input" format={formatDate} value={data.dateStart} onChange={e => this.changeInput(e, 'dateStart')} />
                </div>
              </div>
              <div className="filter-block">
                <label className="small-text">Time:</label>
                <div>
                  <TimePicker className="filter-input" format={formatTime} value={data.timeStart} onChange={e => this.changeInput(e, 'timeStart')} />
                </div>
              </div>
              <div className="filter-block" style={{ marginTop: '26px' }}>
                To
              </div>
              <div className="filter-block">
                <label className="small-text">Date:</label>
                <div>
                  <DatePicker className="filter-input" format={formatDate} value={data.dateEnd} onChange={e => this.changeInput(e, 'dateEnd')} />
                </div>
              </div>
              <div className="filter-block">
                <label className="small-text">Time:</label>
                <div>
                  <TimePicker className="filter-input" format={formatTime} value={data.timeEnd} onChange={e => this.changeInput(e, 'timeEnd')} />
                </div>
              </div>
            </div>
            <Button
              className="btn-oval"
              type="primary"
              loading={loading}
              onClick={this.clickSendReport}
              disabled={!(data.dateStart && data.dateEnd && data.timeStart && data.timeEnd)}
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
