import React from 'react'
import { Input, Modal, Select } from 'antd'
import PropTypes from 'prop-types'
import { OPTIONS_CONFIG_CHANGE_ORDER_STATUS } from '../../../config/options'
import { ORDER_STATUS } from '../../../config/order'

const OrderModal = ({ visible, modalOk, modalClose, changeStatus, changeReferenceNumber, data }) => (
  <Modal
    title="Change Status Confirmation"
    visible={visible}
    onOk={modalOk}
    okText="Confirm"
    onCancel={modalClose}
  >
    <div>
      <p>Test modal</p>
    </div>
  </Modal>
)

OrderModal.propTypes = {
  data: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired,
  modalOk: PropTypes.func.isRequired,
  modalClose: PropTypes.func.isRequired,
  changeStatus: PropTypes.func.isRequired,
  changeReferenceNumber: PropTypes.func.isRequired,
}

export default OrderModal
