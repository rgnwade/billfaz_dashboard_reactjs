import React, { Component } from 'react'
import { Card, Table } from 'antd'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

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

  render() {
    const { loading, data, params, valPerPage } = this.state
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
        />
        <OrderReport />
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
