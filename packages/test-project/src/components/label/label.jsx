import React from 'react'

export function Label ({ children, ...props }) {
  return (
    <label className='label' for={props.for}>
      {props.title}
    </label>
  )
}
