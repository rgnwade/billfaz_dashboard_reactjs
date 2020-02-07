import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'antd'

import './filter.scss'

const Filter = ({ left, right }) => (
  <div className="app-filter">
    <Card>
      <div className="app-filter-content">
        { left }
        { right }
      </div>
    </Card>
  </div>
)

Filter.defaultProps = {
  left: <div />,
  right: <div />,
}

Filter.propTypes = {
  left: PropTypes.element,
  right: PropTypes.element,
}

export default Filter
