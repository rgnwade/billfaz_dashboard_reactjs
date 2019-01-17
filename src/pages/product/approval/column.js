import React from 'react'
import { Button, Input } from 'antd'

import { numberToMoney } from '../../../utils/formatter/currency'

export const columns = (
  clickApproval = () => {},
  clickEdit = () => {},
  changePrice = () => {},
  clickSave = () => {},
  hasAccessEdit,
  hasAccessApproval,
) => [{
  title: 'Name',
  dataIndex: 'user',
  key: 'name',
  render: user => (
    <div>
      {user && user.name}
    </div>
  ),
}, {
  title: 'Client',
  dataIndex: 'client',
  key: 'client',
  render: client => (
    <div>
      {client && client.name}
    </div>
  ),
}, {
  title: 'Type',
  dataIndex: 'isNew',
  key: 'type',
  render: isNew => (
    <div>
      {isNew ? 'Add New Product' : 'Edit Product'}
    </div>
  ),
}, {
  title: 'Product',
  dataIndex: 'product',
  key: 'product',
  render: product => (
    <div>
      {product && product.name}
    </div>
  ),
}, {
  title: 'Sell Price',
  dataIndex: 'sellPrice',
  key: 'price',
  render: (text, record) => (record.isEdited ? (
    <div style={{ minWidth: 290 }} className="flex-start">
      <Input style={{ width: 160 }} value={numberToMoney(text)} onChange={e => changePrice(e, record.idx)} />
      <div>
        <Button style={{ margin: '0 4px' }} icon="close" onClick={() => clickEdit(record.idx, false)} />
        <Button loading={record.loading} type="primary" onClick={() => clickSave(record)}>Save</Button>
      </div>
    </div>
  ) : (
    <div className="flex-space-between">
      <div>{numberToMoney(text)}</div>
      {record.status.toLowerCase() === 'pending' && hasAccessEdit && (
        <div>
          <Button icon="form" onClick={() => clickEdit(record.idx, true)} />
        </div>)}
    </div>)
  ),
}, {
  title: 'Status',
  dataIndex: 'id',
  key: 'status',
  render: (id, record) => (
    <div>
      {
        record.status === 'pending' && hasAccessApproval
          ? (
            <div>
              <Button loading={record.approvedLoading} disabled={record.rejectedLoading} type="primary" onClick={() => clickApproval(id, record, 'approved')}>Approve</Button>
              <Button loading={record.rejectedLoading} disabled={record.approvedLoading} style={{ marginLeft: '0.5em' }} onClick={() => clickApproval(id, record, 'rejected')}>Reject</Button>
            </div>)
          : (
            <div>
              <span className={`app__status --${record.status}`}>{record.status}</span>
            </div>)
      }
    </div>
  ),
}]
