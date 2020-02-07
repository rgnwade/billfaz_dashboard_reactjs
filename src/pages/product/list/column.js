import React from 'react'
import { Button, Input, Radio, Switch } from 'antd'

import { numberToMoney } from '../../../utils/formatter/currency'

const radioStyle = {
  display: 'block',
  lineHeight: 2,
}

export const columns = (
  changeSwitch = () => {},
  clickEdit = () => {},
  clickCancel = () => {},
  changeDescription = () => {},
  changePrice = () => {},
  changeProvider = () => {},
  clickSave = () => {},
  hasAccessEdit = false,
  hasAccessEditFields = {},
) => [{
  title: 'Product Name & Code',
  dataIndex: 'name',
  key: 'name',
  render: (text, record) => (
    <div>
      <div>{text} </div>
      <div>[ {record.code} ]</div>
    </div>
  ),
}, {
  title: 'Product Description',
  dataIndex: 'description',
  key: 'description',
  render: (text, record) => (record.isEditDesc ? (
    <Input.TextArea autosize value={text} onChange={e => changeDescription(e, record.idx)} />
  ) : (
    <div className="flex-space-between" style={{ width: 270, whiteSpace: 'normal' }}>
      <div style={{ width: 230 }}>{text}</div>
      {hasAccessEditFields.status && (
        <div>
          <Button icon="form" onClick={() => clickEdit(record.idx, 'isEditDesc')} />
        </div>)}
    </div>
  )),
}, {
  title: 'Provider Options',
  dataIndex: 'providerProducts',
  key: 'option',
  render: (data, record) => (
    <div className="product-list__radio">
      <Radio.Group disabled={!hasAccessEditFields.provider} value={record.providerId} onChange={hasAccessEditFields.provider ? e => changeProvider(e, record.idx) : () => {}}>
        {
          data && data.map(dt => (
            <Radio
              key={dt.id}
              style={radioStyle}
              value={dt.providerId}
            >
              {dt.provider.providerName}: {numberToMoney(dt.price)} [ {dt.code} ]
            </Radio>
          ))
        }
      </Radio.Group>
    </div>
  ),
}, {
  title: 'Product Status',
  dataIndex: 'active',
  key: 'status',
  render: (active, record) => (
    <div style={{ width: '120px' }}>
      <div>
        <Switch disabled={!hasAccessEditFields.status} checked={active} onChange={hasAccessEditFields.status ? e => changeSwitch(e, record.idx, 'active') : () => {}} />
        <span style={{ marginLeft: '0.5em' }}>Active</span>
      </div>
      <div style={{ marginTop: '0.5em' }}>
        <Switch disabled={!hasAccessEditFields.problem} checked={record.problem} onChange={hasAccessEditFields.problem ? e => changeSwitch(e, record.idx, 'problem') : () => {}} />
        <span style={{ marginLeft: '0.5em' }}>Problem</span>
      </div>
    </div>
  ),
}, {
  title: 'Admin Price Sugestion',
  dataIndex: 'adminPrice',
  key: 'price',
  render: (adminPrice, record) => (record.isEditPrice ? (
    <Input value={numberToMoney(adminPrice)} onChange={e => changePrice(e, record.idx)} />
  ) : (
    <div className="flex-space-between">
      <div>{numberToMoney(adminPrice)}</div>
      {hasAccessEditFields.price && (
        <div>
          <Button icon="form" onClick={() => clickEdit(record.idx, 'isEditPrice')} />
        </div>)}
    </div>
  )),
}, {
  title: hasAccessEdit ? 'Action' : '',
  dataIndex: 'action',
  key: 'action',
  render: (text, record) => hasAccessEdit && (
    <div style={{ width: '140px' }}>
      <Button disabled={!record.isEdited} onClick={() => clickSave(record)} loading={record.loading} type="primary">Save</Button>
      <Button disabled={!record.isEdited} style={{ marginLeft: '0.5em' }} onClick={() => clickCancel(record.idx)}>Cancel</Button>
    </div>
  ),
}]
