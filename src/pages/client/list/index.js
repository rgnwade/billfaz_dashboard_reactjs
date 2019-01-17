import React, { Component } from 'react'
import { Card, Table } from 'antd'

import TableControl from '../../../components/table-control'
import columns from './columns'
import { ClientApi } from '../../../api'

class ClientList extends Component {
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
    }
  }

  componentDidMount() {
    this.getData()
  }

  getData = async (params = this.state.params) => {
    await this.setState({ ...this.state, loading: true })
    ClientApi.get(params)
      .then((res) => {
        const data = res.data.clients || []
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
    this.getData({ ...params, page: 1, query: searchValue })
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
        />
        <Card>
          <Table
            className="table-responsive"
            loading={loading}
            rowKey="id"
            dataSource={data}
            columns={columns}
            pagination={false}
          />
        </Card>
      </div>
    )
  }
}

export default ClientList
