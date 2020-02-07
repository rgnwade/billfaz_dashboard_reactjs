import React, { Component } from 'react'
import { Card, Table, message } from 'antd'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import TableControl from '../../../components/table-control'
import { columns } from './column'
import { ProductApi } from '../../../api'
import { getError } from '../../../utils/error/api'
import { parseUrlQueryParams, compareParams, generateUrlQueryParams } from '../../../utils/url-query-params'
import MENU from '../../../config/menu'
import { PRODUCT_TABS } from '../../../config/product'
import { inputMoneyHandler } from '../../../utils/formatter/currency'
import { hasAccess } from '../../../utils/roles'
import { ROLES_ITEMS } from '../../../config/roles'

class ProductApproval extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      data: [],
      params: {
        page: 1,
      },
      valPerPage: 0,
      hasAccessEdit: hasAccess(ROLES_ITEMS.PRODUCT_CLIENT_EDIT_PRICE),
      hasAccessApproval: hasAccess(ROLES_ITEMS.PRODUCT_APPROVAL_ACTION),
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

  getData = async (params = this.state.params) => {
    await this.setState({ ...this.state, loading: true })
    ProductApi.getClientProductHistories(params)
      .then((res) => {
        const data = (res.data || []).map((dt, idx) => ({ ...dt, idx }))
        this.setState({
          ...this.state,
          data,
          originalData: data.map(dt => ({ ...dt })),
          loading: false,
          params,
          valPerPage: (res.data || []).length,
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
      this.setState({ ...this.state, params: { ...params, page: 1, query: value } })
    } else {
      this.addUrlQueryParamsAndUpdateData({ ...params, page: 1, query: '' })
    }
  }

  changePrice = (e, idx) => {
    const { data } = this.state
    data[idx].sellPrice = inputMoneyHandler(e.target.value)
    this.setState({ ...this.state, data })
  }

  clickEdit = (idx, edit) => {
    const { data, originalData } = this.state
    if (!edit) {
      data[idx] = { ...originalData[idx] }
    }
    data[idx].isEdited = edit
    this.setState({ ...this.state, data })
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
    history.push(`${MENU.PRODUCT}/${PRODUCT_TABS.APPROVAL}?${query}`)
  }

  clickApproval = async (id, record, approvalStatus) => {
    const { data } = this.state
    const { idx } = record
    data[idx][`${approvalStatus}Loading`] = true
    await this.setState({ ...this.state, data })
    ProductApi.clientProductApproval(id, { status: approvalStatus })
      .then(() => {
        message.success(`Update ${id} success`)
        this.getData()
      })
      .catch((err) => {
        data[idx][`loading${approvalStatus}`] = false
        this.setState({ ...this.state, data })
        message.error(getError(err) || `Update ${id} failed`)
      })
  }

  clickSave = async (record) => {
    const { data } = this.state
    const { id, idx, sellPrice } = record
    data[idx].loading = true
    await this.setState({ ...this.state, data })
    await ProductApi.updateClientProduct(id, { sellPrice })
      .then(() => {
        message.success(`Update ${record.product && record.product.name} success`)
        data[idx].isEdited = false
        data[idx].loading = false
        this.setState({ ...this.state, data })
      })
      .catch((err) => {
        data[idx].loading = false
        this.setState({ ...this.state, data })
        message.error(getError(err) || `Update ${record.product && record.product.name} failed`)
      })
  }

  render() {
    const { loading, valPerPage, data, params, hasAccessEdit, hasAccessApproval } = this.state
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
          searchValue={params.query}
          changeSearch={this.changeSearch}
        />
        <Card>
          <Table
            className="table-responsive"
            loading={loading}
            rowKey="id"
            dataSource={data}
            columns={columns(
              this.clickApproval,
              this.clickEdit,
              this.changePrice,
              this.clickSave,
              hasAccessEdit,
              hasAccessApproval,
            )}
            pagination={false}
          />
        </Card>
      </div>
    )
  }
}

ProductApproval.propTypes = {
  active: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

export default withRouter(ProductApproval)
