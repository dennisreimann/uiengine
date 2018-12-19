import React from 'react'
import Organism from '..'
import Molecule from '../../Molecule'

export default props => (
  <div className='organism-variant'>
    <Organism {...props} />
    <Molecule>molecule</Molecule>
  </div>
)
