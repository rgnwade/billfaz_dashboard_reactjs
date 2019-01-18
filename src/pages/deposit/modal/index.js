import React from 'react'
import { DatePicker, Icon, Input, Modal, Upload, Button } from 'antd'
import PropTypes from 'prop-types'
import { numberToMoneyNoRP } from '../../../utils/formatter/currency'
import '../deposit.scss'

const TopupModal = ({
  data,
  visible,
  modalOk,
  modalClose,
  changeAmount,
  changeDate,
  modalData,
  removeFile,
  uploadFile,
}) => (
  <Modal
    title={`Top Up Deposit ${(data.client && data.client.name) || ''}`}
    visible={visible}
    onCancel={modalClose}
    footer={(
      <div className="flex-end">
        <Button onClick={modalClose}>Cancel</Button>
        <Button type="primary" onClick={modalOk} loading={modalData.loading}>Top up</Button>
      </div>
    )}
  >
    <div className="topup-deposit__modal">
      <div className="block">
        <label className="small-text">Amount</label>
        <Input
          value={numberToMoneyNoRP(modalData.amount)}
          onChange={changeAmount}
        />
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
      <div className="block">
        <Upload.Dragger onRemove={removeFile} beforeUpload={uploadFile} fileList={modalData.file}>
          <p
            className="ant-upload-drag-icon"
            style={{ marginBottom: '0.25em' }}
          >
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-hint">
            Drag a file here or Browse for a file to upload.
          </p>
        </Upload.Dragger>
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
  removeFile: PropTypes.func.isRequired,
  uploadFile: PropTypes.func.isRequired,
}

export default TopupModal
