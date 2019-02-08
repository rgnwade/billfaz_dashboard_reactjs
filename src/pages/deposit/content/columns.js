import React from 'react'
import { Button,Tooltip } from 'antd'

import { DEPOSIT_TYPES } from '../../../config/deposit'
import { datetimeToLocal } from '../../../utils/formatter/datetime'
import { numberToMoney } from '../../../utils/formatter/currency'

const columnFields = {
  createdDate: {
    title: 'Created Date',
    dataIndex: 'createddate',
    key: 'createdDate',
    render: text => (
      <div>{datetimeToLocal(text)}</div>
    ),
  },
  transaction: {
    title: 'Order ID',
    dataIndex: 'transaction',
    key: 'transactionID',
    render: text => (
      <div>{text && text.name}</div>
    ),
  },
  amount: {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amountID',
    render: text => (
      <div>{text && text.name}</div>
    ),
  },
  providerClientCode: {
    title: 'Provider',
    dataIndex: 'provider',
    key: 'providerClientCode',
  },
  balanceBefore: {
    title: 'Balance Before',
    dataIndex: 'balanceBefore',
    key: 'balanceBefore',
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
    dataIndex: 'operation',
    key: 'status',
    render: operation => (
      <div style={{ width: '150px' }}>
        <span className={`app__status --${operation ? 'active' : 'inactive'}`}>{operation ? 'Active' : 'Inactive'}</span>
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
