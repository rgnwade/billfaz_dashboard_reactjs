import React from 'react'
import { Button, Tooltip } from 'antd'

import { datetimeToLocal } from '../../../utils/formatter/datetime'
import { ROLES_ITEMS } from '../../../config/roles'
import Role from '../../../components/role'
import { numberToMoney } from '../../../utils/formatter/currency'

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
  title: 'Client',
  dataIndex: 'client',
  key: 'name',
  render: client => (
    <div>{client && client.code}</div>
  ),
}, {
  title: 'Product',
  dataIndex: 'product',
  key: 'productName',
  render: (text, data) => {
    const provider = data.usedProviders && data.usedProviders.length > 0 ? data.usedProviders[0] : {}
    const tipText = `${text.code} ${data.destinationNo}`
    const click = () => {
      let span = document.getElementsByClassName(`order-list__copy-btn-${data.id}`)
      span = span && span.length > 0 ? span[0] : { classList: [] }
      const el = document.createElement('textarea')
      el.value = tipText
      el.setAttribute('readonly', '')
      el.style = { position: 'absolute', left: '-9999px' }
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      span.innerText = 'copied'
      document.body.removeChild(el)
      setTimeout(() => {
        span.innerText = 'copy'
      }, 1000)
    }
    return (
      <div>
        <div>{text.code}</div>
        <div className="bold-text">Description:</div>
        <div className="order-list__copy-tooltip">{text.name}
          <Tooltip placement="top" title={tipText}>
            <button type="button" className={`order-list__copy-btn order-list__copy-btn-${data.id}`} onClick={click}>copy</button>
          </Tooltip>
        </div>
        <div className="block">[ {provider.name || '-'} ]</div>
        <div>Number: {data.destinationNo}</div>
        <div>Reference ID: {data.reference ? data.reference.referenceNo || data.reference.voucher : '-'}</div>
      </div>
    )
  },
}, {
  title: 'Amount',
  dataIndex: 'sellPrice',
  key: 'sellPrice',
  render: sellPrice => (
    <div>{sellPrice ? numberToMoney(sellPrice) : numberToMoney('0')}</div>
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
