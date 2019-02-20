import React from 'react'
import { withRouter } from 'react-router-dom'

import Main from '../../components/main'
import List from './list'

const Order = () => (
  <Main title="Orders">
    <div className="app-content">
      <List active />
    </div>
  </Main>
)

export default withRouter(Order)
