import React, { Component } from 'react'
import { Button, Table, message } from 'antd'

import { UserApi } from '../../../api'

class ApiKey extends Component {
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
    UserApi.list('api')
      .then((res) => {
        this.setState({ ...this.state, data: res.data, loading: false })
      })
      .catch(() => {
        this.setState({ ...this.state, loading: false })
        message.error('Fetch data api keys failed')
      })
  }

  render() {
    const { data, loading } = this.state
    const columns = [{
      title: 'Key',
      dataIndex: 'apiKey',
      key: 'apiKey',
    }, {
      title: 'Created At',
      dataIndex: 'role',
      key: 'role',
    }, {
      title: '',
      dataIndex: 'address',
      key: 'address',
      render: () => (
        <div className="flex-end">
          <Button shape="circle" icon="close" size="small" />
        </div>

      ),
    }]
    return (
      <div>
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

export default ApiKey
