import React, { Component } from 'react'
import { Card, Modal, Select, Table, message } from 'antd'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import TableControl from '../../../components/table-control'
import Filter from '../../../components/filter'
import { columns } from './column'
import { OrderApi, ClientApi, ProviderApi } from '../../../api'
import MENU from '../../../config/menu'
import ModalStatus from '../modal'
import { OPTIONS_CONFIG_ORDER_STATUS, FILTER_ORDER_STATUS } from '../../../config/options'
import { getError } from '../../../utils/error/api'
import { ORDER_STATUS } from '../../../config/order'
import { generateUrlQueryParams, parseUrlQueryParams, compareParams } from '../../../utils/url-query-params'
import Role from '../../../components/role'
import { ROLES_ITEMS } from '../../../config/roles'
import { hasAccess } from '../../../utils/roles'
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
      providers: [],
      clients: [],
    }
  }

  componentDidMount() {
    const { location } = this.props
    this.getData(parseUrlQueryParams(location.search))
    this.getFilterData()
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

  getFilterData = () => {
    Promise.all([
      ClientApi.getAll(),
      ProviderApi.getAll(),
    ])
      .then((res) => {
        const clients = res[0].data.clients || []
        clients.unshift({ id: '', name: 'All Clients' })
        const providers = res[1].data.providers || []
        providers.unshift({ id: '', name: 'All Providers' })
        this.setState({ ...this.state, clients, providers })
      })
      .catch(() => {})
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
    const { loading, data, params, valPerPage, modal, modalData, clients, providers, total } = this.state
    // const leftFilter = (
    //   <div className="flex">
    //     <Role roleItem={ROLES_ITEMS.ORDER_FILTER_PROVIDER} style={{ marginRight: '1em' }}>
    //       <div>
    //         <label className="small-text">Provider:</label>
    //         <div>
    //           <Select value={params.providerId || ''} style={{ width: 150 }} onChange={e => this.changeFilter(e, 'providerId')}>
    //             {
    //               providers.map(provider => (
    //                 <Select.Option key={provider.id} value={provider.id.toString()}>{provider.name}</Select.Option>
    //               ))
    //             }
    //           </Select>
    //         </div>
    //       </div>
    //     </Role>
    //     <Role roleItem={ROLES_ITEMS.ORDER_FILTER_CLIENT} style={{ marginRight: '1em' }}>
    //       <label className="small-text">Client:</label>
    //       <div>
    //         <Select value={params.clientId || ''} style={{ width: 150 }} onChange={e => this.changeFilter(e, 'clientId')}>
    //           {
    //             clients.map(client => (
    //               <Select.Option key={client.id} value={client.id.toString()}>{client.name}</Select.Option>
    //             ))
    //           }
    //         </Select>
    //       </div>
    //     </Role>
    //     <Role roleItem={ROLES_ITEMS.ORDER_FILTER_STATUS}>
    //       <label className="small-text">Order Status:</label>
    //       <div>
    //         <Select value={params.filterType || ''} style={{ width: 150 }} onChange={e => this.changeFilter(e, 'filterType')}>
    //           {
    //             OPTIONS_CONFIG_ORDER_STATUS.map(status => (
    //               <Select.Option key={status.id} value={status.id}>{status.name}</Select.Option>
    //             ))
    //           }
    //         </Select>
    //       </div>
    //     </Role>
    //   </div>
    // )
    // const rightFilter = (
    //   <div className="flex">
    //     <div
    //       className={`order-list__summary-item ${(loading || !hasAccess(ROLES_ITEMS.ORDER_FILTER_STATUS)) ? '--disabled' : ''}`}
    //       onClick={loading || !hasAccess(ROLES_ITEMS.ORDER_FILTER_STATUS) ? () => {} : () => this.clickFilterStatus(FILTER_ORDER_STATUS.PENDING)}
    //     >
    //       <div className="order-list__summary-item-value --pending">{total.pending || 0}</div>
    //       <div>PENDING</div>
    //     </div>
    //     <div
    //       className={`order-list__summary-item ${(loading || !hasAccess(ROLES_ITEMS.ORDER_FILTER_STATUS)) && '--disabled'}`}
    //       onClick={loading || !hasAccess(ROLES_ITEMS.ORDER_FILTER_STATUS) ? () => {} : () => this.clickFilterStatus(FILTER_ORDER_STATUS.ERROR)}
    //     >
    //       <div className="order-list__summary-item-value --error">{total.failed || 0}</div>
    //       <div>ERROR</div>
    //     </div>
    //   </div>
    // )
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
        {/* <Filter left={leftFilter} right={rightFilter} /> */}
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
