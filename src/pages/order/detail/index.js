import React, { Component } from 'react'
import { Button, Card, Modal, Table, Tabs, message } from 'antd'
import PropTypes from 'prop-types'

import Main from '../../../components/main'
import Breadcrumb, { BreadcrumbItems } from '../../../components/breadcrumb'
import { OrderApi } from '../../../api'
import ModalStatus from '../modal'
import { getError } from '../../../utils/error/api'
import { ORDER_STATUS } from '../../../config/order'
import { datetimeToLocal } from '../../../utils/formatter/datetime'
import ModalRefund from './modal-refund'
import { REFUND_REASONS } from '../../../config/options'
import Role from '../../../components/role'
import { ROLES_ITEMS } from '../../../config/roles'

class OrderDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      data: {},
      modal: {
        status: false,
        refund: false,
      },
      modalData: {},
      activeKey: 'info',
      refundReason: REFUND_REASONS.PROBLEM,
    }
  }

  componentDidMount() {
    this.getData()
  }

  clickAdvice = () => {
    const { data } = this.state
    const thisEl = this
    Modal.confirm({
      title: 'Advice Confirmation',
      content: 'Are you sure?',
      onOk() {
        const providerId = data.usedProviders && data.usedProviders.length > 0 ? data.usedProviders[0].id : 0
        if (providerId < 0) return
        const payload = {
          providerId,
          advice: true,
        }
        OrderApi.advice(data.id, payload)
          .then(() => {
            thisEl.getData()
            message.success('Advice success')
          })
          .catch(() => message.error('Advice failed'))
      },
    })
  }

  clickRefund = () => {
    const { refundReason, data } = this.state
    OrderApi.refund(data.id, { reason: refundReason })
      .then(async () => {
        await this.closeModal('refund')
        await this.getData()
      })
      .catch(err => message.error(getError(err) || 'Refund failed'))
  }

  clickChangeStatus = () => {
    const { modalData, data } = this.state
    OrderApi.changeStatus(data.id, { ...modalData, issuedStatus: modalData.issuedStatus || ORDER_STATUS.SUCCESS })
      .then(async () => {
        await this.closeModal('status')
        await this.getData()
      })
      .catch(err => message.error(getError(err) || 'Change status failed'))
  }

  changeTab = (activeKey) => {
    this.setState({ ...this.state, activeKey })
  }

  changeModalDataStatus = (issuedStatus) => {
    const { modalData } = this.state
    this.setState({ ...this.state, modalData: { ...modalData, issuedStatus } })
  }

  changeRefundReason = (refundReason) => {
    this.setState({ ...this.state, refundReason })
  }

  changeModalDataReference = (e) => {
    const { modalData } = this.state
    this.setState({ ...this.state, modalData: { ...modalData, voucher: e.target.value } })
  }

  openModal = (type) => {
    const { modal } = this.state
    this.setState({ ...this.state, modal: { ...modal, [type]: true } })
  }

  closeModal = (type) => {
    const { modal } = this.state
    this.setState({ ...this.state, modal: { ...modal, [type]: false }, modalData: {} })
  }

  getData = async () => {
    const { match } = this.props
    await this.setState({ ...this.state, loading: true })
    OrderApi.getOne(match.params.id)
      .then((res) => {
        this.setState({ ...this.state, data: res.data, loading: false })
      })
      .catch(() => {
        this.setState({ ...this.state, loading: false })
        message.error('Fetching data failed')
      })
  }

  render() {
    const { activeKey, loading, data, modal, modalData } = this.state
    const columns = [{
      title: 'Name',
      dataIndex: 'data',
      key: 'name',
      render: dt => (
        <div>{dt && dt.user && dt.user.fullName}</div>
      ),
    }, {
      title: 'Added Note',
      dataIndex: 'type',
      key: 'type',
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
          <div className="flex-space-between">
            <div className="flex">
              <div style={{ marginRight: '4em', maxWidth: '40%' }}>
                <div className="block bold-text">Item ID</div>
                <div>Reference ID: {data.reference ? data.reference.referenceNo || data.reference.voucher : '-'}</div>
                {/* <div>Serial Number: -</div> */}
              </div>
              <div>
                <div className="block bold-text">Detail</div>
                <div>{data.product && data.product.code}</div>
                <div>Description: {data.product && data.product.name}</div>
                {
                  data.usedProviders && data.usedProviders.map(provider => (
                    <div key={provider.id}>[ {provider.name} ]</div>
                  ))
                }
              </div>
            </div>
            <div>
              <div>
                {(data.issuedStatus === 'pending' || data.issuedStatus === 'failed'
                  || data.issuedStatus === 'queue' || data.issuedStatus === 'process')
                  && <Button style={{ width: '100%', marginBottom: '0.5em' }} onClick={this.clickAdvice}>Advice</Button>}
              </div>
              <Role roleItem={ROLES_ITEMS.ORDER_SET_STATUS}>
                {data.issuedStatus !== 'failed'
                  && <Button style={{ width: '100%', marginBottom: '0.5em' }} onClick={() => this.openModal('status')}>Change Status</Button>}
              </Role>
              <Role roleItem={ROLES_ITEMS.ORDER_REFUND}>
                {!data.refunded && <Button style={{ width: '100%', marginBottom: '0.5em' }} onClick={() => this.openModal('refund')}>Refund</Button>}
              </Role>
            </div>
          </div>
        ),
      }, {
        key: 'log',
        title: 'Log Event',
        content: (
          <div>
            {
              data.orderEvents && data.orderEvents.length > 0
                ? (
                  <Table
                    className="table-responsive table-borderless"
                    loading={loading}
                    rowKey="createdAt"
                    dataSource={data.orderEvents}
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
      <Main title="Orders">
        <Breadcrumb items={[BreadcrumbItems.ORDER, BreadcrumbItems.ORDER_DETAIL]} />
        <div className="app-content">
          <Card loading={loading} className="--big-padding">
            <div className="flex-space-between block">
              <h2 style={{ marginBottom: 0 }}>{data.client && data.client.name}</h2>
              <div>
                <span className={`app__status --${data.issuedStatus}`}>{data.issuedStatus}</span>
                { data.refunded && <span className="app__status --refunded">Refunded</span>}
              </div>
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
        <ModalStatus
          visible={modal.status}
          modalOk={this.clickChangeStatus}
          modalClose={() => this.closeModal('status')}
          data={modalData}
          changeStatus={this.changeModalDataStatus}
          changeReferenceNumber={this.changeModalDataReference}
        />
        <ModalRefund
          visible={modal.refund}
          modalOk={this.clickRefund}
          modalClose={() => this.closeModal('refund')}
          changeRefundReason={this.changeRefundReason}
        />
      </Main>
    )
  }
}

OrderDetail.propTypes = {
  match: PropTypes.object.isRequired,
}

export default OrderDetail
