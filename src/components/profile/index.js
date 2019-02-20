import React from 'react'
import { Avatar } from 'antd'
import PropTypes from 'prop-types'
import { getCookies } from '../../utils/cookies'
import { CONFIG_COOKIES } from '../../config/cookies'
import './profile.scss'

const Profile = ({ status, size }) => (
  <div className="app-profile__container">
    <div className="app-profile">
      <div className="app-profile__pic">
        <Avatar size={size} icon="user" />
      </div>
      <div>
        <div>{getCookies(CONFIG_COOKIES.USERNAME)}</div>
        <div className="app-profile__description">{getCookies(CONFIG_COOKIES.ROLE_NAME)}</div>
      </div>
    </div>
    {status && <div className={`app-profile__status app__agent-status --${status.split(' ').join('').toLowerCase()}`}>{status}</div>}
  </div>
)

Profile.defaultProps = {
  status: '',
  size: 60,
}

Profile.propTypes = {
  status: PropTypes.string,
  size: PropTypes.number,
}

export default Profile
