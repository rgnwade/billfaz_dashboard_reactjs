import React, { Component } from 'react'
import { Card, Select, Table } from 'antd'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { numberToMoney } from '../../../utils/formatter/currency'
import TableControl from '../../../components/table-control'
import Filter from '../../../components/filter'
import { ProductApi } from '../../../api'
import { OPTIONS_CONFIG_ACTIVE } from '../../../config/product'
import { parseUrlQueryParams, compareParams, generateUrlQueryParams } from '../../../utils/url-query-params'
import MENU from '../../../config/menu'
// import { PRODUCT_TABS } from '../../../config/product'
// import { hasAccess } from '../../../utils/roles'
// import { ROLES_ITEMS } from '../../../config/roles'
import './product-list.scss'

const columnFields = {
  productName: {
    title: 'Product Name & Code',
    dataIndex:'name',
    key:'name',
    render: (text, data) => (
      <div>
      <div>{text}</div>
      <div>[{data.code}]</div>
      </div>
    ),
  },
  productDescription: {
    title: 'Product Description',
    dataIndex:'description',
    key:'description',
    render: text => (
      <div style={{whiteSpace:'normal'}}>{text}</div>
    ),
  },
  price: {
    title: 'Price',
    dataIndex:'sellPrice',
    key:'sellPrice',
    render: text => (
      <div style={{ width: '100px' }}>{numberToMoney(text)}</div>
    ),
  },
  status: {
    title: 'Status',
    dataIndex:'active',
    key:'active',
    render: text => (
      <div>
        <span className={`apps__status_product --${text ? 'true' : 'false'}`}>{text ? 'Active':'Inactive'}</span>
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
      selected: {},
      // hasAccessEdit: hasAccess(ROLES_ITEMS.PRODUCT_UPDATE),
      // hasAccessEditFields: {
      //   status: hasAccess(ROLES_ITEMS.PRODUCT_EDIT_STATUS),
      // },
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
    // const { type } = this.props
    await this.setState({ ...this.state, loading: true })
    if (params.action === '') delete params.action
   
    try {
      let res = await ProductApi.get(params)
      
      const data = res.data.data
      this.setState({
        ...this.state,
        data: data || [],
        count: res.data.data.count,
        loading: false,
        params,
        valPerPage: (data || []).length ,
      })
    }catch(e) {
      this.setState({ ...this.state, loading: false })
    }
  }

  getFilterData = () => {
    ProductApi.get()
      .then((res) => {
        const active = res.data.active || []
        active.unshift({ id: '', name: 'All Product' })
        this.setState({ ...this.state, active })
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
    console.log(params)
    this.addUrlQueryParamsAndUpdateData({ ...params, page: params.page + 1 })
  }

  addUrlQueryParamsAndUpdateData = (params) => {
    this.addUrlQueryParams(params)
    this.getData(params)
  }

  addUrlQueryParams = (params) => {
    const { history } = this.props
    const query = generateUrlQueryParams(params)
    history.push(`${MENU.PRODUCT}/${query}`)
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
    // console.log(params.active )
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
            className="table-responsive" 
            loading={loading} 
            rowKey="name"
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
  // active: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

export default withRouter(ProductList)
