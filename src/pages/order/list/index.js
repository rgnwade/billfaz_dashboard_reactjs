import React, { Component } from 'react'
import { Card, Modal, Table, message } from 'antd'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import TableControl from '../../../components/table-control'
import { columns } from './column'
import { OrderApi } from '../../../api'
import MENU from '../../../config/menu'
import ModalStatus from '../modal'
import { getError } from '../../../utils/error/api'
import { ORDER_STATUS } from '../../../config/order'
import { generateUrlQueryParams, parseUrlQueryParams, compareParams } from '../../../utils/url-query-params'
import OrderReport from '../report'
import './order-list.scss'

class OrderList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      data: [],
      total: {},
      params: {
        page: 1,
      },
      valPerPage: 0,
      modal: false,
      modalData: {},
      selected: {},
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

  clickAdvice = (data) => {
    const thisEl = this
    Modal.confirm({
      title: 'Advice Confirmation',
      content: 'Are you sure?',
      onOk() {
        const providerId = data.usedProviders && data.usedProviders.length > 0 ? data.usedProviders[0].id : 0
        if (providerId < 0) return
        const payload = {
          providerId,
          advice: true,
        }
        OrderApi.advice(data.id, payload)
          .then(() => {
            message.success('Advice success')
            thisEl.getData()
          })
          .catch(() => message.error('Advice failed'))
      },
    })
  }

  clickChangeStatus = () => {
    const { modalData, selected } = this.state
    OrderApi.changeStatus(selected.id, { ...modalData, issuedStatus: modalData.issuedStatus || ORDER_STATUS.SUCCESS })
      .then(async () => {
        await this.closeModal()
        await this.getData()
      })
      .catch(err => message.error(getError(err) || 'Change status failed'))
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

  changeFilter = (value, field) => {
    const { params } = this.state
    this.addUrlQueryParamsAndUpdateData({ ...params, page: 1, [field]: value })
  }

  changeModalDataStatus = (issuedStatus) => {
    const { modalData } = this.state
    this.setState({ ...this.state, modalData: { ...modalData, issuedStatus } })
  }

  changeModalDataReference = (e) => {
    const { modalData } = this.state
    this.setState({ ...this.state, modalData: { ...modalData, voucher: e.target.value } })
  }

  clickFilterStatus = (status) => {
    const { params } = this.state
    if (params.filterType === status) return
    this.addUrlQueryParamsAndUpdateData({ ...params, page: 1, filterType: status })
  }

  openModal = (selected) => {
    this.setState({ ...this.state, modal: true, selected })
  }

  closeModal = () => {
    this.setState({ ...this.state, modal: false, selected: {}, modalData: {} })
  }

  getData = async (params = this.state.params) => {
    await this.setState({ ...this.state, loading: true })
    Promise.all([
      OrderApi.get(params),
      OrderApi.getTotal(),
    ])
      .then((res) => {
        this.setState({
          ...this.state,
          data: res[0].data,
          total: res[1].data,
          loading: false,
          params,
          valPerPage: (res[0].data || []).length,
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

  goToDetail = (id) => {
    const { history } = this.props
    history.push(`${MENU.ORDER}/detail/${id}`)
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

  render() {
    const { loading, data, params, valPerPage, modal, modalData } = this.state
    return (
      <div>
        <TableControl
          search={this.search}
          valPage={params.page}
          valPerPage={valPerPage}
          handlePrevPage={this.handlePrevPage}
          handleNextPage={this.handleNextPage}
          loading={loading}
          searchText="#OrderId, !ReferenceID, $Destination Number"
          searchValue={params.query}
          changeSearch={this.changeSearch}
        />
        <OrderReport />
        <Card>
          <Table
            className="table-responsive"
            loading={loading}
            rowKey="id"
            dataSource={data}
            columns={columns(this.goToDetail, this.clickAdvice, this.openModal)}
            pagination={false}
          />
        </Card>
        <ModalStatus
          visible={modal}
          modalOk={this.clickChangeStatus}
          modalClose={this.closeModal}
          data={modalData}
          changeStatus={this.changeModalDataStatus}
          changeReferenceNumber={this.changeModalDataReference}
        />
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
