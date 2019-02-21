import React from 'react'
import { Button, Tooltip } from 'antd'
import { datetimeToLocal } from '../../../utils/formatter/datetime'
import { numberToMoney } from '../../../utils/formatter/currency'

export const columns = () => [{
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
  ),
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
  dataIndex: 'orderId',
  key: 'action',
  width: 120,
  render: (id, record) => {
    const copy = () => {
      let span = document.getElementsByClassName(`order-list__copy-btn-${id}`)
      span = span && span.length > 0 ? span[0] : {}
      const el = document.getElementById(`order-list__textarea--${id}`)
      el.select()
      document.execCommand('copy')
      span.innerText = 'Copied'
      setTimeout(() => {
        span.innerText = 'Copy'
      }, 1000)
    }
    return (
      <div>
        <Tooltip placement="top" title={`${record.orderId}-${record.productCode}-${record.destinationNo}`}>
          <Button className={`order-list__copy-btn-${id}`} style={{ width: '100%' }} onClick={copy}>Copy</Button>
        </Tooltip>
        <textarea
          value={`${record.orderId}-${record.productCode}-${record.destinationNo}`}
          style={{ position: 'absolute', left: '-999999px', height: 0 }}
          id={`order-list__textarea--${id}`}
          onChange={() => {}}
        />
      </div>
    )
  },
}]
