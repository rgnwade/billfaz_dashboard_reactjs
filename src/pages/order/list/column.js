import React from 'react'
import { Button } from 'antd'

import { datetimeToLocal } from '../../../utils/formatter/datetime'
import { ROLES_ITEMS } from '../../../config/roles'
import Role from '../../../components/role'

export const columns = (detailClick = () => {}, adviceClick = () => {}, openModal = () => {}) => [{
  title: 'Order Id',
  dataIndex: 'id',
  key: 'orderId',
  render: (text, record) => (
    <div>
      <div className="block">{text}</div>
      <div className="bold-text">Created At:</div>
      <div className="block">{datetimeToLocal(record.createdAt)}</div>
      <div className="bold-text">Updated At:</div>
      <div>{datetimeToLocal(record.updatedAt)}</div>
    </div>
  ),
}, {
  title: 'Client Name',
  dataIndex: 'client',
  key: 'name',
  render: client => (
    <div>{client && client.name}</div>
  ),
}, {
  title: 'Product Name',
  dataIndex: 'product',
  key: 'productName',
  render: (text, data) => (
    <div>
      <div>{text.code}</div>
      <div className="bold-text">Description:</div>
      <div>{text.name}</div>
      <div className="block">[ {data.usedProviders && data.usedProviders.length > 0 ? data.usedProviders[0].name : '-'} ]</div>
      <div>Reference ID: {data.reference ? data.reference.referenceNo || data.reference.voucher : '-'}</div>
      {/* <div>Serial Number: -</div> */}
    </div>
  ),
}, {
  title: 'Status',
  dataIndex: 'issuedStatus',
  key: 'status',
  render: (text, record) => (
    <div style={{ width: '150px' }}>
      <span className={`app__status --${text}`}>{text}</span>
      { record.refunded && <span className="app__status --refunded">Refunded</span>}
    </div>
  ),
}, {
  title: 'Action',
  dataIndex: 'id',
  key: 'action',
  width: 120,
  render: (text, record) => (
    <div>
      <div>
        {(record.issuedStatus === 'pending' || record.issuedStatus === 'failed'
          || record.issuedStatus === 'queue' || record.issuedStatus === 'process')
          && <Button style={{ width: '100%', marginBottom: '0.3em' }} onClick={() => adviceClick(record)}>Advice</Button>}
      </div>
      <Role roleItem={ROLES_ITEMS.ORDER_SET_STATUS}>
        {record.issuedStatus !== 'failed'
          && <Button style={{ width: '100%', marginBottom: '0.3em' }} onClick={() => openModal(record)}>Change Status</Button>}
      </Role>
      <Role roleItem={ROLES_ITEMS.ORDER_DETAIL}>
        <Button style={{ width: '100%', marginBottom: '0.3em' }} onClick={() => detailClick(text)}>View Detail Order</Button>
      </Role>
    </div>
  ),
}]
