import React from 'react'
import { Modal, Select } from 'antd'
import PropTypes from 'prop-types'
import { OPTIONS_CONFIG_REFUND_REASONS, REFUND_REASONS } from '../../../config/options'

const OrderModal = ({ visible, modalOk, modalClose, changeRefundReason }) => (
  <Modal
    title="Refund Confirmation"
    visible={visible}
    onOk={modalOk}
    okText="Confirm"
    onCancel={modalClose}
  >
    <div>
      <div className="block">
        <label className="small-text">Choose reason</label>
        <div>
          <Select defaultValue={REFUND_REASONS.PROBLEM} style={{ width: '100%' }} onChange={changeRefundReason}>
            {
              OPTIONS_CONFIG_REFUND_REASONS.map(status => (
                <Select.Option key={status.id} value={status.id}>{status.name}</Select.Option>
              ))
            }
          </Select>
        </div>
      </div>
    </div>
  </Modal>
)

OrderModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  modalOk: PropTypes.func.isRequired,
  modalClose: PropTypes.func.isRequired,
  changeRefundReason: PropTypes.func.isRequired,
}

export default OrderModal
