import React from 'react'
import { Button } from 'antd'
import { datetimeToLocal } from '../../../utils/formatter/datetime'
import { ROLES_ITEMS } from '../../../config/roles'
import Role from '../../../components/role'
import { numberToMoney } from '../../../utils/formatter/currency'

export const columns = (detailClick = () => {}, adviceClick = () => {}, openModal = () => {}) => [{
  title: 'Order Id',
  dataIndex: 'orderId',
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
  title: 'Reference ID',
  dataIndex: 'clientRef',
  key: 'refID',
}, {
  title: 'Product',
  dataIndex: 'productCode',
  key: 'productName',
  render: (text, data) => (
    <div>
      <div className="block">{text}</div>
      <div className="bold-text">Token/Voucher Number:</div>
      <div className="block">{data.reference ? data.reference.referenceNo : '-'}</div>
      <div className="bold-text">Serial Number:</div>
      <div>{data.reference ? data.reference.refNo : '-'}</div>
    </div>
  )
}, {
  title: 'Customer Number',
  dataIndex: 'destinationNo',
  key: 'destinationNo',
}, {
  title: 'Amount',
  dataIndex: 'price',
  key: 'price',
  render: price => (
    <div>{price ? numberToMoney(price) : numberToMoney('0')}</div>
  ),
}, {
  title: 'Status',
  dataIndex: 'status',
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
