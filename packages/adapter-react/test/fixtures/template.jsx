import React from 'react'
import PropTypes from 'prop-types'

const Template = props => {
  return (
    <p>
      {props.myData}
    </p>
  )
}

Template.propTypes = {
  myData: PropTypes.string.isRequired
}

export default Template
