import React, { Component } from 'react'
import { Card, Select, Table, message } from 'antd'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import TableControl from '../../../components/table-control'
import Filter from '../../../components/filter'
import { columns } from './column'
import { ProductApi, ClientApi } from '../../../api'
import { inputMoneyHandler } from '../../../utils/formatter/currency'
import AddProductModal from './modal'
import { OPTIONS_CONFIG_ACTIVE } from '../../../config/options'
import MENU from '../../../config/menu'
import FilterSearch from '../../../components/filter-search'
import { getError } from '../../../utils/error/api'
import { PRODUCT_TABS } from '../../../config/product'
import { generateUrlQueryParams, parseUrlQueryParams, compareParams } from '../../../utils/url-query-params'
import { hasAccess } from '../../../utils/roles'
import { ROLES_ITEMS } from '../../../config/roles'

class ProductClient extends Component {
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
      modal: false,
      modalData: {},
      clients: [],
      selectedClient: {},
      productsAvailable: [],
      hasAccessEdit: hasAccess(ROLES_ITEMS.PRODUCT_CLIENT_EDIT_STATUS),
    }
  }

  async componentDidMount() {
    const { location } = this.props
    await this.setState({ ...this.state, loading: true })
    const clients = await ClientApi.getAll()
      .then(res => res.data.clients || [])
      .catch(() => [])
    const paramsFromProps = parseUrlQueryParams(location.search)
    const selectedClient = this.getSelectedCLientFromProps(clients)
    await this.setState({ ...this.state, clients, selectedClient })
    this.getData({ ...paramsFromProps, clientId: selectedClient.id || 0 })
  }

  async componentDidUpdate(prevProps) {
    const { params, loading, clients } = this.state
    const { active, location } = this.props
    if ((active && !loading && compareParams(prevProps.location, location, params)) || (!prevProps.active && active)) {
      const selectedClient = this.getSelectedCLientFromProps(clients)
      const paramsFromProps = parseUrlQueryParams(location.search)
      await this.setState({ ...this.state, selectedClient })
      this.getData({ ...paramsFromProps, clientId: selectedClient.id || 0 })
    }
  }

  changeModalDataSellPrice = (e) => {
    const { modalData } = this.state
    this.setState({ ...this.state, modalData: { ...modalData, sellPrice: inputMoneyHandler(e.target.value) } })
  }

  changeModalDataProduct = (value) => {
    const { modalData } = this.state
    this.setState({ ...this.state, modalData: { ...modalData, productId: value } })
  }

  changeFilter = (value, field) => {
    const { params } = this.state
    this.addUrlQueryParamsAndUpdateData({ ...params, page: 1, [field]: value })
  }

  changeSwitch = (checked, record) => {
    const clientProduct = record.clientProducts && record.clientProducts.length > 0 ? record.clientProducts[0] : {}
    const { clientId, productId } = clientProduct
    const payload = {
      clientId,
      productId,
      active: checked,
    }
    ProductApi.updateClientProductStatus(payload)
      .then(() => {
        message.success('Update success')
        this.getData()
      })
      .catch(err => message.error(getError(err) || 'Update failed'))
  }

  changeSearch = (e) => {
    const { value } = e.target
    const { params } = this.state
    if (value) {
      this.setState({ ...this.state, params: { ...params, page: 1, searchQuery: value } })
    } else {
      this.addUrlQueryParamsAndUpdateData({ ...params, page: 1, searchQuery: '' })
    }
  }

  clickAddProduct = async () => {
    const { productsAvailable, selectedClient } = this.state
    if (productsAvailable && productsAvailable.length <= 0) {
      await ProductApi.getAvailableProducts(selectedClient.id)
        .then(async (res) => {
          const data = res.data || []
          await this.setState({ ...this.state, productsAvailable: data })
        })
        .catch(() => {})
    }
    this.setState({ ...this.state, modal: true })
  }

  closeModal = () => {
    this.setState({ ...this.state, modal: false, modalData: {} })
  }

  clickModalOk = () => {
    const { modalData, productsAvailable, selectedClient } = this.state
    if (!modalData.productId) return
    const productSelected = productsAvailable.find(product => product.id === modalData.productId) || {}
    const { id, listProviders, active } = productSelected
    const payload = {
      productId: id,
      isNew: true,
      sellPrice: modalData.sellPrice,
      clientId: selectedClient.id,
      listProviders,
      active,
    }
    ProductApi.createClientProduct(payload)
      .then(() => {
        this.closeModal()
        message.success('Add product success. Data has been added to approval list')
      })
      .catch(err => message.error(getError(err) || 'Add product failed'))
  }

  selectFilterSearch = async (item) => {
    const { params, selectedClient } = this.state
    if (item.id === selectedClient.id) return
    await this.setState({ ...this.state, selectedClient: item })
    this.addUrlQueryParamsAndUpdateData({ ...params, page: 1, clientId: item.id })
  }

  getData = async (params = this.state.params) => {
    await this.setState({ ...this.state, loading: true })
    if (params.active === '') delete params.active
    ProductApi.getClientProducts(params)
      .then((res) => {
        const data = (res.data.data || []).map((dt, idx) => ({ ...dt, idx }))
        this.setState({
          ...this.state,
          data,
          count: res.data.count,
          loading: false,
          params,
          valPerPage: data.length,
        })
      })
      .catch(() => {
        this.setState({ ...this.state, loading: false })
      })
  }

  search = (searchValue) => {
    const { params } = this.state
    this.addUrlQueryParamsAndUpdateData({ ...params, page: 1, searchQuery: searchValue })
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
    const { selectedClient } = this.state
    const { history } = this.props
    history.push(`${MENU.PRODUCT}/clients/${selectedClient.id}/detail/${id}`)
  }

  getSelectedCLientFromProps = (clients) => {
    const { location } = this.props
    const paramsFromProps = parseUrlQueryParams(location.search)
    let selectedClient = {}
    if (paramsFromProps.clientId) {
      selectedClient = clients.find(client => client.id.toString() === paramsFromProps.clientId)
      if (!selectedClient) selectedClient = clients.length > 0 ? clients[0] : {}
    } else {
      selectedClient = clients.length > 0 ? clients[0] : {}
    }
    return selectedClient || {}
  }

  addUrlQueryParamsAndUpdateData = (params) => {
    this.addUrlQueryParams(params)
    this.getData(params)
  }

  addUrlQueryParams = (params) => {
    const { history } = this.props
    const query = generateUrlQueryParams(params)
    history.push(`${MENU.PRODUCT}/${PRODUCT_TABS.CLIENTS}?${query}`)
  }

  render() {
    const { loading, data, params, valPerPage, modal, modalData, clients, selectedClient, productsAvailable, hasAccessEdit } = this.state
    const leftFilter = (
      <div className="flex">
        <div style={{ marginRight: '1em' }}>
          <label className="small-text">Active:</label>
          <div>
            <Select value={params.active || ''} style={{ width: 150 }} onChange={e => this.changeFilter(e, 'active')}>
              {
                OPTIONS_CONFIG_ACTIVE.map(option => (
                  <Select.Option key={option.id} value={option.id}>{option.name}</Select.Option>
                ))
              }
            </Select>
          </div>
        </div>
      </div>
    )
    return (
      <div>
        <div className="app-content__filter">
          <FilterSearch options={clients} clickFilter={this.selectFilterSearch} selected={selectedClient} noAll />
        </div>
        <TableControl
          search={this.search}
          valPage={params.page}
          valPerPage={valPerPage}
          handlePrevPage={this.handlePrevPage}
          handleNextPage={this.handleNextPage}
          loading={loading}
          searchText="Product Name or Product code"
          searchValue={params.searchQuery}
          changeSearch={this.changeSearch}
        />
        <Filter left={leftFilter} />
        <Card>
          <Table
            className="table-responsive"
            loading={loading}
            rowKey="id"
            dataSource={data}
            columns={columns(this.goToDetail, this.clickAddProduct, this.changeSwitch, hasAccessEdit)}
            pagination={false}
          />
        </Card>
        <AddProductModal
          visible={modal}
          modalOk={this.clickModalOk}
          modalClose={this.closeModal}
          modalData={modalData}
          changeSellPrice={this.changeModalDataSellPrice}
          productsAvailable={productsAvailable}
          changeProduct={this.changeModalDataProduct}
        />
      </div>
    )
  }
}

ProductClient.propTypes = {
  history: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
}

export default withRouter(ProductClient)
