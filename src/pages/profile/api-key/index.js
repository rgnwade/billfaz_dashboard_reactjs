import React, { Component } from 'react'
import { Button, Modal, Table, message } from 'antd'

import { UserApi } from '../../../api'
import { getErrorMessage } from '../../../utils/error/api'

class ApiKey extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      loading: false,
      loadingCreate: false,
      params: {},
      valPerPage: 0,
    }
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
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

  generateApiKey = async () => {
    await this.setState({ ...this.state, loadingCreate: true })
    UserApi.createApiKey()
      .then(() => {
        this.setState({ ...this.state, loadingCreate: false })
        message.success('Generate api key success')
        this.getData()
      })
      .catch((err) => {
        this.setState({ ...this.state, loadingCreate: false })
        message.error(getErrorMessage(err) || 'Generate api key failed')
      })
  }

  deleteApiKey = (id, key) => {
    Modal.confirm({
      title: 'Delete Api Key',
      content: `Do you want to delete api key ${key}?`,
      onOk() {
        UserApi.delete(id)
          .then(() => {
            message.success('Delete api key success')
          })
          .catch((err) => {
            message.error(getErrorMessage(err) || 'Delete api key failed')
          })
      },
      onCancel() {},
    })
  }

  render() {
    const { data, loading, loadingCreate } = this.state
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
      dataIndex: 'id',
      key: 'id',
      render: (id, record) => (
        <div className="flex-end">
          <Button shape="circle" icon="close" size="small" onClick={() => this.deleteApiKey(id, record.apiKey)} />
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
        <div className="profile__api-key-info">*API Key Max 2</div>
        <Button disabled={data && data.length > 1} type="primary" onClick={this.generateApiKey} loading={loadingCreate}>
          Generate New API Key
        </Button>
      </div>
    )
  }
}

export default ApiKey
