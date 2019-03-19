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
      datas: {
        action: DEPOSIT_REPORT_STATUS[0].code,
      },
      loading: false,
    }
  }

  clickSendReport = async () => {
    const { datas } = this.state
    const thisEl = this
    await this.setState({ ...this.state, loading: true })
    Modal.confirm({
      title: 'Export Data Confirmation',
      content: 'This data will be downloaded to your device',
      onOk() {
        const payload = {
          filterType: 'period',
          action: datas.action,
          dateStart: datas.dateStart ? datas.dateStart.format('YYYY-MM-DD') : '',
          timeStart: datas.timeStart ? datas.timeStart.format('HH:mm') : '',
          dateEnd: datas.dateEnd ? datas.dateEnd.format('YYYY-MM-DD') : '',
          timeEnd: datas.timeEnd ? datas.timeEnd.format('HH:mm') : '',
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
          thisEl.setState({ ...thisEl.state, datas: { status: 'all' }, loading: false })
        })
        .catch((err) => {
          message.error(getError(err) || 'Export data failed')
          thisEl.setState({ ...thisEl.state, loading: false })
        })
      },
    })
  }

  changeInput = (value, field) => {
    const { datas } = this.state
    this.setState({ ...this.state, datas: { ...datas, [field]: value } });
  }

  render() {
    const { datas, loading } = this.state
    return (
      <div className="order-report">
        <Card>
          <div className="order-report__content">
            <div className="flex">
              <div className="filter-block">
                <label className="small-text">Operation:</label>
                <div>
                  <Select value={datas.action} className="filter-input" onChange={e => this.changeInput(e, 'action')}>
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
                  <DatePicker className="filter-input" format={formatDate} value={datas.dateStart} onChange={e => this.changeInput(e, 'dateStart')} />
                </div>
              </div>
              <div className="filter-block">
                <label className="small-text">Time:</label>
                <div>
                  <TimePicker className="filter-input" format={formatTime} value={datas.timeStart} onChange={e => this.changeInput(e, 'timeStart')} />
                </div>
              </div>
              <div className="filter-block" style={{ marginTop: '26px' }}>
                To
              </div>
              <div className="filter-block">
                <label className="small-text">Date:</label>
                <div>
                  <DatePicker className="filter-input" format={formatDate} value={datas.dateEnd} onChange={e => this.changeInput(e, 'dateEnd')} />
                </div>
              </div>
              <div className="filter-block">
                <label className="small-text">Time:</label>
                <div>
                  <TimePicker className="filter-input" format={formatTime} value={datas.timeEnd} onChange={e => this.changeInput(e, 'timeEnd')} />
                </div>
              </div>
            </div>
            <Button
              className="btn-oval"
              type="primary"
              loading={loading}
              onClick={this.clickSendReport}
              disabled={!(datas.dateStart && datas.dateEnd && datas.timeStart && datas.timeEnd)}
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
