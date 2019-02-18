import React, { Component } from 'react'
import { Button, Table, message } from 'antd'

import TableControl from '../../../components/table-control'
import { UserApi } from '../../../api'

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

  async componentDidMount() {
    await this.setState({ ...this.state, loading: true })
    UserApi.list('cs')
      .then((res) => {
        this.setState({ ...this.state, data: res.data, loading: false })
      })
      .catch(() => {
        this.setState({ ...this.state, loading: false })
        message.error('Fetch data users failed')
      })
  }

  render() {
    const { data, loading, params, valPerPage } = this.state
    const columns = [{
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    }, {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    }, {
      title: (
        <div className="flex-end">
          <Button type="primary" icon="plus" onClick={this.openModal}>Add User</Button>
        </div>
      ),
      dataIndex: 'id',
      key: 'id',
      render: () => (
        <div className="flex-end">
          <Button shape="circle" icon="close" size="small" />
        </div>

      ),
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
          rowKey="id"
          dataSource={data}
          columns={columns}
          pagination={false}
        />
      </div>
    )
  }
}

export default UserManagement
