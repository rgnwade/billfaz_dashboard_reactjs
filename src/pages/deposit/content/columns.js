import React from 'react'
import { Button } from 'antd'
import { DEPOSIT_TYPES } from '../../../config/deposit'
import { datetimeToLocal } from '../../../utils/formatter/datetime'
import { numberToMoney } from '../../../utils/formatter/currency'
import '../deposit.scss'

const columnFields = {
  createdDate: {
    title: 'Created Date',
    dataIndex:'createdAt',
    key:'createdAt',
    render: (text)  => (
      <div>{(text)}</div>
    ),
  },
  transaction: {
    title: 'Order ID',
    dataIndex:'orderId',
    key:'orderId',
    render: text => (
      <div>{text}</div>
    ),
  },
  amount: {
    title: 'Amount',
    dataIndex:'amount',
    key:'amount',
    render: text => (
      <div>{text}</div>
    ),
  },
  // providerClientCode: {
  //   title: 'Provider',
  //   dataIndex: 'provider',
  //   key: 'providerClientCode',
  // },
  balanceBefore: {
    title: 'Balance Before',
    dataIndex:'balanceBefore',
    key:'balanceBefore',
    render: text => (
      <div>{numberToMoney(text)}</div>
    ),
  },
  balanceAfter: {
    title: 'Balance After',
    dataIndex: 'balanceAfter',
    key: 'balanceAfter',
    render: text => (
      <div>{numberToMoney(text)}</div>
    ),
  },
  // topup: (topupClick = () => {}, hasAccessTopup = false) => ({
  //   title: '',
  //   dataIndex: 'key',
  //   key: 'topup',
  //   render: (text, record) => hasAccessTopup && (
  //     <Button onClick={() => topupClick(record)}>
  //       Top up Deposit
  //     </Button>
  //   ),
  // }),
  operation: {
    title: 'Operation',
    dataIndex: 'action',
    key: 'action',
    render: (text, record) => (
      <div style={{ width: '150px' }}>
      <span className={`apps__status --${text}`}>{text}</span>
    </div>
    ),
  }
  
}

const columns = {
  [DEPOSIT_TYPES.CLIENTS]: (topupClick, hasAccessTopup) => [
    columnFields.createdDate,
    columnFields.transaction,
    columnFields.amount,
    columnFields.balanceBefore,
    columnFields.balanceAfter,
    columnFields.operation
    // columnFields.topup(topupClick, hasAccessTopup),
  ]
  // [DEPOSIT_TYPES.PROVIDERS]: () => [
  //   columnFields.providerClientCode,
  //   columnFields.balanceAfter,
  // ],
}

export default columns
