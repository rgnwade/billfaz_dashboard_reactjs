import React from 'react'
import { Button, Switch } from 'antd'
import { numberToMoney } from '../../../utils/formatter/currency'

export const columns = (detailClick, openModal, changeSwitch, hasAccessEdit) => [{
  title: 'Product Name & Code',
  dataIndex: 'name',
  key: 'name',
  render: (text, record) => (
    <div>
      <div>{text}</div>
      <div>[ {record.code} ]</div>
    </div>
  ),
}, {
  title: 'Sell Price',
  dataIndex: 'clientProducts',
  key: 'price',
  render: clientProducts => (
    <div>{clientProducts && clientProducts.length > 0 ? numberToMoney(clientProducts[0].sellPrice) : numberToMoney('0')}</div>
  ),
}, {
  title: 'Status',
  dataIndex: 'clientProducts',
  key: 'status',
  render: (clientProducts, row) => {
    const active = clientProducts && clientProducts.length > 0 ? clientProducts[0].active : false
    return (
      <div>
        <Switch disabled={!hasAccessEdit} checked={active} onChange={hasAccessEdit ? e => changeSwitch(e, row) : () => {}} />
        <span style={{ marginLeft: '0.5em' }}>Active</span>
      </div>
    )
  },
}, {
  title: (
    <Button type="primary" icon="plus" onClick={openModal}>Add Product</Button>
  ),
  dataIndex: 'action',
  key: 'action',
  render: (text, record) => (
    <div>
      <Button onClick={() => detailClick(record.id)}>View Detail</Button>
    </div>
  ),
}]
