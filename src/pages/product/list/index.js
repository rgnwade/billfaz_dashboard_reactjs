import React, { Component } from 'react'
import { Card, Select, Table, message } from 'antd'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import TableControl from '../../../components/table-control'
import Filter from '../../../components/filter'
import { columns } from './column'
import { ProductApi, ProviderApi } from '../../../api'
import { OPTIONS_CONFIG_ACTIVE, OPTIONS_CONFIG_PROBLEM } from '../../../config/options'
import { inputMoneyHandler } from '../../../utils/formatter/currency'
import { getError } from '../../../utils/error/api'
import { parseUrlQueryParams, compareParams, generateUrlQueryParams } from '../../../utils/url-query-params'
import MENU from '../../../config/menu'
import { PRODUCT_TABS } from '../../../config/product'
import { hasAccess } from '../../../utils/roles'
import { ROLES_ITEMS } from '../../../config/roles'
import './product-list.scss'

class ProductList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      data: [],
      originalData: [],
      count: 0,
      params: {
        page: 1,
      },
      valPerPage: 0,
      providers: [],
      hasAccessEdit: hasAccess(ROLES_ITEMS.PRODUCT_UPDATE),
      hasAccessEditFields: {
        status: hasAccess(ROLES_ITEMS.PRODUCT_EDIT_STATUS),
        problem: hasAccess(ROLES_ITEMS.PRODUCT_EDIT_PROBLEM),
        description: hasAccess(ROLES_ITEMS.PRODUCT_EDIT_DESCRIPTION),
        price: hasAccess(ROLES_ITEMS.PRODUCT_EDIT_PRICE),
        provider: hasAccess(ROLES_ITEMS.PRODUCT_EDIT_PROVIDER),
      },
    }
  }

  async componentDidMount() {
    const { location } = this.props
    this.getFilterData()
    this.getData(parseUrlQueryParams(location.search))
  }

  componentDidUpdate(prevProps) {
    const { params, loading } = this.state
    const { active, location } = this.props
    if ((active && !loading && compareParams(prevProps.location, location, params)) || (!prevProps.active && active)) {
      this.getData(parseUrlQueryParams(location.search))
    }
  }

  changeFilter = (value, field) => {
    const { params } = this.state
    this.addUrlQueryParamsAndUpdateData({ ...params, page: 1, [field]: value })
  }

  changeSwitch = (checked, idx, field) => {
    const { data } = this.state
    data[idx][field] = checked
    data[idx].isEdited = true
    this.setState({ ...this.state, data })
  }

  changeDescription = (e, idx) => {
    const { data } = this.state
    data[idx].description = e.target.value
    this.setState({ ...this.state, data })
  }

  changePrice = (e, idx) => {
    const { data } = this.state
    data[idx].adminPrice = inputMoneyHandler(e.target.value)
    this.setState({ ...this.state, data })
  }

  changeProvider = (e, idx) => {
    const { data } = this.state
    data[idx].providerId = e.target.value
    data[idx].isEdited = true
    this.setState({ ...this.state, data })
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

  clickEdit = (idx, field) => {
    const { data } = this.state
    data[idx][field] = true
    data[idx].isEdited = true
    this.setState({ ...this.state, data })
  }

  clickSave = async (record) => {
    const { data } = this.state
    const { id, idx, name, description, adminPrice, providerId, problem, active } = record
    const payload = {
      description,
      adminPrice,
      providerId,
      problem,
      active,
    }
    data[idx].loading = true
    await this.setState({ ...this.state, data })
    await ProductApi.update(id, payload)
      .then(() => {
        message.success(`Update ${name} success`)
        data[idx].isEdited = false
        data[idx].isEditDesc = false
        data[idx].isEditPrice = false
        data[idx].loading = false
        this.setState({ ...this.state, data })
      })
      .catch((err) => {
        data[idx].loading = false
        this.setState({ ...this.state, data })
        message.error(getError(err) || `Update ${name} failed`)
      })
  }

  clickCancel = (idx) => {
    const { data, originalData } = this.state
    data[idx] = { ...originalData[idx] }
    this.setState({ ...this.state, data })
  }

  getData = async (params = this.state.params) => {
    await this.setState({ ...this.state, loading: true })
    if (params.active === '') delete params.active
    if (params.problem === '') delete params.problem
    ProductApi.get(params)
      .then((res) => {
        const data = (res.data.data || []).map((dt, idx) => ({ ...dt, idx }))
        this.setState({
          ...this.state,
          data,
          originalData: data.map(dt => ({ ...dt })),
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

  getFilterData = () => {
    ProviderApi.getAll()
      .then((res) => {
        const providers = res.data.providers || []
        providers.unshift({ id: '', name: 'All Providers' })
        this.setState({ ...this.state, providers })
      })
      .catch(() => {})
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

  addUrlQueryParamsAndUpdateData = (params) => {
    this.addUrlQueryParams(params)
    this.getData(params)
  }

  addUrlQueryParams = (params) => {
    const { history } = this.props
    const query = generateUrlQueryParams(params)
    history.push(`${MENU.PRODUCT}/${PRODUCT_TABS.LIST}?${query}`)
  }

  render() {
    const { loading, data, params, valPerPage, providers, hasAccessEdit, hasAccessEditFields } = this.state
    const leftFilter = (
      <div className="flex">
        <div style={{ marginRight: '1em' }}>
          <label className="small-text">Provider:</label>
          <div>
            <Select value={params.providerId || ''} style={{ width: 150 }} onChange={e => this.changeFilter(e, 'providerId')}>
              {
                providers.map(provider => (
                  <Select.Option key={provider.id} value={provider.id}>{provider.name}</Select.Option>
                ))
              }
            </Select>
          </div>
        </div>
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
        <div>
          <label className="small-text">Problem:</label>
          <div>
            <Select value={params.problem || ''} style={{ width: 150 }} onChange={e => this.changeFilter(e, 'problem')}>
              {
                OPTIONS_CONFIG_PROBLEM.map(option => (
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
            className="table-responsive --big"
            loading={loading}
            rowKey="id"
            dataSource={data}
            columns={columns(
              this.changeSwitch,
              this.clickEdit,
              this.clickCancel,
              this.changeDescription,
              this.changePrice,
              this.changeProvider,
              this.clickSave,
              hasAccessEdit,
              hasAccessEditFields,
            )}
            pagination={false}
          />
        </Card>
      </div>
    )
  }
}

ProductList.propTypes = {
  active: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

export default withRouter(ProductList)
