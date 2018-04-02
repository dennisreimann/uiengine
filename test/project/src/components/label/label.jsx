import React from 'react'

const Label = props => {
  return (
    <label className='label' htmlFor={props.for}>
      {props.title}
    </label>
  )
}

export default Label
