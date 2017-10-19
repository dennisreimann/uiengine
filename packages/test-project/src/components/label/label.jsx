import React from 'react'

export function Label ({ children, ...props }) {
  return (
    <label className='label' htmlFor={props.for}>
      {props.title}
    </label>
  )
}
