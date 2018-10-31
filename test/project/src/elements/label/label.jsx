import React from 'react'
import PropTypes from 'prop-types'

const Label = props => {
  return (
    <label className='label' htmlFor={props.for}>
      {props.title}
    </label>
  )
}

Label.propTypes = {
  /**
   * The label text
   */
  title: PropTypes.string.isRequired,
  /**
   * The id of the referenced form element
   */
  for: PropTypes.string.isRequired
}

export default Label
