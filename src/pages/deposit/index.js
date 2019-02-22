import React, { Component } from 'react'
import { Tabs } from 'antd'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import Main from '../../components/main'
import { DEPOSIT_TYPES } from '../../config/deposit'
import MENU from '../../config/menu'
import ListDeposit from './content'
import CreateNotification from './create'
import { ROLES_ITEMS } from '../../config/roles'
import { hasAccess } from '../../utils/roles'

const panes = activeKey => [
  {
    key: DEPOSIT_TYPES.CLIENTS,
    title: 'Deposit List',
    content: <ListDeposit type={DEPOSIT_TYPES.CLIENTS} active={activeKey === DEPOSIT_TYPES.CLIENTS} />,
    role: ROLES_ITEMS.DEPOSIT_CLIENT,
  },
  // {
  //   key: DEPOSIT_TYPES.NOTIF,
  //   title: 'Notification Deposit',
  //   content: <CreateNotification type={DEPOSIT_TYPES.NOTIF} active={activeKey === DEPOSIT_TYPES.NOTIF} />,
  //   role: ROLES_ITEMS.DEPOSIT_CLIENT,
  // },
]

class Deposit extends Component {
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
    this.props.history.push(`${MENU.DEPOSIT}/${activeKey}`)
    this.setState({ ...this.state, activeKey })
  }

  calculatePane = () => {
    const { type } = this.props.match.params
    const panesAvailable = panes() // .filter(pane => hasAccess(pane.role))
    if (type) {
      const pane = panesAvailable.find(paneAvailable => paneAvailable.key === type)
      if (pane && pane.key) return type
    }
    return (panesAvailable.length > 0 && panesAvailable[0].key) || ''
  }

  render() {
    const { activeKey } = this.state
    return (
      <Main title="Deposit">
        <div>
          <Tabs activeKey={activeKey} onChange={this.changeTab} className="custom__tabs">
            {
              panes(activeKey).map(x =>(
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

Deposit.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

export default withRouter(Deposit)
