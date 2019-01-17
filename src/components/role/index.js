import React from 'react'
import PropTypes from 'prop-types'

import { hasAccess } from '../../utils/roles'

const Role = ({ roleItem, children, classname, style }) => {
  const visible = hasAccess(roleItem)
  return (
    <div className={visible ? classname : ''} style={visible ? style : {}}>
      {
        visible && children
      }
    </div>
  )
}

Role.defaultProps = {
  style: {},
  classname: '',
}

Role.propTypes = {
  roleItem: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
    PropTypes.node,
  ]).isRequired,
  style: PropTypes.object,
  classname: PropTypes.string,
}

export default Role
