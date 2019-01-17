import React, { Component } from 'react'
import { Card, Table, message } from 'antd'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import TableControl from '../../../components/table-control'
import columns from './columns'
import { DepositApi } from '../../../api'
import TopupModal from '../modal'
import { moneyToNumber } from '../../../utils/formatter/currency'
import { getErrorMessage } from '../../../utils/error/api'
import { DEPOSIT_TYPES } from '../../../config/deposit'
import { generateUrlQueryParams, parseUrlQueryParams, compareParams } from '../../../utils/url-query-params'
import MENU from '../../../config/menu'
import { hasAccess } from '../../../utils/roles'
import { ROLES_ITEMS } from '../../../config/roles'

class ClientDeposit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      data: [],
      count: 0,
      params: {
        page: 1,
      },
      valPerPage: 0,
      selected: {},
      modal: false,
      modalData: {},
    }
  }

  componentDidMount() {
    const { location } = this.props
    this.getData(parseUrlQueryParams(location.search))
  }

  componentDidUpdate(prevProps) {
    const { params, loading } = this.state
    const { location, active } = this.props
    if ((active && !loading && compareParams(prevProps.location, location, params)) || (!prevProps.active && active)) {
      this.getData(parseUrlQueryParams(location.search))
    }
  }

  changeModalDataAmount = (e) => {
    const { modalData } = this.state
    const val = Number.isNaN(parseInt(e.target.value, 10))
      ? e.target.value
      : moneyToNumber(e.target.value)
    this.setState({ ...this.state, modalData: { ...modalData, amount: val || 0 } })
  }

  changeModalDataDate = (date) => {
    const { modalData } = this.state
    this.setState({ ...this.state, modalData: { ...modalData, date } })
  }

  clickTopup = (selected) => {
    this.setState({ ...this.state, modal: true, selected })
  }

  closeModal = () => {
    this.setState({ ...this.state, modal: false, selected: {}, modalData: {} })
  }

  modalOk = () => {
    const { type } = this.props
    const { selected, modalData } = this.state
    if (!(modalData.amount && modalData.date)) return
    const payload = {
      amount: modalData.amount,
      date: modalData.date.format('YYYY-MM-DD'),
    }
    DepositApi.topup(type, selected.id, payload)
      .then(async () => {
        message.success('Top up success')
        await this.closeModal()
        this.getData()
      })
      .catch(err => message.error(getErrorMessage(err) || 'Top up failed'))
  }

  getData = async (params = this.state.params) => {
    const { type } = this.props
    await this.setState({ ...this.state, loading: true })
    DepositApi.get(type, params)
      .then((res) => {
        const data = type === DEPOSIT_TYPES.CLIENTS ? res.data.deposits : res.data
        this.setState({
          ...this.state,
          data: data || [],
          count: res.data.count,
          loading: false,
          params,
          valPerPage: (data || []).length,
        })
      })
      .catch(() => {
        this.setState({ ...this.state, loading: false })
      })
  }

  changeSearch = (e) => {
    const { value } = e.target
    const { params } = this.state
    if (value) {
      this.setState({ ...this.state, params: { ...params, page: 1, code: value } })
    } else {
      this.addUrlQueryParamsAndUpdateData({ ...params, page: 1, code: '' })
    }
  }

  search = (searchValue) => {
    const { params } = this.state
    this.addUrlQueryParamsAndUpdateData({ ...params, page: 1, code: searchValue })
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
    const { history, type } = this.props
    const query = generateUrlQueryParams(params)
    history.push(`${MENU.DEPOSIT}/${type}?${query}`)
  }

  render() {
    const { loading, data, params, valPerPage, modal, modalData, selected } = this.state
    const { type } = this.props
    return (
      <div>
        <TableControl
          search={this.search}
          valPage={params.page}
          valPerPage={valPerPage}
          handlePrevPage={this.handlePrevPage}
          handleNextPage={this.handleNextPage}
          loading={loading}
          searchText={type === DEPOSIT_TYPES.CLIENTS ? 'Client Code' : 'Provider Name'}
          disableSearch={type === DEPOSIT_TYPES.PROVIDERS}
          searchValue={params.code}
          changeSearch={this.changeSearch}
        />
        <Card>
          <Table
            className="table-responsive"
            loading={loading}
            rowKey={type === DEPOSIT_TYPES.CLIENTS ? 'id' : 'provider'}
            dataSource={data}
            columns={columns[type](this.clickTopup, hasAccess(ROLES_ITEMS.DEPOSIT_TOPUP))}
            pagination={false}
          />
        </Card>
        <TopupModal
          data={selected}
          visible={modal}
          modalOk={this.modalOk}
          modalClose={this.closeModal}
          modalData={modalData}
          changeAmount={this.changeModalDataAmount}
          changeDate={this.changeModalDataDate}
        />
      </div>
    )
  }
}

ClientDeposit.propTypes = {
  type: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default withRouter(ClientDeposit)
