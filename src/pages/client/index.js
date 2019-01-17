import React, { Component } from 'react'
import { Tabs } from 'antd'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import Main from '../../components/main'
import { CLIENT_TABS } from '../../config/client'
import MENU from '../../config/menu'
import ClientList from './list'
import CreateCLient from './create'
import { ROLES_ITEMS } from '../../config/roles'
import { hasAccess } from '../../utils/roles'

const rawPanes = [
  {
    key: CLIENT_TABS.CREATE,
    title: 'Add Client',
    content: <CreateCLient />,
    role: ROLES_ITEMS.CLIENT_CREATE,
  },
  {
    key: CLIENT_TABS.LIST,
    title: 'Client List',
    content: <ClientList />,
    role: ROLES_ITEMS.CLIENT_LIST,
  },
]

class Client extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeKey: this.props.match.params.type || this.calculatePane(),
      panes: [],
    }
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      activeKey: this.props.match.params.type || this.calculatePane(),
      panes: rawPanes.filter(pane => hasAccess(pane.role)),
    })
  }

  componentDidUpdate(nextProps) {
    const { match } = nextProps
    if (match.params.type && match.params.type !== this.props.match.params.type) {
      this.setState({ ...this.state, activeKey: this.props.match.params.type || this.calculatePane() })
    }
  }

  changeTab = (activeKey) => {
    this.props.history.push(`${MENU.CLIENT}/${activeKey}`)
    this.setState({ ...this.state, activeKey })
  }

  calculatePane = () => {
    const { type } = this.props.match.params
    const panes = rawPanes.filter(pane => hasAccess(pane.role))
    if (type) {
      const pane = panes.find(paneAvailable => paneAvailable.key === type)
      if (pane && pane.key) return type
    }
    return (panes.length > 0 && panes[0].key) || ''
  }

  render() {
    const { activeKey, panes } = this.state
    return (
      <Main title="Client">
        <div>
          <Tabs activeKey={activeKey} onChange={this.changeTab} className="custom__tabs">
            {
              panes.map(x => (
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

Client.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

export default withRouter(Client)
