import React, { Component } from 'react'
import { Button, Card, Divider, Input, Table, Tabs, message } from 'antd'
import PropTypes from 'prop-types'

import Main from '../../../components/main'
import Breadcrumb, { BreadcrumbItems } from '../../../components/breadcrumb'
import { ProductApi } from '../../../api'
import { datetimeToLocal } from '../../../utils/formatter/datetime'
import { inputMoneyHandler, numberToMoney } from '../../../utils/formatter/currency'
import { getError } from '../../../utils/error/api'
import { hasAccess } from '../../../utils/roles'
import { ROLES_ITEMS } from '../../../config/roles'

class ProductClientDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      data: {},
      activeKey: 'info',
      logs: [],
      hasAccessEdit: hasAccess(ROLES_ITEMS.PRODUCT_CLIENT_EDIT_PRICE),
    }
  }

  componentDidMount() {
    this.getData()
  }

  changeTab = (activeKey) => {
    this.setState({ ...this.state, activeKey })
  }

  changePrice = (e) => {
    const { data } = this.state
    this.setState({ ...this.state, data: { ...data, sellPrice: inputMoneyHandler(e.target.value) } })
  }

  clickSave = () => {
    const { data } = this.state
    const { clientId, productId, listProviders, active } = data
    const payload = {
      sellPrice: parseInt(data.sellPrice, 10),
      isNew: false,
      clientId,
      productId,
      listProviders,
      active,
    }
    ProductApi.createClientProduct(payload)
      .then(() => {
        message.success(
          (
            <div>
              <div>Update success</div>
              <div>Data has been added to client product approval</div>
            </div>
          ),
        )
        this.getData()
      })
      .catch((err) => {
        let errMsg = getError(err) || 'Update failed'
        if (errMsg.length > 80) {
          errMsg = (
            <div>
              {
                errMsg.split('.').map((msg, index) => (
                  <div key={index}>{msg}</div>
                ))
              }
            </div>
          )
        }
        message.error(errMsg)
      })
  }

  getData = async () => {
    const { match } = this.props
    await this.setState({ ...this.state, loading: true })
    Promise.all([
      ProductApi.getClientProduct(match.params.clientId, match.params.id),
      ProductApi.getClientProductHistoriesByProduct(match.params.clientId, match.params.id),
    ])
      .then((res) => {
        const resData = res[0].data || {}
        const data = {
          ...resData,
          originalSellPrice: resData.sellPrice && parseInt(resData.sellPrice, 10),
          sellPrice: resData.sellPrice && parseInt(resData.sellPrice, 10),
        }
        this.setState({
          ...this.state,
          data,
          logs: res[1].data || [],
          loading: false,
        })
      })
      .catch(() => {
        this.setState({ ...this.state, loading: false })
        message.error('Fetching data failed')
      })
  }

  render() {
    const { loading, data, activeKey, logs, hasAccessEdit } = this.state
    const product = data.products || {}
    const columns = [{
      title: 'Name',
      dataIndex: 'user',
      key: 'name',
      render: user => (
        <div>{user && user.name}</div>
      ),
    }, {
      title: 'Type',
      dataIndex: 'isNew',
      key: 'type',
      render: isNew => (
        <div>
          {isNew ? 'Add New Product' : 'Edit Product'}
        </div>
      ),
    }, {
      title: 'Status',
      dataIndex: 'active',
      key: 'status',
      render: active => (
        <div>{active ? 'Active' : 'Inactive'}</div>
      ),
    }, {
      title: 'Approval Status',
      dataIndex: 'status',
      key: 'approvalStatus',
      render: status => (
        <div style={{ textTransform: 'capitalize' }}>{status}</div>
      ),
    }, {
      title: 'Sell Price',
      dataIndex: 'sellPrice',
      key: 'sellPrice',
      render: sellPrice => (
        <div>{numberToMoney(sellPrice)}</div>
      ),
    }, {
      title: 'Timestamp',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: dt => (
        <div>{datetimeToLocal(dt)}</div>
      ),
    }]
    const panes = [
      {
        key: 'info',
        title: 'Detail Information',
        content: (
          <div>
            <div className="block">
              <label className="small-text">Product name & code</label>
              <div>{product.name} [ {product.code} ]</div>
            </div>
            <div className="block">
              <label className="small-text">Product description</label>
              <div style={{ maxWidth: '50%' }}>{product.description}</div>
            </div>
            <div style={{ marginBottom: '4em' }}>
              <label className="small-text">Sell price</label>
              <div style={{ maxWidth: 300 }}>
                {hasAccessEdit && <Input value={numberToMoney(data.sellPrice)} onChange={this.changePrice} />}
                {!hasAccessEdit && <div>{numberToMoney(data.sellPrice)}</div>}
              </div>
            </div>
            {hasAccessEdit && (
              <div>
                <Divider />
                <div className="flex-end">
                  <Button disabled={data.sellPrice === data.originalSellPrice} type="primary btn-oval" onClick={this.clickSave}>Save</Button>
                </div>
              </div>
            )}
          </div>
        ),
      }, {
        key: 'log',
        title: 'Log Event',
        content: (
          <div>
            {
              logs && logs.length > 0
                ? (
                  <Table
                    className="table-responsive table-borderless"
                    loading={loading}
                    rowKey="createdAt"
                    dataSource={logs}
                    columns={columns}
                    pagination={false}
                    size="small"
                  />) : <div>No data</div>
            }
          </div>
        ),
      },
    ]
    return (
      <Main title="Product">
        <Breadcrumb items={[BreadcrumbItems.PRODUCT_CLIENT, BreadcrumbItems.PRODUCT_CLIENT_DETAIL]} />
        <div className="app-content">
          <Card loading={loading} className="--big-padding">
            <div className="flex-space-between block">
              <div>
                <h2>{product.name}</h2>
                <div className="small-text">[ {product.code} ]</div>
              </div>
              <div className={`app__status --${product.active ? 'active' : 'inactive'}`}>{product.active ? 'Active' : 'Inactive'}</div>
            </div>
            <Tabs activeKey={activeKey} onChange={this.changeTab}>
              {
                panes.map(x => (
                  <Tabs.TabPane tab={x.title} key={x.key}>
                    <div>
                      {x.content}
                    </div>
                  </Tabs.TabPane>
                ))
              }
            </Tabs>
          </Card>
        </div>
      </Main>
    )
  }
}

ProductClientDetail.propTypes = {
  match: PropTypes.object.isRequired,
}

export default ProductClientDetail
