import React from 'react'
import { Button } from 'antd'

import { DEPOSIT_TYPES } from '../../../config/deposit'
import { datetimeToLocal } from '../../../utils/formatter/datetime'
import { numberToMoney } from '../../../utils/formatter/currency'

const columnFields = {
  clientCode: {
    title: 'Client Code',
    dataIndex: 'client',
    key: 'clientCode',
    render: text => (
      <div>{text && text.name}</div>
    ),
  },
  providerClientCode: {
    title: 'Provider',
    dataIndex: 'provider',
    key: 'providerClientCode',
  },
  remaining: {
    title: 'Remaining Deposit',
    dataIndex: 'balance',
    key: 'balance',
    render: text => (
      <div>{numberToMoney(text)}</div>
    ),
  },
  lastUpdate: {
    title: 'Last Update',
    dataIndex: 'updatedAt',
    key: 'lastUpdate',
    render: text => (
      <div>{datetimeToLocal(text)}</div>
    ),
  },
  topup: (topupClick = () => {}, hasAccessTopup = false) => ({
    title: '',
    dataIndex: 'key',
    key: 'topup',
    render: (text, record) => hasAccessTopup && (
      <Button onClick={() => topupClick(record)}>
        Top up Deposit
      </Button>
    ),
  }),
}

const columns = {
  [DEPOSIT_TYPES.CLIENTS]: (topupClick, hasAccessTopup) => [
    columnFields.clientCode,
    columnFields.remaining,
    columnFields.lastUpdate,
    columnFields.topup(topupClick, hasAccessTopup),
  ],
  [DEPOSIT_TYPES.PROVIDERS]: () => [
    columnFields.providerClientCode,
    columnFields.remaining,
    columnFields.lastUpdate,
  ],
}

export default columns
