import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import Main from '../../components/main'
import { PRODUCT_TABS } from '../../config/product'
import MENU from '../../config/menu'
import ProductList from './list'
import { hasAccess } from '../../utils/roles'
import { ROLES_ITEMS } from '../../config/roles'

const panes = activeKey => [
  {
    key: PRODUCT_TABS.LIST,
    title: 'Product List',
    content: <ProductList active={activeKey === PRODUCT_TABS.LIST} />,
    role: ROLES_ITEMS.PRODUCT_LIST,
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
    return (
      <Main title="Product">
        <div className="app-content__tabs-content" style={{padding: '15px'}}>
          <ProductList />
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
