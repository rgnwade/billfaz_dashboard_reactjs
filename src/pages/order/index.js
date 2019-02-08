import React, { Component } from 'react'
import { Tabs } from 'antd'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import Main from '../../components/main'
import { ORDER_TABS } from '../../config/order'
import MENU from '../../config/menu'
import List from './list'
import Report from './report'

class Order extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeKey: this.props.match.params.type || ORDER_TABS.LIST,
    }
  }

  componentDidMount() {
    this.setState({ ...this.state, activeKey: this.props.match.params.type || ORDER_TABS.LIST })
  }

  componentDidUpdate(nextProps) {
    const { match } = nextProps
    if (match.params.type && match.params.type !== this.props.match.params.type) {
      this.setState({ ...this.state, activeKey: this.props.match.params.type || ORDER_TABS.LIST })
    }
  }

  changeTab = (activeKey) => {
    this.props.history.push(`${MENU.ORDER}/${activeKey}`)
    this.setState({ ...this.state, activeKey })
  }

  render() {
    const { activeKey } = this.state
    const panes = [
      {
        key: ORDER_TABS.LIST,
        title: 'Order List',
        content: <List active={activeKey === ORDER_TABS.LIST} />,
      },
      // {
      //   key: ORDER_TABS.SEND_REPORT,
      //   title: 'Send Report',
      //   content: <Report />,
      // },
    ]

    return (
      <Main title="Orders">
        <div>
          {/* <Tabs activeKey={activeKey} onChange={this.changeTab} className="custom__tabs">
            {
              panes.map(x => (
                <Tabs.TabPane tab={x.title} key={x.key}>
                  <div className="app-content__tabs-content">
                    {x.content}
                  </div>
                </Tabs.TabPane>
              ))
            }
          </Tabs> */}
          <List />
        </div>
      </Main>
    )
  }
}

Order.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

export default withRouter(Order)
