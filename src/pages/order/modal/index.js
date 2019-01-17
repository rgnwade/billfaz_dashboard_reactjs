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
      <div className="block">
        <label className="small-text">Choose status</label>
        <div>
          <Select defaultValue={ORDER_STATUS.SUCCESS} style={{ width: '100%' }} onChange={changeStatus}>
            {
              OPTIONS_CONFIG_CHANGE_ORDER_STATUS.map(status => (
                <Select.Option key={status.id} value={status.id}>{status.name}</Select.Option>
              ))
            }
          </Select>
        </div>
      </div>
      <div className="block">
        <label className="small-text">Reference number</label>
        <Input value={data.voucher} onChange={changeReferenceNumber} />
      </div>
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
