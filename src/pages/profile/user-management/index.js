import React, { Component } from 'react'
import { Table } from 'antd'

import TableControl from '../../../components/table-control'

class UserManagement extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      loading: false,
      params: {},
      valPerPage: 0,
    }
  }

  render() {
    const { data, loading, params, valPerPage } = this.state
    const columns = [{
      title: 'Username',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: 'Role',
      dataIndex: 'age',
      key: 'age',
    }, {
      title: '',
      dataIndex: 'address',
      key: 'address',
    }]
    return (
      <div>
        <h2 style={{ marginBottom: 0 }}>User Management</h2>
        <TableControl
          disableSearch
          valPage={params.page}
          valPerPage={valPerPage}
          handlePrevPage={this.handlePrevPage}
          handleNextPage={this.handleNextPage}
          loading={loading}
        />
        <Table
          className="table-responsive"
          loading={loading}
          rowKey="orderId"
          dataSource={data}
          columns={columns}
          pagination={false}
        />
      </div>
    )
  }
}

export default UserManagement
