import React from 'react'
import Atom from '../../elements/Atom/'
import Molecule from '../Molecule/index.js'

export default props => (
  <div className='organism'>
    <Atom />
    <Molecule>molecule</Molecule>
  </div>
)
