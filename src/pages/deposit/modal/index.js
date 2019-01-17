import React from 'react'
import { DatePicker, Input, Modal } from 'antd'
import PropTypes from 'prop-types'
import { numberToMoneyNoRP } from '../../../utils/formatter/currency'

const TopupModal = ({ data, visible, modalOk, modalClose, changeAmount, changeDate, modalData }) => (
  <Modal
    title={`Top Up Deposit ${(data.client && data.client.name) || ''}`}
    visible={visible}
    onOk={modalOk}
    okText="Top up"
    onCancel={modalClose}
  >
    <div>
      <div className="block">
        <label className="small-text">Amount</label>
        <Input value={numberToMoneyNoRP(modalData.amount)} onChange={changeAmount} />
      </div>
      <div className="block">
        <label className="small-text">Transfer date</label>
        <div>
          <DatePicker
            style={{ width: '100%' }}
            placeholder=""
            value={modalData.date}
            onChange={changeDate}
          />
        </div>
      </div>
    </div>
  </Modal>
)

TopupModal.propTypes = {
  data: PropTypes.object.isRequired,
  modalData: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired,
  modalOk: PropTypes.func.isRequired,
  modalClose: PropTypes.func.isRequired,
  changeAmount: PropTypes.func.isRequired,
  changeDate: PropTypes.func.isRequired,
}

export default TopupModal
