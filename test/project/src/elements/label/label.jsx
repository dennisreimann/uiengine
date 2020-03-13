// Require the parse-prop-types package right up front as a workaround
// for this issue: https://github.com/diegohaz/parse-prop-types/issues/4
import 'parse-prop-types'

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
  for: PropTypes.string.isRequired,

  test: PropTypes.arrayOf(
    PropTypes.shape({
      nested: PropTypes.arrayOf(
        PropTypes.shape({
          deeply: PropTypes.objectOf(PropTypes.bool)
        })
      )
    })
  )
}

export default Label
