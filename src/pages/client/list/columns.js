import React from 'react'
import { Tooltip } from 'antd'

const columnFields = {
  clientCode: {
    title: 'Client Code',
    dataIndex: 'code',
    key: 'clientCode',
    render: (code, record) => (
      <Tooltip placement="right" title={record.name}>
        <span>{code}</span>
      </Tooltip>
    ),
  },
  remaining: {
    title: 'Main Email',
    dataIndex: 'email',
    key: 'email',
  },
  lastUpdate: {
    title: 'Finance Email',
    dataIndex: 'emailFinance',
    key: 'emailFinance',
  },
  status: {
    title: 'Status',
    dataIndex: 'active',
    key: 'status',
    render: active => (
      <span className={`app__status --${active ? 'active' : 'inactive'}`}>{active ? 'Active' : 'Inactive'}</span>
    ),
  },
}

const columns = [
  columnFields.clientCode,
  columnFields.remaining,
  columnFields.lastUpdate,
  columnFields.status,
]

export default columns
