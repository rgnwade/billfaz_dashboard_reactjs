import React, { Component } from 'react'
import { Button, Card, DatePicker, Modal, Select, message } from 'antd'
import dayjs from 'dayjs'

import { OrderApi } from '../../../api'
import { getError } from '../../../utils/error/api'
import { ORDER_REPORT_STATUS } from '../../../config/order'
import './order-report.scss'

class Report extends Component {
  constructor(props) {
    super(props)
    this.state = {
      datas: {
        status: 'all',
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
      content: 'Are you sure?',
      onOk() {
        const payload = {
          issuedStatus: datas.status || '',
          dateStart: datas.startDate ? datas.startDate.format('YYYY-MM-DD') : '',
          dateEnd: datas.endDate ? datas.endDate.format('YYYY-MM-DD') : '',
        }
        OrderApi.export(payload)
          .then((res) => {
            message.success('Export data success')
            const dataExport = new Blob([res.data], { type: 'text/csv' })
            const csvURL = window.URL.createObjectURL(dataExport)
            const element = document.createElement('a')
            element.href = csvURL
            element.setAttribute('download', `export-order-${dayjs().format('YYYYMMDDHHmmssSSS')}.csv`)
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
    this.setState({ ...this.state, datas: { ...datas, [field]: value } })
  }
  

  render() {
    const { datas, loading } = this.state
    return (
      <div className="order-report">
        <Card>
          <div className="order-report__content">
            <div className="flex">
              <div style={{ marginRight: '1em' }}>
                <label className="small-text">Status:</label>
                <div>
                  <Select defaultValue={datas.status} value={datas.status} style={{ width: 150 }} onChange={e => this.changeInput(e, 'status')}>
                    {
                      ORDER_REPORT_STATUS.map(status => (
                        <Select.Option key={status.code} value={status.code}>{status.name}</Select.Option>
                      ))
                    }
                  </Select>
                </div>
              </div>
              <div style={{ marginRight: '1em' }}>
                <label className="small-text">Date:</label>
                <div>
                  <DatePicker style={{ width: 150 }} value={datas.startDate} onChange={e => this.changeInput(e, 'startDate')} />
                </div>
              </div>
              <div style={{ marginTop: '29px', marginRight: '10px' }}>
                To
              </div>
              <div style={{ marginRight: '0.5em' }}>
                <label className="small-text">Date:</label>
                <div>
                  <DatePicker style={{ width: 150 }} value={datas.endDate} onChange={e => this.changeInput(e, 'endDate')} />
                </div>
              </div>
            </div>
            <Button
              className="btn-oval"
              type="primary"
              loading={loading}
              onClick={this.clickSendReport}
              disabled={!(datas.startDate && datas.endDate)}
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
