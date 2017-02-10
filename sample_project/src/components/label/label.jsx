import React from 'react'

export function Label ({ children, ...props }) {
  console.log(props, children)
  return (
    <label className='label' for={props.for}>
      {props.title}
      <span>{children}</span>
    </label>
  )
}
