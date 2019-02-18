import React, { Component } from 'react'
import { Card, Select, Table, Tag } from 'antd'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import TableControl from '../../../components/table-control'
import Filter from '../../../components/filter'
import { ProductApi, ProviderApi } from '../../../api'
import { OPTIONS_CONFIG_ACTIVE } from '../../../config/options'
import { parseUrlQueryParams, compareParams, generateUrlQueryParams } from '../../../utils/url-query-params'
import MENU from '../../../config/menu'
import { PRODUCT_TABS } from '../../../config/product'
import { hasAccess } from '../../../utils/roles'
import { ROLES_ITEMS } from '../../../config/roles'
import './product-list.scss'

const columnFields = {
  productName: {
    title: 'Product Name & Code',
    dataIndex:'name',
    key:'name',
    render: text => (
      <div>{text}</div>
    ),
  },
  productDescription: {
    title: 'Product Description',
    dataIndex:'description',
    key:'description',
    render: text => (
      <div>{text}</div>
    ),
  },
  price: {
    title: 'Price',
    dataIndex:'sellPrice',
    key:'sellPrice',
    render: text => (
      <div>{text}</div>
    ),
  },
  status: {
    title: 'Status',
    dataIndex:'active',
    key:'active',
    render: text => (
      <div style={{ width: '150px' }}>
        <span className={`app__status --${text ? 'deposit' : 'refund'}`}>{text ? 'Active':'Inactive'}</span>
      </div>
    ),
  },

}

const columns = [
columnFields.productName,
columnFields.productDescription,
columnFields.price,
columnFields.status
];

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

  changeSearch = (e) => {
    const { value } = e.target
    const { params } = this.state
    if (value) {
      this.setState({ ...this.state, params: { ...params, page: 1, searchQuery: value } })
    } else {
      this.addUrlQueryParamsAndUpdateData({ ...params, page: 1, searchQuery: '' })
    }
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
    const { loading, data, params, valPerPage } = this.state
    const leftFilter = (
      <div className="flex">
        <div style={{ marginRight: '1em' }}>
          <label className="small-text">Product Status:</label>
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
            dataSource={data}
            columns={columns} 
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
