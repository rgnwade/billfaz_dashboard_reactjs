import React, { Component } from 'react'

class UserManagement extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      loading: false,
    }
  }

  render() {
    const { data, loading } = this.state
    return (
      <div>
        <h2>User Management</h2>
        <div>{data.toString()} {loading.toString()}</div>
      </div>
    )
  }
}

export default UserManagement
