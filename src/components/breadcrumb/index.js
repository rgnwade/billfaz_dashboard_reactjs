import React from 'react'
import { Breadcrumb, Icon } from 'antd'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'

import MENU from '../../config/menu'
import './breadcrumb.scss'

export const BreadcrumbItems = {
  ORDER: <Breadcrumb.Item key="order"><Link to={MENU.ORDER}>Orders</Link></Breadcrumb.Item>,
  ORDER_DETAIL: <Breadcrumb.Item key="order-detail">Order Detail</Breadcrumb.Item>,
  PRODUCT_CLIENT: <Breadcrumb.Item key="product-client"><Link to={`${MENU.PRODUCT}/clients`}>Client Products</Link></Breadcrumb.Item>,
  PRODUCT_CLIENT_DETAIL: <Breadcrumb.Item key="product-client-detail">Product Detail</Breadcrumb.Item>,
}

const AppBreadcrumb = ({ items, history }) => {
  const goBack = () => {
    history.goBack()
  }
  return (
    <div className="app-breadcrumb">
      <Icon className="app-breadcrumb__icon" type="left" theme="outlined" onClick={goBack} />
      <Breadcrumb>
        { items }
      </Breadcrumb>
    </div>
  )
}

AppBreadcrumb.defaultProps = {
  items: [],
}

AppBreadcrumb.propTypes = {
  items: PropTypes.array,
  history: PropTypes.object.isRequired,
}

export default withRouter(AppBreadcrumb)
