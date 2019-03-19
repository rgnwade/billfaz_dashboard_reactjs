import React, { Component } from 'react'
import { Card, Table, DatePicker, Modal, Select, message, Button } from 'antd'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import { getError } from '../../../utils/error/api'
import { ORDER_REPORT_STATUS } from '../../../config/order'

import TableControl from '../../../components/table-control'
import { columns } from './column'
import { OrderApi } from '../../../api'
import MENU from '../../../config/menu'
import { generateUrlQueryParams, parseUrlQueryParams, compareParams } from '../../../utils/url-query-params'
import OrderReport from '../report'
import './order-list.scss'

class OrderList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      data: [],
      datas: {
        status: 'all',
      },
      params: {
        page: 1,
      },
      valPerPage: 0,
    }
  }

  componentDidMount() {
    const { location } = this.props
    this.getData(parseUrlQueryParams(location.search))
  }

  componentDidUpdate(prevProps) {
    const { params, loading } = this.state
    const { active, location } = this.props
    if ((active && !loading && compareParams(prevProps.location, location, params)) || (!prevProps.active && active)) {
      this.getData(parseUrlQueryParams(location.search))
    }
  }

  changeSearch = (e) => {
    const { value } = e.target
    const { params } = this.state
    if (value) {
      this.setState({ ...this.state, params: { ...params, page: 1, query: value } })
    } else {
      this.addUrlQueryParamsAndUpdateData({ ...params, page: 1, query: '' })
    }
  }

  getData = async (params = this.state.params) => {
    await this.setState({ ...this.state, loading: true })
    OrderApi.get(params)
      .then((res) => {
        this.setState({
          ...this.state,
          data: res.data,
          loading: false,
          params,
          valPerPage: (res.data || []).length,
        })
      })
      .catch(() => {
        this.setState({ ...this.state, loading: false })
      })
  }

  search = (searchValue) => {
    const { params } = this.state
    this.addUrlQueryParamsAndUpdateData({ ...params, page: 1, query: searchValue })
  }

  handlePrevPage = () => {
    const { params } = this.state
    this.addUrlQueryParamsAndUpdateData({ ...params, page: params.page - 1 })
  }

  handleNextPage = () => {
    const { params } = this.state
    this.addUrlQueryParamsAndUpdateData({ ...params, page: params.page + 1 })
  }

  addUrlQueryParamsAndUpdateData = (params) => {
    this.addUrlQueryParams(params)
    this.getData(params)
  }

  addUrlQueryParams = (params) => {
    const { history } = this.props
    const query = generateUrlQueryParams(params)
    history.push(`${MENU.ORDER}/list?${query}`)
  }

  changeFilter = (value, field) => {
    const { params } = this.state
    this.addUrlQueryParamsAndUpdateData({ ...params, page: 1, filterType: value})
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
    const { loading, data, params, valPerPage, datas } = this.state
    return (
      <div>
        <TableControl
          search={this.search}
          valPage={params.page}
          valPerPage={valPerPage}
          handlePrevPage={this.handlePrevPage}
          handleNextPage={this.handleNextPage}
          loading={loading}
          searchText="#Order ID, $Customer Number"
          searchValue={params.query}
          changeSearch={this.changeSearch}
          changeValue={params.query}
        />

        {/* export */}
        <div className="order-report">
        <Card>
          <div className="order-report__content">
            <div className="flex">
              <div style={{ marginRight: '1em' }}>
                <label className="small-text">Status:</label>
                <div>
                  <Select defaultValue="All Status" style={{ width: 150 }} onChange={e => this.changeFilter(e, 'status')}>
                    {
                      ORDER_REPORT_STATUS.map(status => (
                        <Select.Option key={status.code}  value={status.title}>{status.name}</Select.Option>
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

        <Card>
          <Table
            className="table-responsive"
            loading={loading}
            rowKey="orderId"
            dataSource={data}
            columns={columns()}
            pagination={false}
          />
        </Card>
      </div>
    )
  }
}

OrderList.propTypes = {
  active: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default withRouter(OrderList)
