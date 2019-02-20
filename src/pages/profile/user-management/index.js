import React, { Component } from 'react'
import { Button, Divider, Form, Input, Modal, Table, message } from 'antd'

import { UserApi } from '../../../api'
import { getError, getErrorMessage } from '../../../utils/error/api'

class UserManagement extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      loading: false,
      params: {},
      valPerPage: 0,
      modal: false,
      modalData: {},
      modalLoading: false,
    }
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    await this.setState({ ...this.state, loading: true })
    UserApi.list()
      .then((res) => {
        this.setState({ ...this.state, data: res.data, loading: false })
      })
      .catch(() => {
        this.setState({ ...this.state, loading: false })
        message.error('Fetch data users failed')
      })
  }

  changeInput = (e) => {
    const { modalData } = this.state
    this.setState({
      ...this.state,
      modalData: {
        ...modalData,
        [e.target.name]: e.target.value,
      },
    })
  }

  addUser = async (e) => {
    e.preventDefault()
    await this.setState({ ...this.state, modalLoading: true })
    const { modalData } = this.state
    UserApi.create({ ...modalData, roleId: [8] })
      .then(() => {
        message.success('Credentials has been sent to user\'s email')
        this.setState({ ...this.state, modalLoading: false, modal: false })
        this.getData()
      })
      .catch((err) => {
        message.error(getError(err) || 'Add user failed')
        this.setState({ ...this.state, modalLoading: false })
      })
  }

  deleteUser = (id, username) => {
    const thisEl = this
    Modal.confirm({
      title: 'Delete User',
      content: `Do you want to delete user ${username}?`,
      onOk() {
        UserApi.delete(id)
          .then(() => {
            message.success('Delete user success')
            thisEl.getData()
          })
          .catch((err) => {
            message.error(getErrorMessage(err) || 'Delete user failed')
          })
      },
      onCancel() {},
    })
  }

  openModal = () => {
    this.setState({ ...this.state, modal: true, modalData: {} })
  }

  closeModal = () => {
    this.setState({ ...this.state, modal: false, modalData: {} })
  }

  render() {
    const { data, loading, modalLoading, modal, modalData } = this.state
    const columns = [{
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    }, {
      title: 'Role',
      dataIndex: 'roleName',
      key: 'role',
    }, {
      title: (
        <div className="flex-end">
          <Button type="primary" icon="plus" onClick={this.openModal}>Add User</Button>
        </div>
      ),
      dataIndex: 'id',
      key: 'id',
      render: (id, record) => (
        <div className="flex-end">
          <Button shape="circle" icon="close" size="small" onClick={() => this.deleteUser(id, record.username)} />
        </div>

      ),
    }]
    return (
      <div style={{ marginBottom: '2em' }}>
        <h2>User Management</h2>
        <Table
          className="table-responsive"
          loading={loading}
          rowKey="id"
          dataSource={data}
          columns={columns}
          pagination={false}
        />
        <Modal
          title="Add User"
          visible={modal}
          onOk={this.modalOk}
          onCancel={this.closeModal}
          footer={null}
        >
          <Form onSubmit={this.addUser} className="custom-form">
            <Form.Item>
              <div>
                <label className="small-text">Username</label>
              </div>
              <Input
                required
                name="username"
                value={modalData.username}
                onChange={this.changeInput}
              />
            </Form.Item>
            <Form.Item>
              <div>
                <label className="small-text">Email Address</label>
              </div>
              <Input
                required
                name="email"
                value={modalData.email}
                onChange={this.changeInput}
                type="email"
                pattern="(?!(^[.-].*|[^@]*[.-]@|.*\.{2,}.*)|^.{254}.)([a-zA-Z0-9!#$%&'*+\/=?^_`{|}~.-]+@)(?!-.*|.*-\.)([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,15}"
                title="Please enter valid email address"
              />
            </Form.Item>
            <Form.Item>
              <div className="profile__actions">
                <Divider />
                <div className="profile__actions-container">
                  <Button onClick={this.closeModal}>
                    Cancel
                  </Button>
                  <Button loading={modalLoading} type="primary" htmlType="submit">
                    Save
                  </Button>
                </div>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default UserManagement
