import React, { Component } from 'react'
import { Tabs } from 'antd'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import Main from '../../components/main'
import { PRODUCT_TABS } from '../../config/product'
import MENU from '../../config/menu'
import ProductList from './list'
import ProductCLient from './client'
import ProductApproval from './approval'
import { hasAccess } from '../../utils/roles'
import { ROLES_ITEMS } from '../../config/roles'

const panes = activeKey => [
  {
    key: PRODUCT_TABS.LIST,
    title: 'Product List',
    content: <ProductList active={activeKey === PRODUCT_TABS.LIST} />,
    role: ROLES_ITEMS.PRODUCT_LIST,
  },
  {
    key: PRODUCT_TABS.CLIENTS,
    title: 'Clients Product',
    content: <ProductCLient active={activeKey === PRODUCT_TABS.CLIENTS} />,
    role: ROLES_ITEMS.PRODUCT_CLIENT_LIST,
  },
  {
    key: PRODUCT_TABS.APPROVAL,
    title: 'Client Product Approval',
    content: <ProductApproval active={activeKey === PRODUCT_TABS.APPROVAL} />,
    role: '',
  },
]

class Product extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeKey: this.props.match.params.type || '',
    }
  }

  componentDidMount() {
    this.setState({ ...this.state, activeKey: this.props.match.params.type || this.calculatePane() })
  }

  componentDidUpdate(nextProps) {
    const { match } = nextProps
    if (match.params.type && match.params.type !== this.props.match.params.type) {
      this.setState({ ...this.state, activeKey: this.props.match.params.type || this.calculatePane() })
    }
  }

  changeTab = (activeKey) => {
    this.props.history.push(`${MENU.PRODUCT}/${activeKey}`)
    this.setState({ ...this.state, activeKey })
  }

  calculatePane = () => {
    const { type } = this.props.match.params
    const panesAvailable = panes().filter(pane => !pane.role || hasAccess(pane.role))
    if (type) {
      const pane = panesAvailable.find(paneAvailable => paneAvailable.key === type)
      if (pane && pane.key) return type
    }
    return (panesAvailable.length > 0 && panesAvailable[0].key) || ''
  }

  render() {
    const { activeKey } = this.state
    return (
      <Main title="Product">
        <div>
          <Tabs activeKey={activeKey} onChange={this.changeTab} className="custom__tabs">
            {
              panes(activeKey).map(x => (!x.role || hasAccess(x.role)) && (
                <Tabs.TabPane tab={x.title} key={x.key}>
                  <div className="app-content__tabs-content">
                    {x.content}
                  </div>
                </Tabs.TabPane>
              ))
            }
          </Tabs>
        </div>
      </Main>
    )
  }
}

Product.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

export default withRouter(Product)
