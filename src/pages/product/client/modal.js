import React from 'react'
import { Input, Modal, Select } from 'antd'
import PropTypes from 'prop-types'
import { numberToMoney } from '../../../utils/formatter/currency'

const AddProductModal = ({
  visible,
  modalOk,
  modalClose,
  changeSellPrice,
  modalData,
  productsAvailable,
  changeProduct,
}) => (
  <Modal
    title="Add Product"
    visible={visible}
    onOk={modalOk}
    okText="Save"
    onCancel={modalClose}
  >
    <div>
      <div className="block">
        <label className="small-text">Product</label>
        <div>
          <Select
            showSearch
            placeholder="Search"
            value={modalData.productId}
            style={{ width: '100%' }}
            onChange={changeProduct}
            optionFilterProp="children"
            filterOption={(input, option) => option.props.children.toLowerCase().includes(input.toLowerCase())}
          >
            {
              productsAvailable.map(option => (
                <Select.Option key={option.id} value={option.id}>{option.name}</Select.Option>
              ))
            }
          </Select>
        </div>
      </div>
      <div className="block">
        <label className="small-text">Sell price</label>
        <Input value={numberToMoney(modalData.sellPrice)} onChange={changeSellPrice} />
      </div>
    </div>
  </Modal>
)

AddProductModal.propTypes = {
  modalData: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired,
  modalOk: PropTypes.func.isRequired,
  modalClose: PropTypes.func.isRequired,
  changeSellPrice: PropTypes.func.isRequired,
  productsAvailable: PropTypes.array.isRequired,
  changeProduct: PropTypes.func.isRequired,
}

export default AddProductModal
