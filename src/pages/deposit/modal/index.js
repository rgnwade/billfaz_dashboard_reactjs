import React from 'react'
import { Button, Modal } from 'antd'
import '../deposit.scss'

const TopupModal = ({
  data,
  visible,
  modalOk,
  modalClose,
  modalData
}) => (
  <Modal
          title="Export Data Confirmation"
          visible={visible}
          onOk={modalOk}
          okText="Confirm"
          onCancel={modalClose}
        >
          <p>This data would be downloaded to your device</p>
        
        </Modal>
)

export default TopupModal
