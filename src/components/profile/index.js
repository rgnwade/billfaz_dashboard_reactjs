import React from 'react'
import PropTypes from 'prop-types'
import './profile.css'

const Profile = ({ status, name, description }) => (
  <div className="app-profile__container">
    <div className="app-profile">
      <div className="app-profile__pic" />
      <div>
        <div>{name}</div>
        <div className="med-text --gray">{description}</div>
      </div>
    </div>
    {status && <div className={`app-profile__status app__agent-status --${status.split(' ').join('').toLowerCase()}`}>{status}</div>}
  </div>
)

Profile.defaultProps = {
  status: '',
  name: 'John Doe',
  description: '',
}

Profile.propTypes = {
  status: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
}

export default Profile
