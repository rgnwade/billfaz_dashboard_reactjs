import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import Main from '../../components/main'
import List from './list'

const Order = () => (
  <Main title="Orders">
    <div className="app-content">
      <List active />
    </div>
  </Main>
)

Order.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

export default withRouter(Order)
